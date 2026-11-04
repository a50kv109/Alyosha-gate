import React, { useState } from 'react';
import { FileText, Filter, CheckCircle2, Cpu, Activity, Shield } from 'lucide-react';
import { ALYOSHA_SPECS } from '../data/specs';
import { Language, translations } from '../locales';

interface SpecsExplorerProps {
  lang: Language;
}

export const SpecsExplorer: React.FC<SpecsExplorerProps> = ({ lang }) => {
  const t = translations[lang].specs;

  const [filterCategory, setFilterCategory] = useState<'all' | 'discrete' | 'mcrg' | 'telemetry'>('all');

  const filteredSpecs = filterCategory === 'all'
    ? ALYOSHA_SPECS
    : ALYOSHA_SPECS.filter((s) => s.category === filterCategory);

  return (
    <div className="space-y-8 pb-12">
      {/* Header & Filter */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white mb-1">{t.title}</h2>
          <p className="text-slate-400 text-sm">{t.subtitle}</p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filterCategory === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.all}
          </button>
          <button
            onClick={() => setFilterCategory('discrete')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filterCategory === 'discrete' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.discrete}
          </button>
          <button
            onClick={() => setFilterCategory('mcrg')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filterCategory === 'mcrg' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.mcrg}
          </button>
          <button
            onClick={() => setFilterCategory('telemetry')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filterCategory === 'telemetry' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.telemetry}
          </button>
        </div>
      </div>

      {/* Specifications List */}
      <div className="space-y-8">
        {filteredSpecs.map((spec) => (
          <div key={spec.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg md:text-xl font-bold text-white flex items-center space-x-3">
                {spec.category === 'discrete' && <Cpu className="w-5 h-5 text-indigo-400" />}
                {spec.category === 'mcrg' && <Activity className="w-5 h-5 text-purple-400" />}
                {spec.category === 'telemetry' && <Shield className="w-5 h-5 text-cyan-400" />}
                <span>{spec.title}</span>
              </h3>
              <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-mono border border-slate-700">
                AAM-V1 Standard
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Inputs */}
              <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-indigo-400 uppercase tracking-wider font-bold">{t.axis1}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono border border-indigo-500/30">
                    {spec.inputs.tag}
                  </span>
                </div>
                <p className="text-sm text-slate-300 font-mono">{spec.inputs.text}</p>
              </div>

              {/* Outputs */}
              <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-purple-400 uppercase tracking-wider font-bold">{t.axis2}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono border border-purple-500/30">
                    {spec.outputs.tag}
                  </span>
                </div>
                <p className="text-sm text-slate-300 font-mono">{spec.outputs.text}</p>
              </div>

              {/* Trigger Condition */}
              <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-bold">{t.axis3}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono border border-cyan-500/30">
                    {spec.triggerCondition.tag}
                  </span>
                </div>
                <p className="text-sm text-slate-300">{spec.triggerCondition.text}</p>
              </div>

              {/* Side Effects */}
              <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-bold">{t.axis4}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30">
                    {spec.sideEffects.tag}
                  </span>
                </div>
                <p className="text-sm text-slate-300">{spec.sideEffects.text}</p>
              </div>

              {/* Edge Cases */}
              <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-amber-400 uppercase tracking-wider font-bold">{t.axis5}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono border border-amber-500/30">
                    {spec.edgeCases.tag}
                  </span>
                </div>
                <p className="text-sm text-slate-300">{spec.edgeCases.text}</p>
              </div>

              {/* Tests & Benchmarks */}
              <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-rose-400 uppercase tracking-wider font-bold">{t.axis6}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono border border-rose-500/30">
                    {spec.tests.tag}
                  </span>
                </div>
                <p className="text-sm text-slate-300">{spec.tests.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
