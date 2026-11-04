import React, { useState } from 'react';
import { Shield, Activity, AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react';
import { Language, translations } from '../locales';

interface TelemetrySimulatorProps {
  lang: Language;
}

export const TelemetrySimulator: React.FC<TelemetrySimulatorProps> = ({ lang }) => {
  const t = translations[lang].telemetry;

  const [pr, setPr] = useState<number>(3.8);
  const [det, setDet] = useState<number>(0.65);
  const [mobility, setMobility] = useState<number>(0.00005);
  const [tau] = useState<number>(0.0001);

  // Trigger conditions: (pr < 5.0 and det > 0.5) and mobility < tau
  const isStagnant = pr < 5.0 && det > 0.5 && mobility < tau;
  const isProductive = pr >= 5.0 || mobility >= tau;

  const status = isStagnant ? 'STAGNATION_DETECTED' : isProductive ? 'PRODUCTIVE_FOCUS' : 'NOMINAL';
  const action = isStagnant ? 'HARD_INTERRUPT -> ORTHOGONAL_RESET' : 'PASS';

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white">{t.title}</h2>
            <p className="text-slate-400 text-sm">{t.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Controls */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl space-y-6">
          <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            <span>{t.controlsTitle}</span>
          </h3>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-slate-300">{t.prLabel} (<code className="text-cyan-400">PR</code>)</label>
              <span className="font-mono text-cyan-400 text-sm">{pr.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="15.0"
              step="0.1"
              value={pr}
              onChange={(e) => setPr(parseFloat(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <p className="text-xs text-slate-500 mt-1">{t.prHint}</p>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-slate-300">{t.detLabel} (<code className="text-indigo-400">DET</code>)</label>
              <span className="font-mono text-indigo-400 text-sm">{det.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.01"
              value={det}
              onChange={(e) => setDet(parseFloat(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
            <p className="text-xs text-slate-500 mt-1">{t.detHint}</p>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-slate-300">{t.mobilityLabel} (<code className="text-purple-400">Mt</code>)</label>
              <span className="font-mono text-purple-400 text-sm">{mobility.toExponential(4)}</span>
            </div>
            <input
              type="range"
              min="0.000001"
              max="0.001"
              step="0.00001"
              value={mobility}
              onChange={(e) => setMobility(parseFloat(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer"
            />
            <p className="text-xs text-slate-500 mt-1">{t.mobilityHint}</p>
          </div>
        </div>

        {/* Telemetry Output */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">{t.statusTitle}</h3>
              <span
                className={`px-3 py-1 rounded-full text-xs font-mono font-bold border flex items-center space-x-1.5 ${
                  isStagnant
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                }`}
              >
                {isStagnant ? <AlertTriangle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                <span>{status}</span>
              </span>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">{t.recAction}</div>
                  <div className="text-xs text-slate-500">{t.directive}</div>
                </div>
                <div className={`font-mono text-sm font-bold ${isStagnant ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {action}
                </div>
              </div>

              <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-2">
                <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">{t.ruleEval}</div>
                <div className="text-xs font-mono space-y-1">
                  <div className={pr < 5.0 ? 'text-rose-400' : 'text-emerald-400'}>
                    • PR &lt; 5.0 ({pr.toFixed(2)}) =&gt; {String(pr < 5.0)}
                  </div>
                  <div className={det > 0.5 ? 'text-rose-400' : 'text-emerald-400'}>
                    • DET &gt; 0.5 ({det.toFixed(2)}) =&gt; {String(det > 0.5)}
                  </div>
                  <div className={mobility < tau ? 'text-rose-400' : 'text-emerald-400'}>
                    • Mt &lt; tau ({mobility.toExponential(4)} &lt; 1e-4) =&gt; {String(mobility < tau)}
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 rounded-xl p-4 border border-slate-800">
                <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">{t.benchmark}</div>
                <div className="text-xs text-slate-300">
                  {t.benchmarkText}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 text-xs text-slate-500 font-mono">
            Methodology ID: AAM-V1_ARTSYBASHEV_UA_KHARKIV_AIANALYSIS
          </div>
        </div>
      </div>
    </div>
  );
};
