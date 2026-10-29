import { BookOpen, Database, FileText, FlaskConical, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { DataSourceStatus } from '@/components/DataSourceStatus';
import { useApp } from '@/context/AppContext';
import { getTranslation } from '@/lib/i18n';
import { EXTENDED_LANGUAGES, getSpeechRecognitionCtor } from '@/lib/languageSupport';

interface MatrixRow {
  name: string;
  ui: string;
  chat: string;
  search: string;
  speechIn: string;
  speechOut: string;
  pdf: string;
}

const CORE_CAPS: Record<string, { chat: boolean; search: boolean }> = {
  en: { chat: true, search: true },
  fr: { chat: true, search: true },
  ar: { chat: true, search: true },
  'ar-TN': { chat: true, search: true },
};

const TRANSLATED_UI = ['en', 'fr', 'ar'];

export function Methodology() {
  const { language } = useApp();
  const t = getTranslation(language).methodology;
  const speechInputAvailable = typeof getSpeechRecognitionCtor() === 'function';
  const coreNames: Record<string, string> = {
    en: 'English', fr: 'Français', ar: 'العربية', 'ar-TN': 'Tunisian Arabic (تونسي)',
  };

  const matrixRows: MatrixRow[] = [
    ...(Object.keys(CORE_CAPS) as string[]).map((code) => {
      const caps = CORE_CAPS[code] ?? { chat: true, search: true };
      return {
        name: coreNames[code] ?? code,
        ui: TRANSLATED_UI.includes(code) ? t.langFull : t.langAiOnly,
        chat: caps.chat ? t.langFull : t.langNo,
        search: caps.search ? t.langFull : t.langEnglishOnly,
        speechIn: speechInputAvailable ? t.langFull : t.langNo,
        speechOut: t.langDeviceDependent,
        pdf: t.langAiOnly,
      };
    }),
    ...EXTENDED_LANGUAGES.map((l) => ({
      name: `${l.nativeLabel} (${l.label})`,
      ui: t.langPartial,
      chat: l.aiInput ? t.langAiOnly : t.langNo,
      search: t.langEnglishOnly,
      speechIn: speechInputAvailable && l.speechRecognition ? t.langFull : t.langNo,
      speechOut: l.speechSynthesis ? t.langDeviceDependent : t.langNo,
      pdf: t.langAiOnly,
    })),
  ];

  return (
    <div className="animate-fade-in max-w-4xl">
      <PageHeader
        icon={<BookOpen className="w-6 h-6" />}
        title={t.title}
        subtitle={t.subtitle}
      />

      <div className="prose-onco">
        {/* What this is */}
        <section className="bg-white rounded-xl border border-navy-100 p-6 mb-4">
          <h2 className="font-bold text-navy-900 text-lg mb-3">{t.whatTitle}</h2>
          <p className="text-sm text-navy-600 leading-relaxed mb-3">
            {t.whatBody1}
          </p>
          <p className="text-sm text-navy-600 leading-relaxed">
            {t.whatNotPre}<strong>{t.notWord}</strong>{t.whatNotPost}
          </p>
        </section>

        {/* Live connector status — real test requests, truthful states */}
        <DataSourceStatus />

        {/* Data sources */}
        <section className="bg-white rounded-xl border border-navy-100 p-6 mb-4">
          <h2 className="font-bold text-navy-900 text-lg mb-4">{t.sourcesTitle}</h2>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-navy-900 text-sm">{t.pubmedTitle}</h3>
                <p className="text-xs text-navy-600 leading-relaxed mt-1">
                  {t.pubmedPre}<a href="https://eutils.ncbi.nlm.nih.gov/entrez/eutils/" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">NCBI E-utilities API</a>{t.pubmedPost}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0">
                <Database className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <h3 className="font-semibold text-navy-900 text-sm">{t.pmcTitle}</h3>
                <p className="text-xs text-navy-600 leading-relaxed mt-1">
                  {t.pmcPre}<a href="https://www.ebi.ac.uk/europepmc/webservices/rest/" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">Europe PMC REST API</a>{t.pmcPost}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                <FlaskConical className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-navy-900 text-sm">{t.ctTitle}</h3>
                <p className="text-xs text-navy-600 leading-relaxed mt-1">
                  {t.ctPre}<a href="https://clinicaltrials.gov/api/v2/" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">ClinicalTrials.gov API v2</a>{t.ctPost}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="bg-white rounded-xl border border-navy-100 p-6 mb-4">
          <h2 className="font-bold text-navy-900 text-lg mb-3">{t.howTitle}</h2>
          <ol className="space-y-2 text-sm text-navy-600">
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-navy-100 text-navy-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
              <span className="leading-relaxed">{t.step1}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-navy-100 text-navy-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
              <span className="leading-relaxed">{t.step2}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-navy-100 text-navy-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
              <span className="leading-relaxed">{t.step3}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-navy-100 text-navy-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">4</span>
              <span className="leading-relaxed">{t.step4}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-navy-100 text-navy-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">5</span>
              <span className="leading-relaxed">{t.step5}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-navy-100 text-navy-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">6</span>
              <span className="leading-relaxed">{t.step6}</span>
            </li>
          </ol>
        </section>

        {/* Research Assistant */}
        <section className="bg-white rounded-xl border border-navy-100 p-6 mb-4">
          <h2 className="font-bold text-navy-900 text-lg mb-3">{t.raTitle}</h2>
          <p className="text-sm text-navy-600 leading-relaxed mb-3">
            {t.raIntroPre}<strong>{t.raIntroStrong}</strong>{t.raIntroPost}
          </p>
          <ul className="space-y-1.5 text-sm text-navy-600 mb-3">
            <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" /> {t.raList1}</li>
            <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" /> {t.raList2}</li>
            <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" /> {t.raList3}</li>
            <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" /> {t.raList4}</li>
            <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" /> {t.raList5}</li>
          </ul>
          <p className="text-sm text-navy-600 leading-relaxed">
            {t.raOutroPre}<strong>{t.outroNot}</strong>{t.raOutroPost}
          </p>
        </section>

        {/* Limitations */}
        <section className="bg-white rounded-xl border border-navy-100 p-6 mb-4">
          <h2 className="font-bold text-navy-900 text-lg mb-3">{t.limTitle}</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-navy-600 leading-relaxed">
                <strong>{t.lim1Strong}</strong>{t.lim1Rest}
              </p>
            </div>
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-navy-600 leading-relaxed">
                <strong>{t.lim2Strong}</strong>{t.lim2Rest}
              </p>
            </div>
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-navy-600 leading-relaxed">
                <strong>{t.lim3Strong}</strong>{t.lim3Rest}
              </p>
            </div>
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-navy-600 leading-relaxed">
                <strong>{t.lim4Strong}</strong>{t.lim4Rest}
              </p>
            </div>
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-navy-600 leading-relaxed">
                <strong>{t.lim5Strong}</strong>{t.lim5Rest}
              </p>
            </div>
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-navy-600 leading-relaxed">
                <strong>{t.lim6Strong}</strong>{t.lim6Rest}
              </p>
            </div>
          </div>
        </section>

        {/* Ethics */}
        <section className="bg-white rounded-xl border border-navy-100 p-6 mb-4">
          <h2 className="font-bold text-navy-900 text-lg mb-3">{t.ethicsTitle}</h2>
          <ul className="space-y-2 text-sm text-navy-600">
            <li>• {t.ethics1}</li>
            <li>• {t.ethics2}</li>
            <li>• {t.ethics3}</li>
            <li>• {t.ethics4}</li>
            <li>• {t.ethics5}</li>
            <li>• {t.ethics6}</li>
          </ul>
        </section>

        {/* Language capability matrix */}
        <section className="bg-white rounded-xl border border-navy-100 p-6 mb-4">
          <h2 className="font-bold text-navy-900 text-lg mb-2">{t.langMatrixTitle}</h2>
          <p className="text-xs text-navy-500 leading-relaxed mb-4">{t.langMatrixIntro}</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs" dir="ltr">
              <caption className="sr-only">{t.langMatrixTitle}</caption>
              <thead>
                <tr className="text-start text-navy-500 border-b border-navy-100">
                  <th scope="col" className="py-2 pr-3 font-semibold">Language</th>
                  <th scope="col" className="py-2 px-2 font-semibold">{t.langCapUi}</th>
                  <th scope="col" className="py-2 px-2 font-semibold">{t.langCapChat}</th>
                  <th scope="col" className="py-2 px-2 font-semibold">{t.langCapSearch}</th>
                  <th scope="col" className="py-2 px-2 font-semibold">{t.langCapSpeechIn}</th>
                  <th scope="col" className="py-2 px-2 font-semibold">{t.langCapSpeechOut}</th>
                  <th scope="col" className="py-2 pl-2 font-semibold">{t.langCapPdf}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-50">
                {matrixRows.map((row) => (
                  <tr key={row.name} className="text-navy-700">
                    <th scope="row" className="py-2 pr-3 font-medium text-navy-900 text-start whitespace-nowrap">
                      {row.name}
                    </th>
                    <td className="py-2 px-2">{row.ui}</td>
                    <td className="py-2 px-2">{row.chat}</td>
                    <td className="py-2 px-2">{row.search}</td>
                    <td className="py-2 px-2">{row.speechIn}</td>
                    <td className="py-2 px-2">{row.speechOut}</td>
                    <td className="py-2 pl-2">{row.pdf}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-navy-500 leading-relaxed mt-3">{t.langMatrixFootnote}</p>
        </section>

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-900 text-sm mb-1">{t.discTitle}</p>
              <p className="text-xs text-amber-800 leading-relaxed">
                {t.discBody}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
