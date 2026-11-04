# ECP Passport: AG-ECP-001 (Discrete Gate)

--------------------------------------------------
**Identifier:** `AG-ECP-001`  
**Name:** `discrete_gate`  
**Type:** Engineering Constructor Primitive (ECP)  
**Parent Package:** `alyosha-gate`  
**Version:** `0.1.0-alpha.1`  
**Normative Status:** Normative Specification (Authoritative Source for `ecp_discrete_gate.json`)  
**Implementation Status:** `PROJECT_PROPOSAL` (Mode: `rectified`) | `BLOCKED` (Mode: `source_faithful`)  
--------------------------------------------------

## 1. Purpose & Functional Role
`AG-ECP-001` (`discrete_gate`) is an experimental candidate filter in the context of the Beal conjecture (it is not a solver or mathematical proof).

Its function is to perform deterministic preliminary screening of candidate integer sequences and exponents under specified conditions before downstream computation or search steps are triggered. The filter may be applied for early screening of candidates in a search pipeline. Performance was not measured; the impact of the filter on execution time and operation count is unknown.

---

## 2. Applicability Domain

### ✅ Suitable Tasks:
1. **Early Search Pipeline Screening:** Discarding candidate tuples $(A, B, C, \dots)$ that lack a common divisor ($\gcd \le 1$). (Performance was not measured; the impact of the filter on execution time and operation count is unknown).
2. **Entropy/Chaos Filtering:** Excluding candidate branches whose exponent sum and penalty index exceed the empirical chaos threshold ($\text{DMOD} \ge 1.0$).
3. **Balu Exponent Domain Boundary:** Automatically filtering candidate solutions that include exponents $p \le 2$ (trivial Pythagorean or Fermat subdomains in the context of Beal conjecture investigations).
4. **Agent Guardrails:** Acting as a deterministic pre-check in symbolic AI pipelines where hallucinations of shared roots must be intercepted immediately.

### ❌ Cases Where It MUST NOT Be Used:
1. **Diophantine Equation Solvers:** PASS indicates that the candidate passed the checks of this filter; by itself, this result does not prove numerical equality, the existence of a solution, or the truth of a theorem. It is an experimental candidate filter in the context of the Beal conjecture, not a solver or mathematical proof.
2. **Theorem Prover Truth Decider:** Do NOT use this filter as a formal mathematical proof of truth or falsehood of the Beal Conjecture or any related conjecture.
3. **Historical Exact Replication:** Do NOT use with `mode="source_faithful"` until authorial Zenodo preprints with verbatim listings are officially integrated.
4. **Continuous or Neural States:** Not applicable to floating-point embedding vectors or neural activations (reserved for Phase 3 MCRG).

---

## 3. Interfaces & Data Contracts

### 3.1 Input Contract (`DiscreteInput`)
```python
@dataclass(frozen=True)
class DiscreteInput:
    numbers: Sequence[int]
    exponents: Sequence[int]
    threshold: float = 1.0
    check_exponent_limit: bool = True
```

#### Preconditions & Validation Rules:
* `numbers`: Non-empty sequence of strictly positive integers ($N_i \in \mathbb{Z}, N_i \ge 1$). Strings, bytes, bools, floats, and zero/negative numbers raise `InvalidInputError` or `EmptyInputError`. Support for sequences of arbitrary length ($k \ge 1$) and singleton inputs ($k = 1$): This is the behavior of the current implementation. Its mathematical justification and correspondence to the primary source have not been confirmed. Triads ($k = 3$) represent the canonical example in the context of the Beal conjecture.
* `exponents`: Non-empty sequence of strictly positive integers ($p_i \in \mathbb{Z}, p_i \ge 1$). Same type restrictions apply.
* `len(numbers) == len(exponents)`: Must have equal lengths; mismatch raises `LengthMismatchError`. Support for sequences of arbitrary length ($k \ge 1$): This is the behavior of the current implementation. Its mathematical justification and correspondence to the primary source have not been confirmed.
* `threshold`: Finite float strictly greater than 0.0 ($\tau \in \mathbb{R}^+, \tau > 0.0$). Boolean, NaN, and $\pm\infty$ raise `InvalidInputError`.
* `check_exponent_limit`: Boolean flag indicating whether to enforce the $p \le 2$ exclusion rule (default: `True`).

### 3.2 Output Contract (`DiscreteGateResult`)
```python
@dataclass(frozen=True)
class DiscreteGateResult:
    is_triggered: bool           # True if gate activated veto (VOID)
    decision: GateDecision       # PASS or VOID
    mode: GateMode               # RECTIFIED or SOURCE_FAITHFUL
    reason: GateReason           # Explicit machine-readable reason code
    status_message: str          # Descriptive summary of decision
    gcd_value: int               # Computed mathematical GCD of numbers
    source_present: bool         # True if gcd_value > 1
    dmod_value: float            # Computed DMOD float
    threshold_value: float       # Threshold evaluated against (default 1.0)
    metadata: Dict[str, Any]     # Defensive copies of inputs and intermediate sums
```

#### Status & Reason Enumerations:
* `GateDecision`:
  * `PASS`: PASS indicates that the candidate passed the checks of this filter; by itself, this result does not prove numerical equality, the existence of a solution, or the truth of a theorem.
  * `VOID`: State violates algebraic root presence, exponent limits, or chaos threshold.
* `GateReason`:
  * `SOURCE_IDENTIFIED`: $\gcd > 1$ and $\text{DMOD} < \text{threshold}$. Decision is `PASS`.
  * `NO_COMMON_SOURCE`: $\gcd \le 1$. Candidate bases are mutually coprime. Decision is `VOID`.
  * `DMOD_THRESHOLD_EXCEEDED`: $\text{DMOD} \ge \text{threshold}$. Decision is `VOID`.
  * `EXPONENT_LIMIT_EXCLUSION`: $\exists p_i \le 2$ with `check_exponent_limit=True`. Decision is `VOID`.

---

## 4. Algorithm & Decision Logic (`rectified`)

Evaluation proceeds through a strictly ordered 6-step pipeline:

```
[Input: numbers, exponents, threshold]
                 │
                 ▼
     [Step 1: Raw Type Validation] ──(Violation)──► Raise InvalidInputError / EmptyInputError
                 │
                 ▼
     [Step 2: Coercion & GCD / DMOD Calculation]
     • GCD = gcd(*numbers)
     • source_present = (GCD > 1)
     • Rajas = sum(exponents) / 100.0
     • Tamas = 0.0 if source_present else 1.0
     • DMOD = round(Rajas + Tamas, 10)
                 │
                 ▼
     [Step 3: Exponent Limit Check]
     • If check_exponent_limit and min(exponents) <= 2:
           RETURN VOID (reason: EXPONENT_LIMIT_EXCLUSION)
                 │
                 ▼
     [Step 4: Common Source Check]
     • If not source_present (GCD <= 1):
           RETURN VOID (reason: NO_COMMON_SOURCE)
                 │
                 ▼
     [Step 5: Chaos Threshold Check]
     • If DMOD >= threshold:
           RETURN VOID (reason: DMOD_THRESHOLD_EXCEEDED)
                 │
                 ▼
     [Step 6: Passage]
     • RETURN PASS (reason: SOURCE_IDENTIFIED)
```

---

## 5. Guarantees

1. **Strict Determinism:** Evaluating identical numerical inputs $K$ times produces byte-for-byte identical results.
2. **Defensive Immutability:** Inputs are converted into frozen immutable tuples upon container initialization; mutating the caller's list will never corrupt the evaluation.
3. **Zero Runtime Dependencies:** Requires only standard Python 3.11+ built-in modules (`math`, `dataclasses`, `enum`, `typing`).
4. **Diagnostic Preservation:** When `EXPONENT_LIMIT_EXCLUSION` triggers, the exact mathematical `gcd_value` and `dmod_value` are still computed and preserved in the result for diagnostic telemetry.
5. **Fail-Fast Typing:** Passing invalid types (`bool`, `float` for integers, `NaN`, `bytes`, mismatched lengths) raises explicit typed exceptions rather than returning degraded results.

---

## 6. Constraints, Non-Claims & Ambiguities

* **Non-Claim of Equivalence:** `AG-ECP-001` does NOT compute whether $\sum A_i^{p_i} = C^z$. PASS indicates that the candidate passed the checks of this filter; by itself, this result does not prove numerical equality, the existence of a solution, or the truth of a theorem.
* **Vector Generalization & Singletons:** Support for sequences of arbitrary length ($k \ge 1$) and singleton inputs ($k = 1$): This is the behavior of the current implementation. Its mathematical justification and correspondence to the primary source have not been confirmed. In the historical context, 3-variable triads $(A, B, C)$ serve as the canonical example in the context of the Beal conjecture. For a single number $N > 1$, $\gcd(N) = N > 1$, meaning `source_present` evaluates to `True`. Triads are canonical but not an enforced limitation.
* **Unconfirmed DMOD Formula and Scaling:** The DMOD formula $\text{DMOD} = \text{round}((\sum p / 100.0) + \text{penalty}, 10)$, the scaling divisor $100.0$, and the tamas penalty term are implementation choices derived from secondary briefs (`REPORTED` / `PROJECT_PROPOSAL`), not verified against a primary authoritative preprint listing.
* **Branch Priority Decision:** The strict evaluation sequence — checking the exponent limit ($p \le 2$) prior to the common source check ($\gcd \le 1$), and checking common source prior to the chaos threshold — is an intentional design choice of the current implementation (`PROJECT_PROPOSAL`) to filter trivial subdomains early. It is not confirmed as an authoritative rule from primary sources.
* **Boundary of DMOD:** Whether $\text{DMOD} == \text{threshold}$ triggers `VOID` or `PASS` is formalized in `rectified` mode as `dmod >= threshold -> VOID`.
* **Historical Faithfulness Guard:** Calling with `mode="source_faithful"` raises `SourceListingRequired` to prevent speculative reproduction of historical preprints without authentic artifacts.

---

## 7. Dependencies

* Python Runtime: `>= 3.11`
* Standard Library: `math`, `dataclasses`, `enum`, `typing`
* External Packages: None (zero dependencies)

---

## 8. Minimal Invocation Example

```python
from alyosha_gate import evaluate_discrete_gate, GateDecision

# Invoking via unified top-level facade
res = evaluate_discrete_gate(
    numbers=[4, 8, 12],
    exponents=[3, 3, 3],
    threshold=1.0,
)

assert res.decision == GateDecision.PASS
assert res.gcd_value == 4
assert res.dmod_value == 0.09
assert res.is_triggered is False
```

---

## 9. Verification & Self-Test

Run the automated test suite using `unittest` or `pytest`:
```bash
PYTHONPATH="src" python3 -m unittest discover -s tests -p "test_*.py" -v
```
Expected result: 25+ tests pass with zero failures and zero warnings.

---

## 10. Provenance & Epistemic Status Matrix

| Rule / Parameter | Epistemic Status | Primary Reference / Evidence |
|---|---|---|
| Criterion $\gcd(numbers) > 1$ | `REPORTED` | Secondary brief citing Zenodo 18759741 and Zenodo 18783390. Primary source listing pending. |
| Formula $\text{DMOD} = \frac{\sum p}{100} + (0 \text{ or } 1)$ | `REPORTED` | Secondary brief citing Zenodo 18759741 Appendix A; scaling $/100$ and penalty unconfirmed by primary source. |
| Threshold $\tau = 1.0$ | `REPORTED` | Secondary brief citing AAM-V1 methodology. |
| Exponent Limit $p \le 2 \implies \text{VOID}$ | `REPORTED` | Secondary brief citing Balu concept exclusion branch. |
| Branch Priority Order ($p \le 2$ before $\gcd$ before DMOD) | `PROJECT_PROPOSAL` | Implementation pipeline design for early trivial domain exclusion; unconfirmed by primary source. |
| Sequence Length ($k \ge 1$, singletons allowed, triads canonical) | `PROJECT_PROPOSAL` | This is the behavior of the current implementation. Its mathematical justification and correspondence to the primary source have not been confirmed. |
| Reason Codes (`GateReason` enum) | `PROJECT_PROPOSAL` | Machine-readable ECP integration protocol. |
| Blocking `source_faithful` | `PROJECT_PROPOSAL` | Anti-academic-drift integrity guard. |
| Verbatim Author Listing | `UNKNOWN` | Not present in repository; requires primary ingestion. |

---

## 11. Machine-Readable Schema

A companion JSON representation of this contract is located at [`docs/ecp_discrete_gate.json`](ecp_discrete_gate.json). In the event of any textual divergence between the two files, this document (`docs/ECP_DISCRETE_GATE.md`) serves as the normative authority.
