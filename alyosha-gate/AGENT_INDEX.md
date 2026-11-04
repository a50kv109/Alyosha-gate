# Alyosha Gate — Agent Index & Discovery Catalog

Welcome, AI Agent or Automated Engineering System. This catalog is your machine-oriented entry point for discovering, evaluating, and integrating components of **`alyosha-gate`**.

---

## 1. Quick Discovery (What is `alyosha-gate`?)

* **Package Name:** `alyosha-gate`
* **Current Version:** `0.1.0-alpha.1` (Research Prototype / Pre-Release)
* **Architecture Paradigm:** Engineering Constructor Primitives (ECP)
* **Runtime Dependencies:** Zero (`python >= 3.11` standard library only: `math`, `dataclasses`, `enum`, `typing`)
* **Primary Scope (Phase 1):** Performs deterministic preliminary screening of candidates under specified conditions in the context of the Beal conjecture (not a solver or mathematical proof).

---

## 2. Catalog of Available Primitives

| ECP ID | Primitive Name | Status | Applicable Domain | Normative Contract |
|---|---|---|---|---|
| **`AG-ECP-001`** | `discrete_gate` | `PROJECT_PROPOSAL` (rectified)<br>`BLOCKED` (source_faithful) | Candidate screening filter (common divisor check, DMOD chaos gating, Balu exponent boundary). | [`docs/ECP_DISCRETE_GATE.md`](docs/ECP_DISCRETE_GATE.md)<br>JSON: [`docs/ecp_discrete_gate.json`](docs/ecp_discrete_gate.json) |

*(Note: MCRG neural residual gate and Telemetry phase-space monitor are roadmapped for future phases and are NOT implemented in Phase 1.)*

---

## 3. When to Apply vs When NOT to Apply `AG-ECP-001`

### ✅ Apply when:
* You need deterministic preliminary screening of candidates under specified conditions: checking common factor ($\gcd > 1$), empirical chaos index ($\text{DMOD} < 1.0$), and exponent boundary ($p > 2$).
* You need early screening of candidates in a search pipeline. (Note: Performance was not measured; the impact of the filter on execution time and operation count is unknown).
* Note on sequences: Support for sequences of arbitrary length ($k \ge 1$) and singleton inputs ($k = 1$): This is the behavior of the current implementation. Its mathematical justification and correspondence to the primary source have not been confirmed. Triads ($k = 3$) represent the canonical example in the context of the Beal conjecture.
* You need pure, deterministic, zero-dependency Python code with zero external side effects and explicit machine-readable reasons (`GateReason`).

### ❌ DO NOT Apply when:
* You need to solve or prove Diophantine equations ($A^x + B^y = C^z$). PASS indicates that the candidate passed the checks of this filter; by itself, this result does not prove numerical equality, the existence of a solution, or the truth of a theorem. The package is an experimental candidate filter in the context of the Beal conjecture, not a solver or proof.
* You require authorially-verified historical reproductions. The `source_faithful` mode is deliberately locked (`SourceListingRequired`) pending authentic Zenodo listings.
* Your problem domain involves continuous tensors or neural activations (MCRG is not implemented in Phase 1).

---

## 4. How to Import and Invoke

```python
from alyosha_gate import (
    evaluate_discrete_gate,
    GateDecision,
    GateMode,
    GateReason,
)

result = evaluate_discrete_gate(
    numbers=[6, 12, 18],
    exponents=[3, 4, 5],
    threshold=1.0,
    mode=GateMode.RECTIFIED,          # or "rectified"
    check_exponent_limit=True,
)

if result.decision == GateDecision.PASS:
    # Candidate satisfied filter checks (does not prove equality or theorem truth)
    retain_candidate(result)
elif result.decision == GateDecision.VOID:
    # Candidate did not pass filter checks
    prune_candidate(reason=result.reason, msg=result.status_message)
```

---

## 5. Navigation & Key References

* **Primitive Contract (Human & Agent Readable):** [`docs/ECP_DISCRETE_GATE.md`](docs/ECP_DISCRETE_GATE.md)
* **Machine-Readable JSON Contract:** [`docs/ecp_discrete_gate.json`](docs/ecp_discrete_gate.json)
* **Step-by-Step Integration Protocol:** [`docs/AGENT_INTEGRATION.md`](docs/AGENT_INTEGRATION.md)
* **Mathematical & Precondition Spec:** [`docs/SPEC_DISCRETE.md`](docs/SPEC_DISCRETE.md)
* **Evidence & Provenance Registry:** [`docs/SOURCE_STATUS.md`](docs/SOURCE_STATUS.md)
* **Project Architecture Overview:** [`docs/PROJECT_OVERVIEW.md`](docs/PROJECT_OVERVIEW.md)

---

## 6. How to Run Verification & Tests

```bash
# In an environment with Python 3.11+ and PYTHONPATH pointing to src:
PYTHONPATH="src" python3 -m unittest discover -s tests -p "test_*.py" -v

# Or using pytest:
pytest -v
```

---

## 7. Epistemic Status of Mathematical Rules

In accordance with strict scientific integrity, all algorithms and thresholds are classified by evidence level:
* **`SOURCE_VERIFIED`:** 0 items (no primary Zenodo source code has been ingested directly into the repository).
* **`REPORTED`:** $\gcd > 1$ criterion, DMOD formula $\frac{\sum p}{100} + \text{penalty}$, threshold 1.0, Balu $p \le 2$ limit.
* **`PROJECT_PROPOSAL`:** $N$-ary vector generalization, strict type enforcement, `GateReason` enums, `source_faithful` blocking guard.
* **`UNKNOWN`:** Scalar parameter boundaries in unpublished authorial scripts.

See [`docs/SOURCE_STATUS.md`](docs/SOURCE_STATUS.md) for full audit trails.
