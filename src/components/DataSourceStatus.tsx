import { useCallback, useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Loader2, RefreshCw, Clock, ExternalLink } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { getTranslation } from '@/lib/i18n';
import {
  CONNECTORS, checkConnector, type ConnectorCheck, type ConnectorId,
} from '@/lib/connectors';

const CHECK_ALL_ON_MOUNT = true;

export function DataSourceStatus() {
  const { language } = useApp();
  const t = getTranslation(language);
  const tr = t.dataSourceStatus;
  const [checks, setChecks] = useState<Record<ConnectorId, ConnectorCheck>>(
    () => Object.fromEntries(CONNECTORS.map((c) => [c.id, { status: 'idle', latencyMs: null, checkedAt: null }])) as Record<ConnectorId, ConnectorCheck>
  );

  const runCheck = useCallback(async (id: ConnectorId) => {
    const connector = CONNECTORS.find((c) => c.id === id);
    if (!connector) return;
    setChecks((prev) => ({ ...prev, [id]: { status: 'checking', latencyMs: null, checkedAt: prev[id]?.checkedAt ?? null } }));
    const result = await checkConnector(connector);
    setChecks((prev) => ({ ...prev, [id]: result }));
  }, []);

  const checkAll = useCallback(async () => {
    await Promise.all(CONNECTORS.map((c) => runCheck(c.id)));
  }, [runCheck]);

  useEffect(() => {
    if (CHECK_ALL_ON_MOUNT) void checkAll();
  }, [checkAll]);

  const anyChecking = Object.values(checks).some((c) => c.status === 'checking');

  return (
    <section className="bg-white rounded-xl border border-navy-100 p-6 mb-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h2 className="font-bold text-navy-900 text-lg mb-1">{tr.title}</h2>
          <p className="text-xs text-navy-500 leading-relaxed max-w-xl">{tr.description}</p>
        </div>
        <button
          onClick={() => void checkAll()}
          disabled={anyChecking}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 border border-teal-100 text-teal-800 text-xs font-medium hover:bg-teal-100 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${anyChecking ? 'animate-spin' : ''}`} aria-hidden="true" />
          {anyChecking ? tr.checkingAll : tr.checkAll}
        </button>
      </div>

      <ul className="mt-4 space-y-2">
        {CONNECTORS.map((connector) => {
          const check = checks[connector.id];
          const ok = check.status === 'ok';
          const err = check.status === 'error';
          const checking = check.status === 'checking';
          const idle = check.status === 'idle';
          return (
            <li
              key={connector.id}
              className="flex items-start gap-3 p-3 rounded-lg border border-navy-100 bg-navy-50/30"
            >
              <span className="mt-0.5 flex-shrink-0">
                {ok && <CheckCircle2 className="w-5 h-5 text-teal-600" aria-hidden="true" />}
                {err && <XCircle className="w-5 h-5 text-red-600" aria-hidden="true" />}
                {checking && <Loader2 className="w-5 h-5 text-navy-400 animate-spin" aria-hidden="true" />}
                {idle && <Clock className="w-5 h-5 text-navy-300" aria-hidden="true" />}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-navy-900">{connector.name}</span>
                  <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded ${
                    ok ? 'bg-teal-50 text-teal-700 border border-teal-100'
                      : err ? 'bg-red-50 text-red-700 border border-red-100'
                      : checking ? 'bg-navy-100 text-navy-600'
                      : 'bg-navy-50 text-navy-400'
                  }`}>
                    {ok ? tr.stateOk : err ? tr.stateError : checking ? tr.stateChecking : tr.stateIdle}
                  </span>
                  {ok && check.latencyMs !== null && (
                    <span className="text-[11px] text-navy-400">{check.latencyMs} ms</span>
                  )}
                  {err && check.error && (
                    <span className="text-[11px] text-red-600">{check.error}</span>
                  )}
                </div>
                <p className="text-[11px] text-navy-500 mt-0.5">
                  {tr.publicApiNoKey}
                  {' · '}
                  <a href={connector.docsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 text-teal-600 hover:underline">
                    {tr.sourceDocs}
                    <ExternalLink className="w-3 h-3" aria-hidden="true" />
                  </a>
                </p>
                {check.checkedAt && (
                  <p className="text-[10px] text-navy-400 mt-0.5">
                    {tr.lastChecked}: {new Date(check.checkedAt).toLocaleTimeString()}
                  </p>
                )}
              </div>
              <button
                onClick={() => void runCheck(connector.id)}
                disabled={checking}
                className="p-1.5 rounded-lg text-navy-400 hover:text-teal-600 hover:bg-teal-50 transition-colors flex-shrink-0 disabled:opacity-40"
                aria-label={`${tr.retest}: ${connector.name}`}
                title={tr.retest}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${checking ? 'animate-spin' : ''}`} aria-hidden="true" />
              </button>
            </li>
          );
        })}
      </ul>

      <p className="mt-3 text-[11px] text-navy-400 leading-relaxed">
        {tr.honestyNote}
      </p>
    </section>
  );
}
