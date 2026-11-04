import React from 'react';
import { Shield, BookOpen, Cpu, Activity, FileText, Code2, Globe } from 'lucide-react';
import { TabType } from '../types';
import { Language, translations } from '../locales';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  lang: Language;
  setLang: (lang: Language) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, lang, setLang }) => {
  const t = translations[lang].nav;

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('overview')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight">alyosha-gate</span>
                <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30 font-mono">v2.11</span>
              </div>
              <p className="text-xs text-slate-400">Zero-Cycle Filter & MCRG Ecosystem</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
                activeTab === 'overview'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>{t.overview}</span>
            </button>

            <button
              onClick={() => setActiveTab('discrete')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
                activeTab === 'discrete'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>{t.discrete}</span>
            </button>

            <button
              onClick={() => setActiveTab('mcrg')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
                activeTab === 'mcrg'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>{t.mcrg}</span>
            </button>

            <button
              onClick={() => setActiveTab('telemetry')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
                activeTab === 'telemetry'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>{t.telemetry}</span>
            </button>

            <button
              onClick={() => setActiveTab('specs')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
                activeTab === 'specs'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>{t.specs}</span>
            </button>

            <button
              onClick={() => setActiveTab('code')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
                activeTab === 'code'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>{t.code}</span>
            </button>
          </nav>

          {/* Right side: Language Toggle & Badge */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setLang(lang === 'en' ? 'ru' : 'en')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold font-mono text-indigo-300 border border-slate-700 transition-all flex items-center space-x-1.5 shadow"
              title="Switch Language / Переключить язык"
            >
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              <span>{lang === 'en' ? 'RU 🇷🇺' : 'EN 🇬🇧'}</span>
            </button>

            <div className="hidden lg:flex items-center space-x-2 text-xs font-mono bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>AAM-V1</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Nav Bar */}
      <div className="md:hidden flex overflow-x-auto px-4 py-2 bg-slate-950 border-t border-slate-800 space-x-2 scrollbar-none">
        {(
          [
            ['overview', t.overview, BookOpen],
            ['discrete', t.discrete, Cpu],
            ['mcrg', t.mcrg, Activity],
            ['telemetry', t.telemetry, Shield],
            ['specs', t.specs, FileText],
            ['code', t.code, Code2],
          ] as const
        ).map(([key, label, Icon]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as TabType)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap flex items-center space-x-1.5 ${
              activeTab === key ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </header>
  );
};
