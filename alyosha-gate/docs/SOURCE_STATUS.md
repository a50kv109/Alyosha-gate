# Source Status & Verification Registry

**Applicable ECP:** `AG-ECP-001` (`discrete_gate`)  
**Policy:** In accordance with scientific integrity standards, no assertion may be marked as `SOURCE_VERIFIED` without an exact primary document reference and verbatim listing coordinate.

---

## Status Definitions
* **`SOURCE_VERIFIED`:** Confirmed directly by an inspected primary document/code listing with exact page/section reference. (Currently **0** items, pending primary artifact ingestion).
* **`REPORTED`:** Known from secondary summaries, user briefs, or repository descriptions, but primary text/listing was not directly ingested in this environment.
* **`PROJECT_PROPOSAL`:** Synthesized as a clean, self-consistent engineering specification to ensure standard operation.
* **`UNKNOWN`:** Origin or intended authorial behavior cannot be reliably determined.

---

## Registry Matrix

| Component / Assertion | Status | Available Basis | What is Needed for Verification |
|---|---|---|---|
| **Discrete Gate: Criterion `gcd(A,B,C) > 1`** | `REPORTED` | User brief citing Zenodo 18759741 and Balu Concept (Zenodo 18783390). | Verbatim text/code listing of `check_source` from Zenodo 18759741 Appendix A. |
| **Discrete Gate: DMOD Formula** $\frac{\sum p}{100} + (0 \text{ or } 1)$ | `REPORTED` / `PROJECT_PROPOSAL` | Secondary brief citing Zenodo 18759741 Appendix A; scaling $/100$ and penalty are unconfirmed by primary source. | Verbatim Python script from Zenodo record appendix. |
| **Discrete Gate: DMOD Threshold $\tau = 1.0$** | `REPORTED` | User brief citing AAM-V1 specifications. | Clarification whether 1.0 is an absolute mathematical boundary or configurable parameter. |
| **Discrete Gate: Balu Exponent Limit ($p \le 2$)** | `REPORTED` | User brief referencing Balu Concept exclusion branch. | Verbatim listing from Zenodo 18783390 showing how $p \le 2$ was evaluated. |
| **Discrete Gate: Branch priority order ($p \le 2$ before $\gcd$)** | `PROJECT_PROPOSAL` | Implementation pipeline design for early trivial domain exclusion; unconfirmed by primary source. | Primary source specification of evaluation order. |
| **Discrete Gate: Pythagorean triplet check ($A^2+B^2=C^2$)** | `PROJECT_PROPOSAL` *(Deprecated/Removed from library)* | Introduced in earlier web demonstrator as heuristic. | Removed from library to avoid unverified mathematical baggage. |
| **Discrete Gate: Arbitrary length ($k \ge 1$, singletons allowed, triads canonical)** | `PROJECT_PROPOSAL` | This is the behavior of the current implementation. Its mathematical justification and correspondence to the primary source have not been confirmed. | Not present in original 3-argument formulation; explicit proposal. |
| **Discrete Gate: Reason codes (`GateReason`)** | `PROJECT_PROPOSAL` | Standard typed enum created for automated agent consumption. | Engineering extension for machine readability. |
| **MCRG: Constants ($V_{\text{ref}}=0.201, \theta=0.3678, \phi=1.618$)** | `REPORTED` | User brief citing Zenodo 18807803 and Zenodo 18611438. | PDF copy of Zenodo 18807803 for exact tensor dimension reduction equations. |
| **MCRG: Autograd hook `grad * (1.0 - hard_gate)`** | `REPORTED` | User brief describing PyTorch residual stream middleware. | Authorial PyTorch repository script (`a50kv109`). |
| **Telemetry: Separation Lemma thresholds ($PR < 5.0, DET > 0.5, M_t < 10^{-4}$)** | `REPORTED` | User brief citing Zenodo 20293391 and `aam-v1-agent-guard`. | Direct source repository audit of `a50kv109/aam-v1-agent-guard`. |
| **Telemetry: SVD regularizer $\epsilon = 10^{-9}$** | `REPORTED` | User brief mentioning eigenvalue clipping. | Direct code listing from `aam-v1-agent-guard`. |
| **`source_faithful` block on missing listing** | `PROJECT_PROPOSAL` | Guard mechanism implemented in `source_faithful.py`. | Ingesting the authentic listing to unblock the module. |
