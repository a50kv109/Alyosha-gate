# Roadmap: `alyosha-gate` Ecosystem

This roadmap outlines the phased development of the `alyosha-gate` standalone library.

---

## Phase 1: Discrete Gate Foundation (CURRENT)
- [x] Zero-dependency core Python package setup (`pyproject.toml`, typing, packaging).
- [x] Rectified implementation of Discrete Gate (`RectifiedDiscreteGate`).
- [x] Balu exponent boundary check ($p \le 2$).
- [x] Strict input validation and custom typed exceptions.
- [x] Scientific integrity guard (`SourceFaithfulDiscreteGate` raising `SourceListingRequired`).
- [x] Comprehensive pytest test suite for rectified gate and placeholder guard.
- [x] Agent usage guide and source status matrix.

---

## Phase 2: Primary Listing Ingestion (`source_faithful`)
- [ ] Ingestion of verbatim source code listing from Zenodo 18759741 Appendix A.
- [ ] Ingestion of machine-readable Balu registry from Zenodo 18783390.
- [ ] Verification of scalar limitations and historical status strings.
- [ ] Regression parity test suite comparing `source_faithful` against `rectified`.

---

## Phase 3: MCRG Neural Residual Gate
- [ ] Implement `alyosha_gate.neural.mcrg` as an optional PyTorch adapter (`pip install alyosha-gate[torch]`).
- [ ] 5D tensor reduction `(B, C, D, H, W)` preserving batch sample independence.
- [ ] Topological Divergence Index (TDI) against baseline $V_{\text{ref}} = 0.201$.
- [ ] Kenosis Hard Gate bifurcation at $\theta = 0.3678 \approx 1/e$.
- [ ] Selective Autograd Hook `grad * (1.0 - hard_gate)`.
- [ ] Unit tests for gradient detachment and False Positive Rate reduction.

---

## Phase 4: Agent Trajectory Telemetry (Separation Lemma)
- [ ] Implement `alyosha_gate.telemetry.monitor` (`pip install alyosha-gate[telemetry]`).
- [ ] Sliding context window buffer ($k = 50$).
- [ ] Participation Ratio (PR) computation via covariance matrix eigenvalue decomposition.
- [ ] Recurrence Determinism (DET) metric via recurrence plot diagonal line extraction.
- [ ] Centroid Mobility metric ($M_t = \|\mu_t - \mu_{t-k}\|_2^2$).
- [ ] Automated interrupt directive generator (`HARD_INTERRUPT -> ORTHOGONAL_RESET`).

---

## Phase 5: Ecosystem Bridges
- [ ] LangChain / LlamaIndex guardrail interceptors.
- [ ] MONAI / 3D Medical Imaging pipeline hooks.
- [ ] ROS2 robot trajectory safety fuse.
