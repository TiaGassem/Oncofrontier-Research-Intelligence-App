import { ShieldCheck, FileText, Mail, AlertTriangle } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { useApp } from '@/context/AppContext';
import { getTranslation } from '@/lib/i18n';

export type LegalKind = 'privacy' | 'terms' | 'contact';

/**
 * CONTACT_ADDRESS is a placeholder. A real, monitored address must be supplied
 * by the project owner before these pages are published — until then the pages
 * are drafts and public account creation should stay disabled.
 */
const CONTACT_ADDRESS = 'contact@oncofrontier.example (replace before launch)';

function DraftNotice() {
  return (
    <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3.5">
      <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" aria-hidden="true" />
      <p className="text-xs leading-relaxed text-amber-900">
        <strong className="font-semibold">Draft for review.</strong> This text describes how the
        application actually behaves today, but it has not been reviewed by the project owner or by
        legal counsel. Replace the contact address and obtain approval before enabling public
        accounts or collecting personal research data.
      </p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <h2 className="text-base font-semibold text-navy-900">{title}</h2>
      <div className="mt-1.5 space-y-2 text-sm leading-relaxed text-navy-600">{children}</div>
    </section>
  );
}

function Privacy() {
  return (
    <>
      <DraftNotice />
      <Section title="What we store">
        <p>
          Without an account, nothing leaves your browser except the queries you send to the public
          research databases. Your language, accessibility preferences and workspace choice are kept
          in local storage on your device.
        </p>
        <p>
          If you create an account, we store your email address and a hashed password (handled by
          Supabase Auth), together with the items you deliberately save: favourites, projects,
          project items, notes, saved searches, and Companion chat messages.
        </p>
      </Section>
      <Section title="What we do not ask for">
        <p>
          OncoFrontiers never asks for your diagnosis, medical records, insurance details or any
          other health information. Please do not paste personal medical information into chat or
          notes fields. The application cannot provide individual medical advice.
        </p>
      </Section>
      <Section title="Who processes data">
        <p>
          Account data is hosted in our Supabase project, protected by row-level security so that
          each row is only readable by the account that created it. Research queries are sent to
          public APIs (PubMed, Europe PMC, ClinicalTrials.gov, Crossref, OpenAlex, Open Targets,
          PubChem), which receive the search terms you type.
        </p>
        <p>
          Companion chat replies are generated through a server-side function; your provider key is
          never exposed to the browser. Optional, user-starting features (image analysis, audio
          transcription, speech playback) send the selected content to that provider only after you
          start them.
        </p>
      </Section>
      <Section title="Retention and deletion">
        <p>
          Saved items remain until you delete them. Self-service account deletion is not yet
          implemented: to have an account and its rows removed, contact {CONTACT_ADDRESS} from the
          address on the account.
        </p>
      </Section>
      <Section title="Your choices">
        <p>
          You can browse all public research and education content without an account, and you can
          clear locally stored preferences at any time by clearing this site&apos;s browser data.
        </p>
      </Section>
    </>
  );
}

function Terms() {
  return (
    <>
      <DraftNotice />
      <Section title="What OncoFrontiers is">
        <p>
          OncoFrontiers is a research and education platform. It retrieves records from public
          scientific databases and presents them with links to their original sources. It is not a
          medical device and does not diagnose, treat, or predict an individual outcome.
        </p>
      </Section>
      <Section title="No medical advice">
        <p>
          Nothing here is medical advice. Survival statistics and disease information describe
          populations, not individuals. Always consult a qualified healthcare professional about
          your own situation, and contact emergency services for urgent symptoms.
        </p>
      </Section>
      <Section title="Accuracy and availability">
        <p>
          Records come from third-party services and may be incomplete, delayed, or temporarily
          unavailable. We do not fabricate results, but we cannot guarantee that upstream data is
          correct. Scores and annotations from databases are evidence summaries, not probabilities
          of clinical success.
        </p>
      </Section>
      <Section title="Acceptable use">
        <p>
          Do not attempt to access another person&apos;s data, circumvent authentication, overload
          the upstream research APIs, or use the platform to provide clinical care to others.
        </p>
      </Section>
      <Section title="Licence">
        <p>
          The application source is released under AGPL-3.0. Data retrieved from external sources
          remains subject to those sources&apos; own terms and licences.
        </p>
      </Section>
    </>
  );
}

function Contact() {
  return (
    <>
      <DraftNotice />
      <Section title="Get in touch">
        <p>
          Questions about the project, a data correction, or an accessibility barrier you
          encountered: write to {CONTACT_ADDRESS}.
        </p>
      </Section>
      <Section title="Account and data deletion">
        <p>
          Email from the address associated with the account and ask for deletion. Include the email
          you signed up with; do not send passwords, medical records, or identity documents.
        </p>
      </Section>
      <Section title="Reporting a problem">
        <p>
          For an incorrect record, include the PMID, DOI or NCT identifier so the original source
          can be checked. For an accessibility issue, describe the page and the assistive technology
          you were using.
        </p>
      </Section>
    </>
  );
}

export function LegalPage({ kind }: { kind: LegalKind }) {
  const { language } = useApp();
  const t = getTranslation(language);

  const meta: Record<LegalKind, { title: string; subtitle: string; icon: React.ReactNode }> = {
    privacy: {
      title: 'Privacy notice',
      subtitle: 'What is stored, where, and what is never collected.',
      icon: <ShieldCheck className="w-5 h-5" />,
    },
    terms: {
      title: 'Terms of use',
      subtitle: 'Scope, limitations, and acceptable use of the platform.',
      icon: <FileText className="w-5 h-5" />,
    },
    contact: {
      title: 'Contact and data requests',
      subtitle: 'How to reach the project and request account deletion.',
      icon: <Mail className="w-5 h-5" />,
    },
  };

  const current = meta[kind];

  return (
    <div className="max-w-3xl">
      <PageHeader icon={current.icon} title={current.title} subtitle={current.subtitle} accent="teal" />
      {kind === 'privacy' && <Privacy />}
      {kind === 'terms' && <Terms />}
      {kind === 'contact' && <Contact />}
      <p className="mt-8 border-t border-navy-100 pt-4 text-xs text-navy-400">
        {t.dashboard.disclaimer}
      </p>
    </div>
  );
}
