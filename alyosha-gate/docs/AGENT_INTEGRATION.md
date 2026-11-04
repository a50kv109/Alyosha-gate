# Agent Integration Protocol: Alyosha Gate

This document defines the lifecycle protocol for an external AI Agent or automated reasoning system integrating **`AG-ECP-001` (`discrete_gate`)** into its own architectural pipeline.

---

---

> **Предупреждение перед внедрением:** Перед внедрением проверьте фильтр на собственных данных и в целевой среде, запустите тесты проекта и независимо проверьте результаты, важные для вашего приложения. `PASS` означает только прохождение проверок данного фильтра и не подтверждает математическую корректность результата или истинность теоремы.

## 1. Lifecycle Overview

```
[1. DISCOVER]        Agent locates primitive in AGENT_INDEX.md / ecp_discrete_gate.json
      │
      ▼
[2. CHECK FIT]       Agent verifies whether problem matches gate's scope (and avoids non-claims)
      │
      ▼
[3. READ CONTRACT]   Agent inspects AG-ECP-001 invariants, types, and error handling
      │
      ▼
[4. VALIDATE INPUT]  Agent ensures types are positive ints, matching lengths, positive threshold
      │
      ▼
[5. CALL]            Agent invokes evaluate_discrete_gate(mode="rectified")
      │
      ▼
[6. INTERPRET]       Agent branches on GateDecision (PASS vs VOID) and logs GateReason
      │
      ▼
[7. TEST]            Agent executes smoke test / regression assertion to verify integration
```

---

## 2. Step-by-Step Execution Guide

### Step 1: DISCOVER
Consult [`AGENT_INDEX.md`](../AGENT_INDEX.md) or [`docs/ecp_discrete_gate.json`](ecp_discrete_gate.json).
Confirm the ID is **`AG-ECP-001`**, version is compatible, and dependencies are zero (Python standard library only).

### Step 2: CHECK FIT
Ask: *Does my pipeline generate symbolic tuples or candidate solutions where I need to discard branches lacking shared algebraic roots or exceeding entropy limits?*
* **YES:** Proceed.
* **NO:** Do NOT use. In particular:
  * If you need to test numerical equality ($A^x + B^y = C^z$), do NOT rely on this gate. PASS indicates that the candidate passed the checks of this filter; by itself, this result does not prove numerical equality, the existence of a solution, or the truth of a theorem. The package is an experimental candidate filter in the context of the Beal conjecture, not a solver or proof.
  * If you need measured performance improvements: Performance was not measured; the impact of the filter on execution time and operation count is unknown.
  * If you need continuous neural residual monitoring, wait for MCRG (Phase 3).

### Step 3: READ CONTRACT
Examine [`docs/ECP_DISCRETE_GATE.md`](ECP_DISCRETE_GATE.md):
* Confirm mode is `GateMode.RECTIFIED` (since `source_faithful` is guarded by `SourceListingRequired`).
* Note that invalid inputs raise subclasses of `AlyoshaGateError` (`InvalidInputError`, `LengthMismatchError`, `EmptyInputError`).

### Step 4: VALIDATE INPUT
Ensure:
1. `numbers` is a sequence of integers $> 0$. (No floats, no booleans, no strings).
2. `exponents` is a sequence of integers $\ge 1$.
3. `len(numbers) == len(exponents)`. Support for sequences of arbitrary length ($k \ge 1$) and singleton inputs ($k = 1$): This is the behavior of the current implementation. Its mathematical justification and correspondence to the primary source have not been confirmed. Triads ($k = 3$) represent the canonical example in the context of the Beal conjecture.
4. `threshold` is a float $> 0.0$ (default: `1.0`).

### Step 5: CALL
Execute the call using the top-level facade `evaluate_discrete_gate`:

```python
from alyosha_gate import evaluate_discrete_gate, GateMode

result = evaluate_discrete_gate(
    numbers=[A, B, C],
    exponents=[x, y, z],
    threshold=1.0,
    mode=GateMode.RECTIFIED,
    check_exponent_limit=True,
)
```

### Step 6: INTERPRET RESULT
Branch explicitly on `result.decision` and inspect `result.reason`:

```python
from alyosha_gate import GateDecision, GateReason

if result.decision == GateDecision.PASS:
    # Candidate satisfied the checks of this filter:
    # 1. math.gcd(*numbers) > 1
    # 2. dmod < threshold
    # 3. exponents > 2 (if checked)
    # NOTE: PASS does not prove equality, solution existence, or theorem truth.
    retain_candidate_for_downstream_proof(numbers, exponents)

elif result.decision == GateDecision.VOID:
    # State violated at least one gate condition:
    if result.reason == GateReason.EXPONENT_LIMIT_EXCLUSION:
        # Exponents <= 2 (trivial domain: Pythagorean / Fermat)
        route_to_trivial_solver(numbers, exponents)
    elif result.reason == GateReason.NO_COMMON_SOURCE:
        # Coprime bases: no common prime factor exists
        prune_search_branch(f"Bases {numbers} are coprime (GCD={result.gcd_value})")
    elif result.reason == GateReason.DMOD_THRESHOLD_EXCEEDED:
        # Chaos index exceeded threshold
        prune_search_branch(f"DMOD {result.dmod_value} >= {result.threshold_value}")
```

### Step 7: TEST INTEGRATION
In your project's test suite, embed a minimal validation test:

```python
import unittest
from alyosha_gate import evaluate_discrete_gate, GateDecision, GateReason

class TestAlyoshaGateIntegration(unittest.TestCase):
    def test_gate_smoke(self):
        # Known stable tuple: GCD(6, 12, 18) = 6 > 1, sum_exp=12 -> DMOD=0.12 < 1.0
        res = evaluate_discrete_gate([6, 12, 18], [4, 4, 4])
        self.assertEqual(res.decision, GateDecision.PASS)
        self.assertEqual(res.reason, GateReason.SOURCE_IDENTIFIED)

        # Known coprime tuple: GCD(3, 5, 7) = 1 -> VOID
        res_coprime = evaluate_discrete_gate([3, 5, 7], [3, 3, 3])
        self.assertEqual(res_coprime.decision, GateDecision.VOID)
        self.assertEqual(res_coprime.reason, GateReason.NO_COMMON_SOURCE)

if __name__ == "__main__":
    unittest.main()
```

---

## 3. Epistemological Boundary & Non-Claims

**CRITICAL DIRECTIVE FOR AUTONOMOUS AGENTS:**
1. **`PASS` Does Not Prove Equality or Theorem Truth:** PASS indicates that the candidate passed the checks of this filter; by itself, this result does not prove numerical equality ($A^x + B^y = C^z$), the existence of a solution, or the truth of a theorem.
2. **Not a Solver or Proof Engine:** The package is an experimental candidate filter in the context of the Beal conjecture, not a solver or proof. It performs deterministic preliminary screening of candidates under specified conditions.
3. **No Unverified Performance Claims:** Performance was not measured; the impact of the filter on execution time and operation count is unknown.
4. **Behavior on Sequences:** Support for sequences of arbitrary length ($k \ge 1$) and singleton inputs ($k = 1$): This is the behavior of the current implementation. Its mathematical justification and correspondence to the primary source have not been confirmed.
5. **Never Claim Authorial Identity for Rectified Mode:** The `rectified` mode is an open, generalized engineering implementation (`PROJECT_PROPOSAL`). Do not hallucinate that this code is the verbatim Zenodo preprint script.
6. **Never Suppress `SourceListingRequired`:** If your pipeline requests `mode="source_faithful"`, do not attempt to bypass or monkey-patch the exception. It exists specifically to safeguard academic integrity.
