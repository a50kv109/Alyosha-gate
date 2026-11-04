"""
Discrete Gate subpackage (Zero-Cycle Symbolic Filter).
"""

from typing import Sequence

from alyosha_gate.discrete.rectified import RectifiedDiscreteGate
from alyosha_gate.discrete.source_faithful import SourceFaithfulDiscreteGate
from alyosha_gate.errors import InvalidInputError, SourceListingRequired
from alyosha_gate.types import (
    DiscreteGateResult,
    DiscreteInput,
    GateMode,
)


def evaluate_discrete_gate(
    numbers: Sequence[int],
    exponents: Sequence[int],
    threshold: float = 1.0,
    mode: GateMode | str = GateMode.RECTIFIED,
    check_exponent_limit: bool = True,
) -> DiscreteGateResult:
    """
    Unified entry point for evaluating the Discrete Gate.

    Args:
        numbers: Sequence of positive base integers (e.g. [A, B, C]).
        exponents: Sequence of positive exponents (e.g. [x, y, z]).
        threshold: DMOD chaos threshold (default 1.0).
        mode: GateMode.RECTIFIED (production) or GateMode.SOURCE_FAITHFUL (historical).
        check_exponent_limit: Whether to enforce Balu exponent limit (p <= 2 -> VOID).

    Returns:
        DiscreteGateResult with decision, reason, values, and status message.

    Raises:
        SourceListingRequired: If mode='source_faithful' is requested before primary listing is provided.
        InvalidInputError: If inputs violate structural or numerical preconditions.
    """
    try:
        mode_enum = GateMode(mode) if isinstance(mode, str) else mode
    except ValueError:
        raise InvalidInputError(
            f"Unsupported GateMode: {mode!r}. Must be GateMode.RECTIFIED or GateMode.SOURCE_FAITHFUL."
        )

    gate_input = DiscreteInput(
        numbers=numbers,
        exponents=exponents,
        threshold=threshold,
        check_exponent_limit=check_exponent_limit,
    )

    if mode_enum == GateMode.SOURCE_FAITHFUL:
        return SourceFaithfulDiscreteGate.evaluate(gate_input)
    elif mode_enum == GateMode.RECTIFIED:
        return RectifiedDiscreteGate.evaluate(gate_input)
    else:
        raise InvalidInputError(f"Unsupported GateMode: {mode!r}")


__all__ = [
    "RectifiedDiscreteGate",
    "SourceFaithfulDiscreteGate",
    "evaluate_discrete_gate",
]
