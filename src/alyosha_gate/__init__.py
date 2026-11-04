"""
Alyosha Gate — Deterministic Safety Gate and Residual Verification Toolkit (AAM-V1 Ecosystem).

Phase 1: Discrete Gate.
MCRG and Telemetry Monitor modules are roadmapped for future phases.
"""

from alyosha_gate.discrete import (
    RectifiedDiscreteGate,
    SourceFaithfulDiscreteGate,
    evaluate_discrete_gate,
)
from alyosha_gate.errors import (
    AlyoshaGateError,
    EmptyInputError,
    InvalidInputError,
    LengthMismatchError,
    SourceListingRequired,
)
from alyosha_gate.types import (
    DiscreteGateResult,
    DiscreteInput,
    GateDecision,
    GateMode,
    GateReason,
)

__version__ = "0.1.0-alpha.1"

__all__ = [
    # Top-level functions
    "evaluate_discrete_gate",
    # Gate implementations
    "RectifiedDiscreteGate",
    "SourceFaithfulDiscreteGate",
    # Types & contracts
    "DiscreteInput",
    "DiscreteGateResult",
    "GateMode",
    "GateDecision",
    "GateReason",
    # Errors
    "AlyoshaGateError",
    "SourceListingRequired",
    "InvalidInputError",
    "LengthMismatchError",
    "EmptyInputError",
]
