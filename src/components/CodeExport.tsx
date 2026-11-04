import React, { useState } from 'react';
import { Code2, Copy, Check, Terminal } from 'lucide-react';
import { Language, translations } from '../locales';

interface CodeExportProps {
  lang: Language;
}

export const CodeExport: React.FC<CodeExportProps> = ({ lang }) => {
  const t = translations[lang].code;

  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  const snippets = {
    pythonCore: `from dataclasses import dataclass
from enum import Enum
from typing import List, Dict, Any

class GateAction(str, Enum):
    PASS = "PASS"
    VOID = "VOID"
    KENOSIS_GRAD_NULL = "KENOSIS_GRAD_NULL"
    HARD_INTERRUPT = "HARD_INTERRUPT"

@dataclass(frozen=True)
class GateResult:
    is_triggered: bool
    status: str
    metric_name: str
    metric_value: float
    threshold_value: float
    action: GateAction
    metadata: Dict[str, Any]

class AlyoshaDiscreteGate:
    def __init__(self, mode: str = "rectified"):
        self.mode = mode

    def evaluate(self, numbers: List[int], exponents: List[int]) -> GateResult:
        import math
        g = math.gcd(*numbers) if numbers else 0
        source_present = g > 1
        dmod = sum(exponents) / 100.0 + (0.0 if source_present else 1.0)
        
        is_triggered = not source_present or dmod >= 1.0
        status = "STABLE" if not is_triggered else "VOID: Semantic Void. Kenosis activated."
        
        return GateResult(
            is_triggered=is_triggered,
            status=status,
            metric_name="DMOD",
            metric_value=dmod,
            threshold_value=1.0,
            action=GateAction.VOID if is_triggered else GateAction.PASS,
            metadata={"gcd": g, "source_present": source_present, "mode": self.mode}
        )`,
    pytorchMcrg: `import torch
import torch.nn as nn

class AlyoshaResidualGate3D(nn.Module):
    """
    Medical Coherence Residual Gate (MCRG) for 3D U-Net streams.
    Methodology ID: AAM-V1_ARTSYBASHEV_UA_KHARKIV_AIANALYSIS
    """
    def __init__(self, v_ref: float = 0.201, threshold: float = 0.3678, phi: float = 1.618):
        super().__init__()
        self.v_ref = v_ref
        self.threshold = threshold
        self.phi = phi

    def forward(self, x: torch.Tensor, residual: torch.Tensor = None) -> torch.Tensor:
        combined = x + residual if residual is not None else x
        v_ref_exp = torch.full_like(combined, self.v_ref)
        diffs = torch.abs(combined - v_ref_exp)
        
        reduce_dims = tuple(range(1, combined.dim()))
        tdi = diffs.mean(dim=reduce_dims, keepdim=True)
        
        hard_gate = (tdi > self.threshold).float()
        hard_output = combined * self.threshold
        
        mask = torch.exp(-self.phi * torch.clamp(diffs, max=10.0))
        soft_output = combined * mask
        
        output = hard_gate * hard_output + (1.0 - hard_gate) * soft_output
        
        if torch.any(hard_gate > 0) and combined.requires_grad:
            combined.register_hook(lambda grad: grad * (1.0 - hard_gate))
            
        return output`,
    telemetryMonitor: `import numpy as np

class TrajectoryMonitor:
    def __init__(self, k: int = 50, eps: float = 0.1, tau: float = 1e-4):
        self.k = k
        self.eps = eps
        self.tau = tau
        self.history = []

    def update(self, embedding: np.ndarray) -> str:
        self.history.append(embedding)
        if len(self.history) < self.k:
            return "WARMUP"
            
        window = np.array(self.history[-self.k:])
        cov = np.cov(window, rowvar=False)
        evals = np.linalg.eigvalsh(cov)
        evals = np.clip(evals, 1e-9, None)
        
        pr = (np.sum(evals) ** 2) / np.sum(evals ** 2)
        
        # Centroid mobility
        mu_current = np.mean(window[-10:], axis=0)
        mu_past = np.mean(window[:10], axis=0)
        mobility = np.sum((mu_current - mu_past) ** 2)
        
        if pr < 5.0 and mobility < self.tau:
            return "STAGNATION_DETECTED"
        return "NOMINAL"
`
  };

  const handleCopy = (key: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippet(key);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Code2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white">{t.title}</h2>
            <p className="text-slate-400 text-sm">{t.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Snippets */}
      <div className="space-y-8">
        {/* Python Core */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Terminal className="w-5 h-5 text-indigo-400" />
              <h3 className="text-lg font-bold text-white">alyosha_gate/core/discrete.py</h3>
            </div>
            <button
              onClick={() => handleCopy('pythonCore', snippets.pythonCore)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-all"
            >
              {copiedSnippet === 'pythonCore' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedSnippet === 'pythonCore' ? t.copied : t.copy}</span>
            </button>
          </div>
          <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto max-h-96">
            {snippets.pythonCore}
          </pre>
        </div>

        {/* PyTorch MCRG */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Terminal className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-bold text-white">alyosha_gate/adapters/torch_mcrg.py</h3>
            </div>
            <button
              onClick={() => handleCopy('pytorchMcrg', snippets.pytorchMcrg)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-all"
            >
              {copiedSnippet === 'pytorchMcrg' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedSnippet === 'pytorchMcrg' ? t.copied : t.copy}</span>
            </button>
          </div>
          <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto max-h-96">
            {snippets.pytorchMcrg}
          </pre>
        </div>

        {/* Telemetry Monitor */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Terminal className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-bold text-white">alyosha_gate/adapters/telemetry.py</h3>
            </div>
            <button
              onClick={() => handleCopy('telemetryMonitor', snippets.telemetryMonitor)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-all"
            >
              {copiedSnippet === 'telemetryMonitor' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedSnippet === 'telemetryMonitor' ? t.copied : t.copy}</span>
            </button>
          </div>
          <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto max-h-96">
            {snippets.telemetryMonitor}
          </pre>
        </div>
      </div>
    </div>
  );
};
