# 🛡️ alyosha-gate

**Deterministic Safety Gate and Residual Verification Toolkit (AAM-V1 Ecosystem)**  
*Phase 1: Discrete Gate Foundation*

[![Status: Research Prototype](https://img.shields.io/badge/status-research_prototype_/_pre--release-orange.svg)](#project-status)
[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## 1. What is `alyosha-gate`?
`alyosha-gate` is an experimental candidate filter in the context of the Beal conjecture (it is not a solver or mathematical proof). It performs deterministic preliminary screening of candidates under specified conditions, derived from the **AAM-V1 methodology (Artsybashev Analysis Method; метод анализа Арцыбашева)**.

In Phase 1, this package provides the **Discrete Gate (Preliminary Screening Filter)** — a preliminary screening mechanism for candidate integer sequences and exponents via:
* **Common Source Verification:** Greatest Common Divisor ($\gcd > 1$) checks on candidate bases.
* **DMOD Chaos Index:** Empirical entropy index penalizing ungrounded or high-degree configurations.
* **Balu Domain Exponent Boundary:** Automated exclusion of trivial exponent domains ($p \le 2$).

> **Important Distinction:**  
> This library is an independent, portable Python package for integration into backend services, reasoning engines, and AI agents. It is completely separate from the browser-based visualization stand (**Alyosha Gate Explorer & Simulator**).

> **🤖 For AI Agents & Autonomous Pipelines:**  
> Please begin with [`AGENT_INDEX.md`](AGENT_INDEX.md) and the ECP Passport [`docs/ECP_DISCRETE_GATE.md`](docs/ECP_DISCRETE_GATE.md) (`AG-ECP-001`). Machine-readable schema: [`docs/ecp_discrete_gate.json`](docs/ecp_discrete_gate.json). Integration lifecycle: [`docs/AGENT_INTEGRATION.md`](docs/AGENT_INTEGRATION.md).

---

## 2. What this Library Does and Does NOT Promise
* **DOES:**
  * Perform deterministic preliminary screening of candidates under specified conditions with zero external dependencies.
  * Return explicit, machine-readable reason codes (`GateReason`) and decisions (`PASS` / `VOID`).
  * Enforce scientific integrity by strictly blocking unverified legacy code execution via `SourceListingRequired`.
* **DOES NOT:**
  * Promise mathematical problem solving or proof: PASS indicates that the candidate passed the checks of this filter; by itself, this result does not prove numerical equality, the existence of a solution, or the truth of a theorem. The package is an experimental candidate filter in the context of the Beal conjecture, not a solver or proof.
  * Claim measured performance gains or complexity reduction: Performance was not measured; the impact of the filter on execution time and operation count is unknown.
  * Substitute unverified implementations without independent mathematical verification and primary source listings.
  * Claim academic verification or production-readiness until authoritative Zenodo listings and regression suites are ingested.

---

---

> **Предупреждение перед внедрением:** Перед внедрением проверьте фильтр на собственных данных и в целевой среде, запустите тесты проекта и независимо проверьте результаты, важные для вашего приложения. `PASS` означает только прохождение проверок данного фильтра и не подтверждает математическую корректность результата или истинность теоремы.

## 3. Two-Tier Architecture

To protect against academic drift, `alyosha-gate` separates execution into two distinct modes:

1. **`rectified` (Active, PROJECT_PROPOSAL):**  
   Clean, fully-typed, generalized implementation for practical engineering use.
2. **`source_faithful` (Blocked, Requires Primary Source):**  
   Reserved for verbatim reproduction of historical Zenodo preprint listings. Unconditionally raises `SourceListingRequired` until the author's primary listing is attached.

---

## 4. Installation

### From Source (Editable Mode):
```bash
git clone https://github.com/a50kv109/alyosha-gate.git
cd alyosha-gate
python3 -m venv .venv
source .venv/bin/activate
pip install -e ".[dev]"
```

---

## 5. Quick Start

```python
from alyosha_gate import (
    evaluate_discrete_gate,
    GateDecision,
    GateMode,
    GateReason,
)

# 1. Stable branch: bases share a common prime root (GCD=4 > 1), DMOD is low
result = evaluate_discrete_gate(
    numbers=[4, 8, 12],
    exponents=[3, 3, 3],
    threshold=1.0,
    mode=GateMode.RECTIFIED,
)

print(result.decision)       # GateDecision.PASS
print(result.reason)         # GateReason.SOURCE_IDENTIFIED
print(result.gcd_value)      # 4
print(result.dmod_value)     # 0.09

# 2. Void branch: mutually coprime bases (GCD=1)
void_result = evaluate_discrete_gate(
    numbers=[3, 5, 8],
    exponents=[3, 3, 3],
    threshold=1.0,
    mode=GateMode.RECTIFIED,
)

print(void_result.decision)  # GateDecision.VOID
print(void_result.reason)    # GateReason.NO_COMMON_SOURCE
```

---

## 6. Running Tests

```bash
# Run test suite with pytest
pytest -v
```

All operational paths of `RectifiedDiscreteGate` (source verification, DMOD threshold boundaries, exponent exclusion, input validation) and the `SourceFaithfulDiscreteGate` integrity guard are covered.

---

## 7. Project Status & Roadmap

* **Current Status:** `Research Prototype / Pre-Release (0.1.0-alpha.1)`.
* **Current Focus:** Discrete Gate core contracts and validation.
* **Next Steps:**
  * [ ] Ingestion of authentic primary listings for `source_faithful`.
  * [ ] Phase 3: MCRG Neural Residual Gate (PyTorch 3D U-Net adapter).
  * [ ] Phase 4: Trajectory Telemetry Monitor (Separation Lemma).

See [`docs/ROADMAP.md`](docs/ROADMAP.md) and [`docs/SPEC_DISCRETE.md`](docs/SPEC_DISCRETE.md) for full details.
