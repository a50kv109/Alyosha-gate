"""
Types and data contracts for the Alyosha Gate ecosystem.
"""

from dataclasses import dataclass, field
from enum import Enum
from typing import Any, Dict, List, Sequence


class GateMode(str, Enum):
    """Execution mode selector."""
    RECTIFIED = "rectified"
    SOURCE_FAITHFUL = "source_faithful"


class GateDecision(str, Enum):
    """High-level gate decision."""
    PASS = "PASS"
    VOID = "VOID"


class GateReason(str, Enum):
    """
    Machine-readable rationale for gate decision.
    Status: PROJECT_PROPOSAL based on reported AAM-V1 principles.
    """
    SOURCE_IDENTIFIED = "SOURCE_IDENTIFIED"
    NO_COMMON_SOURCE = "NO_COMMON_SOURCE"
    DMOD_THRESHOLD_EXCEEDED = "DMOD_THRESHOLD_EXCEEDED"
    EXPONENT_LIMIT_EXCLUSION = "EXPONENT_LIMIT_EXCLUSION"


@dataclass(frozen=True)
class DiscreteInput:
    """
    Input contract for Discrete Gate verification.
    """
    numbers: Sequence[int]
    exponents: Sequence[int]
    threshold: float = 1.0
    check_exponent_limit: bool = True

    def __post_init__(self) -> None:
        # Defensively freeze sequences into immutable tuples to prevent caller-side mutation
        if not isinstance(self.numbers, (str, bytes, bytearray)) and hasattr(self.numbers, "__iter__"):
            object.__setattr__(self, "numbers", tuple(self.numbers))
        if not isinstance(self.exponents, (str, bytes, bytearray)) and hasattr(self.exponents, "__iter__"):
            object.__setattr__(self, "exponents", tuple(self.exponents))


@dataclass(frozen=True)
class DiscreteGateResult:
    """
    Result container for Discrete Gate verification.
    """
    is_triggered: bool
    decision: GateDecision
    mode: GateMode
    reason: GateReason
    status_message: str
    gcd_value: int
    source_present: bool
    dmod_value: float
    threshold_value: float
    metadata: Dict[str, Any] = field(default_factory=dict)
