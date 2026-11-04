import React, { useState } from 'react';
import { Cpu, CheckCircle2, AlertTriangle, RefreshCw, Terminal, Play } from 'lucide-react';
import { GateResult } from '../types';
import { Language, translations } from '../locales';

interface DiscreteSimulatorProps {
  lang: Language;
}

export const DiscreteSimulator: React.FC<DiscreteSimulatorProps> = ({ lang }) => {
  const t = translations[lang].discrete;

  const [numbersStr, setNumbersStr] = useState('3, 5, 8');
  const [exponentsStr, setExponentsStr] = useState('3, 3, 3');
  const [mode, setMode] = useState<'rectified' | 'source_faithful'>('rectified');
  const [result, setResult] = useState<GateResult | null>(null);

  // Helper gcd calculation
  const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));
  const arrayGcd = (arr: number[]): number => {
    if (arr.length === 0) return 0;
    return arr.reduce((acc, val) => gcd(acc, val));
  };

  const handleEvaluate = () => {
    try {
      const numbers = numbersStr.split(',').map((s) => parseInt(s.trim())).filter((n) => !isNaN(n));
      const exponents = exponentsStr.split(',').map((s) => parseInt(s.trim())).filter((n) => !isNaN(n));

      if (numbers.length === 0 || exponents.length === 0) {
        alert('Please enter valid integers separated by commas.');
        return;
      }

      const g = arrayGcd(numbers);
      const sourcePresent = g > 1;
      const sumExp = exponents.reduce((a, b) => a + b, 0);
      const dmod = sumExp / 100.0 + (sourcePresent ? 0.0 : 1.0);

      // Check Fermat/Pythagorean exclusion (Balu variant)
      const hasFermatLimit = exponents.some((e) => e <= 2);

      let isTriggered = false;
      let status = 'STABLE';
      let action: GateResult['action'] = 'PASS';

      if (hasFermatLimit && numbers.length === 3 && numbers[0]**2 + numbers[1]**2 === numbers[2]**2) {
        status = 'EXCLUSION: FERMAT/PYTHAGOREAN LIMIT';
        isTriggered = true;
        action = 'VOID';
      } else if (!sourcePresent || dmod >= 1.0) {
        status = 'VOID: Semantic Void. Kenosis activated.';
        isTriggered = true;
        action = 'VOID';
      } else {
        status = `STABLE: Source identified (GCD = ${g}), D_MOD = ${dmod.toFixed(4)}`;
        isTriggered = false;
        action = 'PASS';
      }

      setResult({
        isTriggered,
        status,
        metricName: 'DMOD',
        metricValue: dmod,
        thresholdValue: 1.0,
        action,
        metadata: {
          gcd: g,
          sourcePresent,
          sumExponents: sumExp,
          numbers,
          exponents,
          mode
        }
      });
    } catch (e) {
      console.error(e);
      alert('Error evaluating expression.');
    }
  };

  const loadPreset = (nums: string, exps: string) => {
    setNumbersStr(nums);
    setExponentsStr(exps);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white">{t.title}</h2>
            <p className="text-slate-400 text-sm">{t.subtitle}</p>
          </div>
        </div>

        {/* Presets */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800">
          <span className="text-xs text-slate-400 self-center mr-2">{t.presets}</span>
          <button
            onClick={() => loadPreset('3, 5, 8', '3, 3, 3')}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-indigo-300 font-mono border border-slate-700 transition-all"
          >
            [3,5,8]^3 (Void Test)
          </button>
          <button
            onClick={() => loadPreset('4, 8, 12', '3, 3, 3')}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-emerald-300 font-mono border border-slate-700 transition-all"
          >
            [4,8,12]^3 (Stable GCD=4)
          </button>
          <button
            onClick={() => loadPreset('3, 4, 5', '2, 2, 2')}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-amber-300 font-mono border border-slate-700 transition-all"
          >
            [3,4,5]^2 (Fermat Limit)
          </button>
        </div>
      </div>

      {/* Simulator Inputs & Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Controls */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl space-y-6">
          <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
            <Terminal className="w-5 h-5 text-indigo-400" />
            <span>{t.configTitle}</span>
          </h3>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              {t.baseNumbers}
            </label>
            <input
              type="text"
              value={numbersStr}
              onChange={(e) => setNumbersStr(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-indigo-500 transition-all"
              placeholder="3, 5, 8"
            />
            <p className="text-xs text-slate-500 mt-1">{t.baseNumbersHint}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              {t.exponents}
            </label>
            <input
              type="text"
              value={exponentsStr}
              onChange={(e) => setExponentsStr(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-indigo-500 transition-all"
              placeholder="3, 3, 3"
            />
            <p className="text-xs text-slate-500 mt-1">{t.exponentsHint}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">{t.execMode}</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMode('rectified')}
                className={`py-2.5 px-4 rounded-xl text-sm font-medium border transition-all ${
                  mode === 'rectified'
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                rectified (Production)
              </button>
              <button
                type="button"
                onClick={() => setMode('source_faithful')}
                className={`py-2.5 px-4 rounded-xl text-sm font-medium border transition-all ${
                  mode === 'source_faithful'
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                source_faithful (Legacy)
              </button>
            </div>
          </div>

          <button
            onClick={handleEvaluate}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2"
          >
            <Play className="w-5 h-5" />
            <span>{t.evaluateBtn}</span>
          </button>
        </div>

        {/* Evaluation Output */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">{t.resultContainer}</h3>
              {result && (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${
                    result.isTriggered
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  }`}
                >
                  {result.action}
                </span>
              )}
            </div>

            {result ? (
              <div className="space-y-4">
                <div className="bg-slate-950 rounded-xl p-4 border border-slate-800">
                  <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">{t.statusMessage}</div>
                  <div className="text-white font-mono text-sm">{result.status}</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-950 rounded-xl p-4 border border-slate-800">
                    <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">{t.computedDmod}</div>
                    <div className="text-indigo-400 font-mono text-xl font-bold">{result.metricValue.toFixed(4)}</div>
                    <div className="text-xs text-slate-500 mt-1">{t.thresholdLabel}</div>
                  </div>

                  <div className="bg-slate-950 rounded-xl p-4 border border-slate-800">
                    <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">{t.commonRoot}</div>
                    <div className="text-cyan-400 font-mono text-xl font-bold">{result.metadata.gcd}</div>
                    <div className="text-xs text-slate-500 mt-1">{t.sourcePresent} {String(result.metadata.sourcePresent)}</div>
                  </div>
                </div>

                <div className="bg-slate-950 rounded-xl p-4 border border-slate-800">
                  <div className="text-xs text-slate-400 uppercase tracking-wider mb-2">{t.rawJson}</div>
                  <pre className="text-xs font-mono text-slate-300 overflow-x-auto">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center text-slate-500 border border-dashed border-slate-800 rounded-xl">
                <Terminal className="w-10 h-10 mb-3 opacity-40" />
                <p>Run evaluation to inspect GateResult container output.</p>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-500 font-mono">
            {t.footerRule}
          </div>
        </div>
      </div>
    </div>
  );
};
