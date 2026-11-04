import { SpecItem } from '../types';

export const ALYOSHA_SPECS: SpecItem[] = [
  {
    id: 'discrete',
    title: '1. Discrete Gate — Beal/Balu (Zero-Cycle Symbolic Filter)',
    category: 'discrete',
    inputs: {
      text: 'numbers: List[int] (e.g., [A, B, C]), exponents: List[int] (e.g., [x, y, z]), threshold: float = 1.0',
      tag: '[Подтверждён кодом]'
    },
    outputs: {
      text: 'str: "RESULT: STABLE (Source verified, D_MOD=...)" or "RESULT: VOID (semantic grounding failure)" or "EXCLUSION: FERMAT/PYTHAGOREAN LIMIT"',
      tag: '[Подтверждён кодом]'
    },
    triggerCondition: {
      text: 'Triggered (VOID): not source_present (gcd <= 1) OR DMOD >= 1.0 (where DMOD = sum(exponents)/100.0 + (0.0 if source else 1.0)). Balu exclusion: any(p <= 2 for p in exponents).',
      tag: '[Подтверждён кодом]'
    },
    sideEffects: {
      text: 'Logical branch annihilation (returning string VOID to abort search). No side effects on global memory or environment.',
      tag: '[Подтверждён кодом]'
    },
    edgeCases: {
      text: 'Empty numbers list -> check_source returns False. Negative numbers or zero -> standard math.gcd behavior or ValueError. Exponents <= 2 trigger Fermat exclusion.',
      tag: '[Подтверждён кодом]'
    },
    tests: {
      text: 'Test 1: [3, 5, 8] with [3, 3, 3] -> VOID (gcd=1). Test 2: [4, 8, 12] with [3, 3, 3] -> STABLE (gcd=4, DMOD=0.09). Test 3: [3, 4, 5] with [2, 2, 2] -> EXCLUSION: FERMAT/PYTHAGOREAN LIMIT.',
      tag: '[Подтверждён кодом]'
    }
  },
  {
    id: 'mcrg',
    title: '2. MCRG — Medical Coherence Residual Gate (Neural Latent Filter)',
    category: 'mcrg',
    inputs: {
      text: 'x: torch.Tensor, residual: Optional[torch.Tensor], v_ref: float = 0.201, threshold: float = 0.3678, phi: float = 1.618',
      tag: '[Подтверждён кодом]'
    },
    outputs: {
      text: 'output: torch.Tensor (transformed tensor preserving input shape and batch independence).',
      tag: '[Подтверждён кодом]'
    },
    triggerCondition: {
      text: 'Hard Gate (Kenosis): TDI > threshold (0.3678 ~ 1/e). TDI computed as mean(|z - V_ref|) across spatial dimensions (1, 2, 3, 4) in vector mode.',
      tag: '[Подтверждён кодом]'
    },
    sideEffects: {
      text: 'Autograd hook registration (combined.register_hook): selectively nullifies gradients (grad * (1.0 - hard_gate)) for compromised batch elements upon Hard Gate trigger.',
      tag: '[Подтверждён кодом]'
    },
    edgeCases: {
      text: 'Requires pre-normalized DICOM inputs (Z-score / WhiteStripe) calibrated to V_ref=0.201. Uncalibrated inputs cause false positive blocking.',
      tag: '[Подтверждён текстом]'
    },
    tests: {
      text: '3D MRI patches (128x128x128). TDI shift: 0.538 clamped near threshold 0.379. False Positive Rate (FPR) reduced by ~50% (from 26.2% to 13.0%) with ~8-10% latency overhead on RTX 3090.',
      tag: '[Подтверждён текстом]'
    }
  },
  {
    id: 'telemetry',
    title: '3. Separation Lemma — Trajectory Monitor (Agent Guard)',
    category: 'telemetry',
    inputs: {
      text: 'embedding: np.ndarray (d=4096 or 64D via random projection), k=50 (sliding window), eps=0.1, tau=1e-4',
      tag: '[Подтверждён кодом]'
    },
    outputs: {
      text: 'str status: "WARMUP" | "NOMINAL" | "PRODUCTIVE_FOCUS" | "STAGNATION_DETECTED" (triggers HARD_INTERRUPT -> ORTHOGONAL_RESET)',
      tag: '[Подтверждён кодом]'
    },
    triggerCondition: {
      text: 'Stagnation: (PR < 5.0 and DET > 0.5) AND Centroid Mobility Mt = ||mu_t - mu_{t-k}||^2 < tau.',
      tag: '[Подтверждён кодом]'
    },
    sideEffects: {
      text: 'Generates HARD_INTERRUPT signal for context reset and orthogonal reset injection. Non-destructive monitoring (no LLM weight modification).',
      tag: '[Подтверждён кодом]'
    },
    edgeCases: {
      text: 'Warmup phase: returns WARMUP for the first k-1 steps. SVD eigenvalue computation requires epsilon regularization (1e-9) to prevent division by zero.',
      tag: '[Подтверждён кодом]'
    },
    tests: {
      text: 'Replay backtesting of SWE-agent logs and ROS2 robotics. Suppresses false positives in 98.8% of deep productive specialization. Detection time gain (PHG): +18 steps for agents.',
      tag: '[Подтверждён текстом]'
    }
  }
];

export const ZENODO_RECORDS = [
  { title: "Mathematical Formalization of Beal's Conjecture and Integration with AAM-V1", doi: "10.5281/zenodo.18759741", type: "Discrete Gate" },
  { title: "The Balu Concept: Formalization of Beal's Conjecture within AAM-V1", doi: "10.5281/zenodo.18783390", type: "Balu Extension" },
  { title: "Medical Coherence Residual Gate (MCRG): Residual Stabilization in Volumetric Medical Imaging", doi: "10.5281/zenodo.18807803", type: "Neural Latent" },
  { title: "Kenosis-Recompilation Principle: AAGI Safety Against Ontological Collapse", doi: "10.5281/zenodo.18822667", type: "Agent Safety" },
  { title: "Spectral Attractor 1/e and Topological Dissonance Index (TDI)", doi: "10.5281/zenodo.18611438", type: "Constants & TDI" },
  { title: "AAM-V1 Runtime Telemetry and Agent Separation Lemma", doi: "10.5281/zenodo.20293391", type: "Telemetry Monitor" }
];
