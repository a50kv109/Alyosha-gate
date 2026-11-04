# Agent Usage Guide: Discrete Gate

This document serves as an operational manual for autonomous AI agents, automated reasoning engines, and LLM middleware utilizing `alyosha-gate`.

---

## 1. When to Apply Discrete Gate
The gate performs deterministic preliminary screening of candidates under specified conditions in the context of the Beal conjecture (it is not a solver or mathematical proof).

Apply `evaluate_discrete_gate` when your pipeline or search tree needs to:
* **Perform early candidate screening:** Filter candidates lacking a common divisor ($\gcd \le 1$). Note: Performance was not measured; the impact of the filter on execution time and operation count is unknown.
* **Filter entropy conditions:** Reject candidate branches whose exponent sum and penalty exceed the empirical chaos threshold ($\text{DMOD} \ge 1.0$).
* **Exclude trivial exponent domains:** Automatically filter candidate configurations that include exponents $p \le 2$ (trivial Pythagorean or Fermat subdomains).

> **Implementation Note on Inputs:** Support for sequences of arbitrary length ($k \ge 1$) and singleton inputs ($k = 1$): This is the behavior of the current implementation. Its mathematical justification and correspondence to the primary source have not been confirmed. Triads ($k = 3$) represent the canonical example in the context of the Beal conjecture.

---

## 2. Invocation Pattern

```python
from alyosha_gate import (
    evaluate_discrete_gate,
    GateDecision,
    GateMode,
    GateReason,
    SourceListingRequired,
)

try:
    result = evaluate_discrete_gate(
        numbers=[A, B, C],
        exponents=[x, y, z],
        threshold=1.0,
        mode=GateMode.RECTIFIED,          # Explicitly select rectified
        check_exponent_limit=True,        # Enforce Balu p <= 2 exclusion
    )
except SourceListingRequired:
    # Occurs only if mode=GateMode.SOURCE_FAITHFUL is requested
    # Fallback to rectified or report missing listing
    pass
```

---

## 3. Interpreting `DiscreteGateResult`

```python
if result.decision == GateDecision.PASS:
    # Candidate satisfied the checks of this filter (gcd_value > 1, dmod_value < threshold).
    # NOTE: This does not prove equality, solution existence, or theorem truth.
    proceed_with_search(result.metadata)
else:
    # Candidate did not pass filter checks (VOID)
    handle_pruned_branch(result.reason, result.status_message)
```

### Machine-Readable Reason Codes (`result.reason`):
1. **`GateReason.NO_COMMON_SOURCE`:**
   * Meaning: $\gcd(A_1, \dots, A_n) \le 1$. The bases do not share a common factor $> 1$.
   * Action: Prune search branch (grounding defect).
2. **`GateReason.DMOD_THRESHOLD_EXCEEDED`:**
   * Meaning: Common source exists, but DMOD entropy index $\ge \text{threshold}$.
   * Action: Prune search branch (chaos threshold breached).
3. **`GateReason.EXPONENT_LIMIT_EXCLUSION`:**
   * Meaning: At least one exponent is $\le 2$.
   * Action: Prune search branch or route to Pythagorean/Fermat solver.
4. **`GateReason.SOURCE_IDENTIFIED`:**
   * Meaning: Common source verified and DMOD within stable bounds.
   * Action: Retain branch.

---

## 4. What the Agent Must NOT Conclude
* **DO NOT conclude that a `PASS` decision proves equality or existence of a solution:** PASS indicates that the candidate passed the checks of this filter; by itself, this result does not prove numerical equality, the existence of a solution, or the truth of a theorem. The package is an experimental candidate filter in the context of the Beal conjecture, not a solver or proof.
* **DO NOT claim proven speedup or complexity reduction:** Performance was not measured; the impact of the filter on execution time and operation count is unknown.
* **DO NOT claim authorial provenance for rectified mode:** The `rectified` result is an open, deterministic engineering implementation (`PROJECT_PROPOSAL`), not an authorially verified Zenodo algorithm.
* **DO NOT attempt to bypass `SourceListingRequired`:** The `source_faithful` mode is locked pending ingestion of authentic primary source code listings.
