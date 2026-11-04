/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Overview } from './components/Overview';
import { DiscreteSimulator } from './components/DiscreteSimulator';
import { MCRGSimulator } from './components/MCRGSimulator';
import { TelemetrySimulator } from './components/TelemetrySimulator';
import { SpecsExplorer } from './components/SpecsExplorer';
import { CodeExport } from './components/CodeExport';
import { TabType } from './types';
import { Language, translations } from './locales';
import { Shield } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [lang, setLang] = useState<Language>('en');

  const ft = translations[lang].footer;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} lang={lang} setLang={setLang} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeTab === 'overview' && <Overview setActiveTab={setActiveTab} lang={lang} />}
        {activeTab === 'discrete' && <DiscreteSimulator lang={lang} />}
        {activeTab === 'mcrg' && <MCRGSimulator lang={lang} />}
        {activeTab === 'telemetry' && <TelemetrySimulator lang={lang} />}
        {activeTab === 'specs' && <SpecsExplorer lang={lang} />}
        {activeTab === 'code' && <CodeExport lang={lang} />}
      </main>

      <footer className="bg-slate-900 border-t border-slate-800 py-8 mt-16 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold text-white">alyosha-gate (AAM-V1 Ecosystem)</span>
          </div>
          <div>
            {ft.methodology} <code className="text-indigo-300">AAM-V1_ARTSYBASHEV_UA_KHARKIV_AIANALYSIS</code> • {ft.author}
          </div>
          <div className="text-slate-500">
            {ft.zenodo}
          </div>
        </div>
      </footer>
    </div>
  );
}
