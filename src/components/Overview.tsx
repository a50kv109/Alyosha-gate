import React from 'react';
import { Shield, CheckCircle2, ExternalLink, Cpu, Activity, Zap, BookOpen } from 'lucide-react';
import { ZENODO_RECORDS } from '../data/specs';
import { TabType } from '../types';
import { Language, translations } from '../locales';

interface OverviewProps {
  setActiveTab: (tab: TabType) => void;
  lang: Language;
}

export const Overview: React.FC<OverviewProps> = ({ setActiveTab, lang }) => {
  const t = translations[lang].overview;

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/20 p-8 md:p-12 shadow-2xl">
        <div className="absolute -right-12 -top-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-12 -bottom-12 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-mono mb-6">
            <Shield className="w-3.5 h-3.5" />
            <span>{t.badge}</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            alyosha-gate <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-400">(Zero-Cycle Filter)</span>
          </h1>

          <p className="text-slate-300 text-base md:text-lg leading-relaxed mb-8">
            {t.subtitle}
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setActiveTab('discrete')}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-lg shadow-indigo-600/30 transition-all flex items-center space-x-2"
            >
              <Cpu className="w-5 h-5" />
              <span>{t.exploreDiscrete}</span>
            </button>
            <button
              onClick={() => setActiveTab('mcrg')}
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium border border-slate-700 transition-all flex items-center space-x-2"
            >
              <Activity className="w-5 h-5" />
              <span>{t.testMcrg}</span>
            </button>
            <button
              onClick={() => setActiveTab('telemetry')}
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium border border-slate-700 transition-all flex items-center space-x-2"
            >
              <Shield className="w-5 h-5" />
              <span>{t.telemetryMonitor}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Core Invariants & Constants */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 shadow-lg backdrop-blur">
          <div className="w-12 h-12 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 font-mono text-xl font-bold">
            Vᵣ
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">{t.vRefTitle}</h3>
          <div className="text-2xl font-mono font-bold text-indigo-300 mb-2">0.201</div>
          <p className="text-slate-400 text-sm leading-relaxed">
            {t.vRefDesc}
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 shadow-lg backdrop-blur">
          <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 mb-4 font-mono text-xl font-bold">
            θ
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">{t.thetaTitle}</h3>
          <div className="text-2xl font-mono font-bold text-purple-300 mb-2">0.3678</div>
          <p className="text-slate-400 text-sm leading-relaxed">
            {t.thetaDesc}
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 shadow-lg backdrop-blur">
          <div className="w-12 h-12 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4 font-mono text-xl font-bold">
            φ
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">{t.phiTitle}</h3>
          <div className="text-2xl font-mono font-bold text-cyan-300 mb-2">1.618</div>
          <p className="text-slate-400 text-sm leading-relaxed">
            {t.phiDesc}
          </p>
        </div>
      </div>

      {/* Two-Tier Architectural Paradigm */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
          <Zap className="w-6 h-6 text-indigo-400" />
          <span>{t.twoTierTitle}</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-6">
            <div className="inline-block px-3 py-1 rounded bg-amber-500/20 text-amber-300 text-xs font-mono mb-3 border border-amber-500/30">
              Legacy & Reproducibility
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{t.legacyTitle}</h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              {t.legacyDesc}
            </p>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Exact scalar evaluation paths</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Strict Zenodo preprint adherence</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-6">
            <div className="inline-block px-3 py-1 rounded bg-emerald-500/20 text-emerald-300 text-xs font-mono mb-3 border border-emerald-500/30">
              Production & High-Throughput
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{t.prodTitle}</h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              {t.prodDesc}
            </p>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Fully vectorized tensor operations (dim=1..4)</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Selective autograd hook isolation</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Zenodo Citations & DOI Index */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
          <BookOpen className="w-6 h-6 text-purple-400" />
          <span>{t.zenodoTitle}</span>
        </h2>

        <div className="space-y-3">
          {ZENODO_RECORDS.map((record, index) => (
            <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 gap-4">
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded bg-purple-500/20 text-purple-300 text-xs font-mono mb-1 border border-purple-500/30">
                  {record.type}
                </span>
                <h4 className="text-white font-medium text-sm md:text-base">{record.title}</h4>
              </div>
              <a
                href={`https://doi.org/${record.doi}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-mono border border-indigo-500/30 transition-all whitespace-nowrap"
              >
                <span>DOI: {record.doi}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
