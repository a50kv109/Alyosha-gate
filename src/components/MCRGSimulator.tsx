import React, { useState } from 'react';
import { Activity, Sliders, Shield, Zap, CheckCircle2, AlertOctagon } from 'lucide-react';
import { Language, translations } from '../locales';

interface MCRGSimulatorProps {
  lang: Language;
}

export const MCRGSimulator: React.FC<MCRGSimulatorProps> = ({ lang }) => {
  const t = translations[lang].mcrg;

  const [meanInput, setMeanInput] = useState<number>(0.25);
  const [noiseLevel, setNoiseLevel] = useState<number>(0.15);
  const [vRef] = useState<number>(0.201);
  const [theta] = useState<number>(0.3678);
  const [phi] = useState<number>(1.618);

  // Calculate TDI
  const tdi = Math.abs(meanInput - vRef) + noiseLevel * 0.5;
  const isHardGate = tdi > theta;

  // Calculate output transformation
  const hardOutput = meanInput * theta;
  const softMask = Math.exp(-phi * Math.abs(meanInput - vRef));
  const softOutput = meanInput * softMask;
  const finalOutput = isHardGate ? hardOutput : softOutput;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
            <Activity className="w-6 h-6" />
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
            <Sliders className="w-5 h-5 text-purple-400" />
            <span>{t.controlsTitle}</span>
          </h3>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-slate-300">{t.meanLabel} (<code className="text-indigo-400">z</code>)</label>
              <span className="font-mono text-indigo-400 text-sm">{meanInput.toFixed(3)}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.01"
              value={meanInput}
              onChange={(e) => setMeanInput(parseFloat(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-slate-300">{t.noiseLabel} (<code className="text-purple-400">noise</code>)</label>
              <span className="font-mono text-purple-400 text-sm">{noiseLevel.toFixed(3)}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="0.8"
              step="0.01"
              value={noiseLevel}
              onChange={(e) => setNoiseLevel(parseFloat(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer"
            />
          </div>

          <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-3">
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">{t.constantsTitle}</div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                <div className="text-xs text-slate-500">V_ref</div>
                <div className="font-mono text-indigo-300 font-bold text-sm">{vRef}</div>
              </div>
              <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                <div className="text-xs text-slate-500">Theta (1/e)</div>
                <div className="font-mono text-purple-300 font-bold text-sm">{theta}</div>
              </div>
              <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                <div className="text-xs text-slate-500">Phi (Golden)</div>
                <div className="font-mono text-cyan-300 font-bold text-sm">{phi}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Evaluation & State */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">{t.stateTitle}</h3>
              <span
                className={`px-3 py-1 rounded-full text-xs font-mono font-bold border flex items-center space-x-1.5 ${
                  isHardGate
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                }`}
              >
                {isHardGate ? <AlertOctagon className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                <span>{isHardGate ? 'HARD GATE (KENOSIS)' : 'SOFT MASK (LAMINAR)'}</span>
              </span>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">{t.tdiLabel}</div>
                  <div className="text-xs text-slate-500">Threshold: {theta} (1/e)</div>
                </div>
                <div className={`font-mono text-2xl font-bold ${isHardGate ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {tdi.toFixed(4)}
                </div>
              </div>

              <div className="bg-slate-950 rounded-xl p-4 border border-slate-800">
                <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">{t.outputLabel}</div>
                <div className="text-indigo-400 font-mono text-xl font-bold">{finalOutput.toFixed(4)}</div>
                <div className="text-xs text-slate-500 mt-1">
                  {isHardGate ? 'Clamped with theta scale (Hard Gate active)' : 'Exponentially smoothed with phi damping (Soft Mask active)'}
                </div>
              </div>

              <div className="bg-slate-950 rounded-xl p-4 border border-slate-800">
                <div className="text-xs text-slate-400 uppercase tracking-wider mb-2">{t.hookLabel}</div>
                <div className="font-mono text-xs text-slate-300 flex items-center space-x-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${isHardGate ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`}></span>
                  <span>{isHardGate ? 'grad * (1.0 - 1.0) = 0.0 (Gradient Nullified)' : 'grad * (1.0 - 0.0) = 1.0 (Gradient Preserved)'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 text-xs text-slate-500 font-mono">
            {t.footerRule}
          </div>
        </div>
      </div>
    </div>
  );
};
