# Specification: Discrete Gate (Phase 1)

**Specification Status:** `PROJECT_PROPOSAL` (Rectified) & `BLOCKED` (Source-Faithful)  
**Applicable Module:** `alyosha_gate.discrete`

---

## 1. Input Contract

### `DiscreteInput`
```python
@dataclass(frozen=True)
class DiscreteInput:
    numbers: Sequence[int]
    exponents: Sequence[int]
    threshold: float = 1.0
    check_exponent_limit: bool = True
```

### Preconditions & Validation Rules:
1. `numbers` and `exponents` must be non-empty sequences of integers (`len > 0`), and must not be strings or bytes, otherwise `InvalidInputError` / `EmptyInputError`.
2. `len(numbers) == len(exponents)`, otherwise `LengthMismatchError`.
3. Every base in `numbers` must be an integer strictly greater than zero ($N_i > 0$), otherwise `InvalidInputError`.
4. Every exponent in `exponents` must be an integer strictly greater than zero ($p_i \ge 1$), otherwise `InvalidInputError`.
5. `threshold` must be a finite numerical float strictly greater than zero ($\tau > 0.0$ and not NaN/inf), otherwise `InvalidInputError`.
6. Support for sequences of arbitrary length ($k \ge 1$) and singleton inputs ($k = 1$): This is the behavior of the current implementation. Its mathematical justification and correspondence to the primary source have not been confirmed. Triads ($k = 3$) represent the canonical example in the context of the Beal conjecture.

---

## 2. Mathematical Definition (`rectified`)

### Step 1: Balu Exponent Limit Check
If `check_exponent_limit` is `True` and $\exists p_i \in \text{exponents} : p_i \le 2$:
* **Decision:** `GateDecision.VOID`
* **Reason:** `GateReason.EXPONENT_LIMIT_EXCLUSION`
* **Status:** `VOID: Exponent limit exclusion triggered (min exponent <= 2, outside Beal non-trivial domain).`
* **Rationale:** In the context of the Beal conjecture, candidates with exponents $\le 2$ fall into Pythagorean or Fermat trivial domains and are excluded from non-trivial candidate search.
* **Note on Heuristics:** The library **does not** test whether $A^2 + B^2 = C^2$. The filter is strictly based on the exponent domain constraint ($p \le 2$).

### Step 2: Source Verification via Greatest Common Divisor
$$\text{GCD} = \gcd(A_1, A_2, \dots, A_n)$$
$$\text{source\_present} = (\text{GCD} > 1)$$

* If $\text{source\_present} == \text{False}$:
  * The candidate bases are pairwise or mutually coprime; no shared root exists.

### Step 3: DMOD Chaos Evaluation
$$\text{Rajas} = \frac{\sum_{i=1}^n p_i}{100.0}$$
$$\text{Tamas} = \begin{cases} 0.0 & \text{if } \text{source\_present} == \text{True} \\ 1.0 & \text{if } \text{source\_present} == \text{False} \end{cases}$$
$$\text{DMOD} = \text{Rajas} + \text{Tamas} = \frac{\sum p_i}{100.0} + (0.0 \text{ if } \text{source\_present} \text{ else } 1.0)$$

### Step 4: Gating Decision Logic
1. **If $\text{source\_present} == \text{False}$:**
   * `is_triggered = True`
   * `decision = GateDecision.VOID`
   * `reason = GateReason.NO_COMMON_SOURCE`
   * `status = "VOID: No common source detected (GCD <= 1)."`
2. **Else if $\text{DMOD} \ge \text{threshold}$:**
   * `is_triggered = True`
   * `decision = GateDecision.VOID`
   * `reason = GateReason.DMOD_THRESHOLD_EXCEEDED`
   * `status = "VOID: DMOD chaos threshold exceeded (DMOD >= threshold)."`
3. **Else ($\text{source\_present} == \text{True}$ AND $\text{DMOD} < \text{threshold}$):**
   * `is_triggered = False`
   * `decision = GateDecision.PASS`
   * `reason = GateReason.SOURCE_IDENTIFIED`
   * `status = "STABLE: Common source identified (GCD > 1), DMOD < threshold."`
   * **Note on PASS:** PASS indicates that the candidate passed the checks of this filter; by itself, this result does not prove numerical equality, the existence of a solution, or the truth of a theorem. The package is an experimental candidate filter in the context of the Beal conjecture, not a solver or mathematical proof.

---

## 3. Output Contract

### `DiscreteGateResult`
```python
@dataclass(frozen=True)
class DiscreteGateResult:
    is_triggered: bool           # True if gate activated veto (VOID)
    decision: GateDecision       # PASS or VOID
    mode: GateMode               # RECTIFIED or SOURCE_FAITHFUL
    reason: GateReason           # SOURCE_IDENTIFIED, NO_COMMON_SOURCE, etc.
    status_message: str          # Descriptive human-readable summary
    gcd_value: int               # Computed mathematical GCD of numbers
    source_present: bool         # True if GCD > 1
    dmod_value: float            # Computed DMOD float
    threshold_value: float       # Threshold evaluated against (default 1.0)
    metadata: Dict[str, Any]     # Raw input copies, min exponent, sums
```

---

## 4. `source_faithful` Contract & Specification Requirements
In `source_faithful` mode, calling the gate raises:
```python
raise SourceListingRequired(...)
```
To implement this mode in future releases without academic drift, the following primary artifacts are required:
1. Exact verbatim Python/pseudocode listing from **Zenodo 18759741 (Appendix A)** or **Zenodo 18783390**.
2. Formal signature (scalar $(A, B, C, x, y, z)$ vs list $(numbers, exponents)$).
3. Exact string output conventions and error handling policy as originally authored.
