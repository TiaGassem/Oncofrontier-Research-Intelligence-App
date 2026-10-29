// Companion chat proxy. Talks to an OpenAI-compatible chat model using a
// server-side secret so the API key never reaches the browser.
//
// Secrets used (first match wins):
//   LLM_API_KEY + optional LLM_BASE_URL + optional LLM_MODEL
//   OPENAI_API_KEY (defaults to api.openai.com, gpt-4o-mini)
//
// If no key is configured the function returns 501 { error: "not_configured" }
// and the frontend falls back to the source-grounded search flow. When enabled,
// the LLM path requires a real signed-in Supabase user to prevent public key abuse.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const LANGUAGE_NAME: Record<string, string> = {
  en: "English",
  fr: "French",
  ar: "Arabic (Modern Standard)",
  "ar-TN": "Tunisian Arabic (reply in the same variety the user wrote: dialect Arabic script, or Arabizi/Latin transliteration)",
  es: "Spanish",
  de: "German",
  pt: "Portuguese",
  it: "Italian",
  tr: "Turkish",
  zh: "Chinese (Simplified)",
  ja: "Japanese",
  ko: "Korean",
  hi: "Hindi",
  ur: "Urdu",
  fa: "Persian",
  bn: "Bengali",
  id: "Indonesian",
  vi: "Vietnamese",
  th: "Thai",
  sw: "Swahili",
};

function systemPrompt(language: string): string {
  const langName = LANGUAGE_NAME[language] ?? "English";
  return [
    `You are the OncoFrontiers Companion, a patient-education assistant for people affected by cancer (patients, relatives, caregivers).`,
    `Reply in ${langName} in plain, warm, non-technical language. Short paragraphs. If the user writes informally or with spelling mistakes, understand them anyway.`,
    `Hard rules:`,
    `- Never diagnose. Never interpret symptoms as confirming cancer. If someone describes symptoms, explain that only a clinician can investigate, and encourage prompt professional assessment.`,
    `- Never recommend changing or stopping medication or treatment. Never prescribe.`,
    `- Never promise survival or give personal predictions. Population statistics are not individual prognoses.`,
    `- Never invent citations, studies, statistics, or trial names. If you mention published evidence, say it is general knowledge, not a specific citation.`,
    `- If a message suggests urgent danger (severe bleeding, difficulty breathing, confusion, chest pain, suicidal thoughts), tell the person to seek emergency care immediately.`,
    `- Be honest about uncertainty. It is fine to say you do not know.`,
    `- Keep answers under ~250 words unless asked for more detail. Offer to explain any medical term more simply.`,
  ].join("\n");
}

async function verifySignedInUser(req: Request): Promise<'valid' | 'unauthorized' | 'unavailable'> {
  const authorization = req.headers.get('Authorization');
  const projectUrl = Deno.env.get('SUPABASE_URL');
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
  if (!authorization || !projectUrl || !anonKey) return 'unavailable';

  try {
    const response = await fetch(`${projectUrl.replace(/\/$/, '')}/auth/v1/user`, {
      headers: { apikey: anonKey, Authorization: authorization },
      signal: AbortSignal.timeout(5_000),
    });
    if (response.status === 401 || response.status === 403) return 'unauthorized';
    if (!response.ok) return 'unavailable';
    const user = await response.json();
    return typeof user?.id === 'string' ? 'valid' : 'unauthorized';
  } catch {
    return 'unavailable';
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "method_not_allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("LLM_API_KEY") ?? Deno.env.get("OPENAI_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "not_configured" }), {
        status: 501,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const language = typeof body?.language === "string" ? body.language.slice(0, 5) : "en";
    // Sanitize to a known language key so arbitrary client input can't
    // inject unexpected prompt text through the language name.
    const langKey =
      Object.prototype.hasOwnProperty.call(LANGUAGE_NAME, language) &&
      /^[a-z]{2}(-[A-Za-z]{2,4})?$/.test(language)
        ? language
        : "en";
    const rawTurns: unknown = body?.messages;
    if (!Array.isArray(rawTurns) || rawTurns.length === 0 || rawTurns.length > 20) {
      return new Response(JSON.stringify({ error: "bad_request" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
      { role: "system", content: systemPrompt(langKey) },
    ];
    for (const turn of rawTurns) {
      const role = turn?.role;
      const content = typeof turn?.content === "string" ? turn.content : "";
      if ((role === "user" || role === "assistant") && content) {
        messages.push({ role, content: content.slice(0, 4000) });
      }
    }
    if (!messages.some((m) => m.role === "user")) {
      return new Response(JSON.stringify({ error: "bad_request" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const auth = await verifySignedInUser(req);
    if (auth === 'unauthorized') {
      return new Response(JSON.stringify({ error: "sign_in_required" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (auth === 'unavailable') {
      return new Response(JSON.stringify({ error: "auth_verification_unavailable" }), {
        status: 503,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const baseUrl = (Deno.env.get("LLM_BASE_URL") ?? "https://api.openai.com/v1").replace(/\/$/, "");
    const model = Deno.env.get("LLM_MODEL") ?? "gpt-4o-mini";

    const upstream = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: 700,
        temperature: 0.4,
      }),
      signal: AbortSignal.timeout(25_000),
    });

    if (!upstream.ok) {
      console.error("LLM upstream error", upstream.status);
      // Pass through the most actionable provider failures so the client
      // can show the right message instead of a generic "error".
      const status = upstream.status;
      let code = "upstream_error";
      let outStatus = 502;
      if (status === 401 || status === 403) { code = "provider_auth_failed"; outStatus = 502; }
      else if (status === 429) { code = "rate_limited"; outStatus = 429; }
      return new Response(JSON.stringify({ error: code }), {
        status: outStatus,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await upstream.json();
    const reply: string | undefined = data?.choices?.[0]?.message?.content;
    if (!reply) {
      return new Response(JSON.stringify({ error: "empty_reply" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ reply, model }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("companion-chat error", err);
    return new Response(JSON.stringify({ error: "server_error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
