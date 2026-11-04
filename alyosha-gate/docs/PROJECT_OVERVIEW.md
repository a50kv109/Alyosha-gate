# Project Overview: `alyosha-gate`

## 1. Context & Purpose
`alyosha-gate` is an independent, embeddable Python library designed to provide deterministic verification, mathematical gatekeeping, and residual stabilization primitives derived from the **AAM-V1 Methodology (Artsybashev Analysis Method)**.

In the broad architectural ecosystem, **Alyosha Gate** refers to a triad of gating mechanisms:
1. **Discrete Gate (Preliminary Screening Filter):** Performs deterministic preliminary screening of candidate integer sequences under specified conditions (Greatest Common Divisor source verification, empirical DMOD chaos evaluation, and exponent boundary checking). It is an experimental candidate filter in the context of the Beal conjecture (not a solver or proof).
2. **MCRG (Medical Coherence Residual Gate):** Neural residual stream stabilization layer with Topological Divergence Index (TDI), Kenosis threshold ($\theta \approx 1/e$), and autograd gradient nullification.
3. **Telemetry Monitor (Separation Lemma):** Phase-space trajectory monitor tracking Participation Ratio (PR), Recurrence Determinism (DET), and Centroid Mobility ($M_t$) to prevent attractor locking in autonomous AI agents.

> **Current Implementation Scope (Phase 1):**
> This repository strictly implements **Discrete Gate**.
> MCRG and Telemetry Monitor are intentionally deferred to subsequent milestones.

---

## 2. Distinction from the Web Explorer
This codebase is completely separate from the browser-based **Alyosha Gate Explorer & Simulator**:
* **The Web Explorer (`/src`, React/TypeScript):** An interactive research visualization stand and educational simulator designed for visual inspection and UI parameter tuning in the browser.
* **The Python Library (`alyosha-gate`):** A standalone, portable, zero-runtime-dependency Python package designed for headless integration into automated pipelines, automated reasoning frameworks, agent guardrails, and unit testing suites.

---

## 3. Scientific Integrity & The Two-Tier Architectural Paradigm

To prevent academic drift, the library adheres to a strict dual-mode model:

| Mode | Purpose | Current Status | Requirement |
|---|---|---|---|
| `source_faithful` | Exact replication of historical author listings (e.g. Zenodo preprints), including any scalar limits or idiosyncrasies for regression audits. | **BLOCKED / PLACEHOLDER** | Requires verbatim primary source code listing from the author/Zenodo record. No reverse-engineered mocks are permitted. |
| `rectified` | Clean, vectorized, strictly-typed implementation intended for production and practical engineering integration. | **ACTIVE (PROJECT_PROPOSAL)** | Fully documented, strictly validated, and accompanied by comprehensive unit tests. |

---

## 4. Architectural Invariants & Non-Claims
* **Deterministic Preliminary Screening:** The filter performs deterministic preliminary screening of candidates under specified conditions. Given the same numerical inputs, it produces strictly identical outputs every time.
* **`PASS` Semantics:** PASS indicates that the candidate passed the checks of this filter; by itself, this result does not prove numerical equality, the existence of a solution, or the truth of a theorem. The package is an experimental candidate filter in the context of the Beal conjecture, not a solver or mathematical proof.
* **Early Screening Without Benchmarked Claims:** Performance was not measured; the impact of the filter on execution time and operation count is unknown.
* **Sequence Conventions:** Support for sequences of arbitrary length ($k \ge 1$) and singleton inputs ($k = 1$): This is the behavior of the current implementation. Its mathematical justification and correspondence to the primary source have not been confirmed.
* **Zero Runtime Dependencies:** The core package runs on standard Python 3.11+ without requiring NumPy, SciPy, or PyTorch.
* **Explicit Exceptions:** Invalid inputs raise clear `InvalidInputError` subclasses (`EmptyInputError`, `LengthMismatchError`) rather than returning misleading silent failures.
