import { useState, useMemo } from 'react';
import { Globe2, TrendingUp, TrendingDown, AlertCircle, ExternalLink, Info } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { getTranslation } from '@/lib/i18n';
import { PageHeader } from '@/components/PageHeader';

interface CancerStat {
  rank: number;
  cancer: string;
  cases: number;
  deaths: number;
  casesPercent: number;
  deathsPercent: number;
}

interface RegionStat {
  region: string;
  cases: number;
  deaths: number;
  prevalence: number;
  topCancer: string;
}

const GLOBAL_TOTALS = {
  newCases: 19965991,
  deaths: 9736856,
  prevalence5yr: 53560331,
};

const TOP_CANCERS: CancerStat[] = [
  { rank: 1, cancer: 'Female breast', cases: 2296284, deaths: 666142, casesPercent: 11.5, deathsPercent: 6.8 },
  { rank: 2, cancer: 'Lung', cases: 2480598, deaths: 1817431, casesPercent: 12.4, deathsPercent: 18.7 },
  { rank: 3, cancer: 'Prostate', cases: 1466720, deaths: 396802, casesPercent: 7.3, deathsPercent: 4.1 },
  { rank: 4, cancer: 'Colorectum', cases: 1926079, deaths: 903865, casesPercent: 9.6, deathsPercent: 9.3 },
  { rank: 5, cancer: 'Stomach', cases: 968769, deaths: 660110, casesPercent: 4.9, deathsPercent: 6.8 },
  { rank: 6, cancer: 'Liver', cases: 865413, deaths: 757891, casesPercent: 4.3, deathsPercent: 7.8 },
  { rank: 7, cancer: 'Thyroid', cases: 821342, deaths: 44028, casesPercent: 4.1, deathsPercent: 0.5 },
  { rank: 8, cancer: 'Cervix uteri', cases: 661021, deaths: 348186, casesPercent: 3.3, deathsPercent: 3.6 },
  { rank: 9, cancer: 'Pancreas', cases: 510982, deaths: 467409, casesPercent: 2.6, deathsPercent: 4.8 },
  { rank: 10, cancer: 'Leukaemia', cases: 487368, deaths: 304943, casesPercent: 2.4, deathsPercent: 3.1 },
];

const REGION_STATS: Record<string, RegionStat> = {
  worldwide: { region: 'Worldwide', cases: 19965991, deaths: 9736856, prevalence: 53560331, topCancer: 'Female breast' },
  africa: { region: 'Africa', cases: 883644, deaths: 563059, prevalence: 1750000, topCancer: 'Cervix uteri' },
  americas: { region: 'Americas', cases: 3387939, deaths: 1436534, prevalence: 9000000, topCancer: 'Female breast' },
  easternMed: { region: 'Eastern Mediterranean', cases: 655109, deaths: 460264, prevalence: 1800000, topCancer: 'Lung' },
  europe: { region: 'Europe', cases: 4420055, deaths: 1939016, prevalence: 12000000, topCancer: 'Female breast' },
  southEastAsia: { region: 'South-East Asia', cases: 2202460, deaths: 1451532, prevalence: 6500000, topCancer: 'Lung' },
  westernPacific: { region: 'Western Pacific', cases: 6417884, deaths: 3886951, prevalence: 15500000, topCancer: 'Lung' },
};

const CANCER_TYPES = ['All cancers', 'Female breast', 'Lung', 'Prostate', 'Colorectum', 'Stomach', 'Liver', 'Thyroid', 'Cervix uteri', 'Pancreas', 'Leukaemia', 'Oesophagus', 'Ovary', 'Bladder', 'Kidney', 'Non-melanoma skin', 'Lip/oral cavity', 'Lymphoma', 'Melanoma of skin', 'Brain/CNS'];

function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(0) + 'K';
  return n.toString();
}

function formatFull(n: number): string {
  return n.toLocaleString('en-US');
}

export function GlobalBurdenAtlas() {
  const { language, direction } = useApp();
  const t = getTranslation(language);
  const tBurden = t.burden;

  const [selectedRegion, setSelectedRegion] = useState<string>('worldwide');
  const [selectedCancer, setSelectedCancer] = useState<string>('All cancers');
  const [view, setView] = useState<'overview' | 'regions' | 'ranking'>('overview');

  const regionData = REGION_STATS[selectedRegion];
  const maxCases = Math.max(...TOP_CANCERS.map(c => c.cases));
  const maxDeaths = Math.max(...TOP_CANCERS.map(c => c.deaths));

  const sortedByCases = useMemo(() => [...TOP_CANCERS].sort((a, b) => b.cases - a.cases), []);
  const sortedByDeaths = useMemo(() => [...TOP_CANCERS].sort((a, b) => b.deaths - a.deaths), []);

  return (
    <div className="animate-fade-in" dir={direction}>
      <PageHeader
        icon={<Globe2 className="w-5 h-5 text-teal-400" />}
        title={tBurden.title}
        subtitle={tBurden.subtitle}
      />

      {/* View toggle */}
      <div className="flex gap-1 mb-6 bg-navy-50 rounded-xl p-1 w-fit">
        {([
          { id: 'overview', label: tBurden.globalOverview },
          { id: 'regions', label: tBurden.regionComparison },
          { id: 'ranking', label: tBurden.cancerRanking },
        ] as const).map(v => (
          <button
            key={v.id}
            onClick={() => setView(v.id)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              view === v.id ? 'bg-white text-navy-900 shadow-sm' : 'text-navy-500 hover:text-navy-700'
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>

      {/* Global Overview */}
      {view === 'overview' && (
        <div className="space-y-6">
          {/* Big stat cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-navy-900 to-navy-800 rounded-2xl p-6 text-white relative overflow-hidden">
              <div className="absolute -top-4 -end-4 w-24 h-24 bg-teal-500/10 rounded-full blur-2xl" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-teal-500/20 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-teal-400" />
                  </div>
                  <span className="text-xs font-medium text-navy-300 uppercase tracking-wider">{tBurden.newCases}</span>
                </div>
                <div className="text-3xl font-bold">{formatNumber(GLOBAL_TOTALS.newCases)}</div>
                <div className="text-xs text-navy-400 mt-1">{formatFull(GLOBAL_TOTALS.newCases)} — GLOBOCAN 2022</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-navy-800 to-navy-700 rounded-2xl p-6 text-white relative overflow-hidden">
              <div className="absolute -top-4 -end-4 w-24 h-24 bg-red-500/10 rounded-full blur-2xl" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-red-500/20 flex items-center justify-center">
                    <TrendingDown className="w-5 h-5 text-red-400" />
                  </div>
                  <span className="text-xs font-medium text-navy-300 uppercase tracking-wider">{tBurden.deaths}</span>
                </div>
                <div className="text-3xl font-bold">{formatNumber(GLOBAL_TOTALS.deaths)}</div>
                <div className="text-xs text-navy-400 mt-1">{formatFull(GLOBAL_TOTALS.deaths)} — GLOBOCAN 2022</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-navy-800 to-navy-700 rounded-2xl p-6 text-white relative overflow-hidden">
              <div className="absolute -top-4 -end-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Globe2 className="w-5 h-5 text-blue-400" />
                  </div>
                  <span className="text-xs font-medium text-navy-300 uppercase tracking-wider">{tBurden.prevalence}</span>
                </div>
                <div className="text-3xl font-bold">{formatNumber(GLOBAL_TOTALS.prevalence5yr)}</div>
                <div className="text-xs text-navy-400 mt-1">{formatFull(GLOBAL_TOTALS.prevalence5yr)} — 5-year prevalence</div>
              </div>
            </div>
          </div>

          {/* Top 10 cancers — dual bar chart */}
          <div className="bg-white rounded-2xl border border-navy-100 p-6" data-chart>
            <h3 className="text-base font-bold text-navy-900 mb-4">{tBurden.topCancers}</h3>
            <div className="space-y-3">
              {sortedByCases.map((c, i) => (
                <div key={c.cancer} className="group">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium text-navy-700">
                      <span className="text-navy-400 inline-block w-6">{c.rank}.</span> {c.cancer}
                    </span>
                    <span className="text-navy-500">
                      {formatFull(c.cases)} {tBurden.cases} · {c.casesPercent}%
                    </span>
                  </div>
                  <div className="h-7 bg-navy-50 rounded-lg overflow-hidden">
                    <div
                      className="h-full rounded-lg transition-all duration-700 ease-out flex items-center justify-end px-2"
                      style={{
                        width: `${(c.cases / maxCases) * 100}%`,
                        backgroundColor: `var(--chart-${(i % 6) + 1})`,
                      }}
                    >
                      <span className="text-[10px] text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                        {c.casesPercent}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Deaths breakdown */}
          <div className="bg-white rounded-2xl border border-navy-100 p-6" data-chart>
            <h3 className="text-base font-bold text-navy-900 mb-4">{tBurden.deaths} — {tBurden.topCancers}</h3>
            <div className="space-y-3">
              {sortedByDeaths.map((c) => (
                <div key={c.cancer} className="group">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium text-navy-700">{c.cancer}</span>
                    <span className="text-navy-500">
                      {formatFull(c.deaths)} · {c.deathsPercent}%
                    </span>
                  </div>
                  <div className="h-6 bg-navy-50 rounded-lg overflow-hidden">
                    <div
                      className="h-full rounded-lg transition-all duration-700 ease-out"
                      style={{ width: `${(c.deaths / maxDeaths) * 100}%`, backgroundColor: 'var(--chart-2)' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Regional Comparison */}
      {view === 'regions' && (
        <div className="space-y-6">
          {/* Region selector */}
          <div className="bg-white rounded-2xl border border-navy-100 p-6" data-chart>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
              <h3 className="text-base font-bold text-navy-900">{tBurden.byRegion}</h3>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="px-3 py-2 text-sm bg-navy-50 rounded-lg border border-navy-100 text-navy-900 outline-none focus:border-teal-400"
              >
                <option value="worldwide">{tBurden.worldwide}</option>
                <option value="africa">{tBurden.africa}</option>
                <option value="americas">{tBurden.americas}</option>
                <option value="easternMed">{tBurden.easternMed}</option>
                <option value="europe">{tBurden.europe}</option>
                <option value="southEastAsia">{tBurden.southEastAsia}</option>
                <option value="westernPacific">{tBurden.westernPacific}</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div className="bg-teal-50 rounded-xl p-4">
                <div className="text-xs text-teal-600 font-medium mb-1">{tBurden.totalCases}</div>
                <div className="text-2xl font-bold text-navy-900">{formatNumber(regionData.cases)}</div>
                <div className="text-xs text-navy-400">{formatFull(regionData.cases)}</div>
              </div>
              <div className="bg-red-50 rounded-xl p-4">
                <div className="text-xs text-red-600 font-medium mb-1">{tBurden.totalDeaths}</div>
                <div className="text-2xl font-bold text-navy-900">{formatNumber(regionData.deaths)}</div>
                <div className="text-xs text-navy-400">{formatFull(regionData.deaths)}</div>
              </div>
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="text-xs text-blue-600 font-medium mb-1">{tBurden.fiveYearPrevalence}</div>
                <div className="text-2xl font-bold text-navy-900">{formatNumber(regionData.prevalence)}</div>
                <div className="text-xs text-navy-400">{formatFull(regionData.prevalence)}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm bg-navy-50 rounded-lg p-3">
              <Info className="w-4 h-4 text-navy-400 flex-shrink-0" />
              <span className="text-navy-600">
                {tBurden.topCancers.split(' ').slice(0, 3).join(' ')}: <strong className="text-navy-900">{regionData.topCancer}</strong>
              </span>
            </div>
          </div>

          {/* All regions comparison bars */}
          <div className="bg-white rounded-2xl border border-navy-100 p-6">
            <h3 className="text-base font-bold text-navy-900 mb-4">{tBurden.regionComparison}</h3>
            <div className="space-y-4">
              {Object.values(REGION_STATS).filter(r => r.region !== 'Worldwide').map((r) => {
                const maxRegCases = Math.max(...Object.values(REGION_STATS).filter(x => x.region !== 'Worldwide').map(x => x.cases));
                return (
                  <div key={r.region}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-medium text-navy-700">{r.region}</span>
                      <span className="text-navy-500">{formatFull(r.cases)} {tBurden.cases}</span>
                    </div>
                    <div className="flex gap-1 h-8" aria-hidden="true">
                      <div className="h-full rounded-lg transition-all duration-700" style={{ width: `${(r.cases / maxRegCases) * 70}%`, backgroundColor: 'var(--chart-1)' }} />
                      <div className="h-full rounded-lg transition-all duration-700 opacity-80" style={{ width: `${(r.deaths / maxRegCases) * 70}%`, backgroundColor: 'var(--chart-2)' }} />
                    </div>
                    <div className="flex gap-4 mt-1 text-[10px] text-navy-400">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm" style={{ backgroundColor: 'var(--chart-1)' }} />{formatNumber(r.cases)} {tBurden.cases}</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm" style={{ backgroundColor: 'var(--chart-2)' }} />{formatNumber(r.deaths)} {tBurden.deaths2}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Cancer Type Ranking */}
      {view === 'ranking' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-navy-100 p-6" data-chart>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
              <h3 className="text-base font-bold text-navy-900">{tBurden.cancerRanking}</h3>
              <select
                value={selectedCancer}
                onChange={(e) => setSelectedCancer(e.target.value)}
                className="px-3 py-2 text-sm bg-navy-50 rounded-lg border border-navy-100 text-navy-900 outline-none focus:border-teal-400"
              >
                {CANCER_TYPES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-navy-100">
                    <th className="text-start py-2 px-3 text-xs font-semibold text-navy-500 uppercase">{tBurden.rank}</th>
                    <th className="text-start py-2 px-3 text-xs font-semibold text-navy-500 uppercase">{tBurden.cancerType}</th>
                    <th className="text-end py-2 px-3 text-xs font-semibold text-navy-500 uppercase">{tBurden.cases}</th>
                    <th className="text-end py-2 px-3 text-xs font-semibold text-navy-500 uppercase">{tBurden.deaths2}</th>
                    <th className="text-end py-2 px-3 text-xs font-semibold text-navy-500 uppercase">%</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedByCases.map((c) => {
                    const isHighlighted = selectedCancer !== 'All cancers' && c.cancer === selectedCancer;
                    return (
                      <tr
                        key={c.cancer}
                        className={`border-b border-navy-50 transition-colors ${isHighlighted ? 'bg-teal-50' : 'hover:bg-navy-50/50'}`}
                      >
                        <td className="py-2.5 px-3 text-navy-400 font-medium">{c.rank}</td>
                        <td className="py-2.5 px-3 font-medium text-navy-900">{c.cancer}</td>
                        <td className="py-2.5 px-3 text-end text-navy-700">{formatFull(c.cases)}</td>
                        <td className="py-2.5 px-3 text-end text-navy-700">{formatFull(c.deaths)}</td>
                        <td className="py-2.5 px-3 text-end">
                          <span className="inline-flex items-center gap-1">
                            <span className="text-navy-600 text-xs">{c.casesPercent}%</span>
                            <div className="w-12 h-1.5 bg-navy-100 rounded-full overflow-hidden">
                              <div className="h-full rounded-full" style={{ width: `${c.casesPercent * 5}%`, backgroundColor: 'var(--chart-1)' }} />
                            </div>
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mortality-to-incidence ratio insight */}
          <div className="bg-gradient-to-br from-navy-900 to-navy-800 rounded-2xl p-6 text-white">
            <h3 className="text-base font-bold mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-teal-400" />
              {tBurden.mortalityRate} / {tBurden.incidenceRate}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {sortedByDeaths.slice(0, 5).map((c) => {
                const ratio = ((c.deaths / c.cases) * 100).toFixed(0);
                return (
                  <div key={c.cancer} className="bg-white/5 rounded-xl p-3">
                    <div className="text-xs text-navy-300 mb-1">{c.cancer}</div>
                    <div className="text-xl font-bold text-teal-400">{ratio}%</div>
                    <div className="text-[10px] text-navy-400 mt-0.5">M:I ratio</div>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-navy-400 mt-3 leading-relaxed">
              The mortality-to-incidence ratio reflects survival disparities. A high ratio (e.g. pancreas at ~92%) indicates aggressive biology or late diagnosis. A low ratio (e.g. thyroid at ~5%) reflects high survival with treatment.
            </p>
          </div>
        </div>
      )}

      {/* Data source */}
      <div className="mt-6 flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-xs text-navy-500">
          <span className="font-medium">{tBurden.dataSource}:</span>
          <a
            href="https://gco.iarc.who.int/media/globocan/projects/2022"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-600 hover:text-teal-700 font-medium inline-flex items-center gap-1"
          >
            GLOBOCAN 2022, IARC/WHO <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4">
        <p className="text-xs text-amber-800 leading-relaxed">{tBurden.disclaimer}</p>
      </div>
    </div>
  );
}
