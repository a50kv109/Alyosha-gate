"""
rectified implementation of Discrete Gate.

STATUS: PROJECT_PROPOSAL (Standard, self-consistent production implementation).
NOT to be cited as an authoritative historical author listing; this is an explicit,
validated software specification for practical integration.
"""

import math
from typing import Sequence

from alyosha_gate.errors import (
    EmptyInputError,
    InvalidInputError,
    LengthMismatchError,
)
from alyosha_gate.types import (
    DiscreteGateResult,
    DiscreteInput,
    GateDecision,
    GateMode,
    GateReason,
)


class RectifiedDiscreteGate:
    """
    Self-contained, deterministic implementation of Discrete Gate (Beal/Balu criteria).

    Invariants (PROJECT_PROPOSAL):
    1. Zero external runtime dependencies (standard library math only).
    2. Explicit input validation (strict types, positive integers, matching lengths).
       Sequences of length k >= 1 are supported (singletons permitted, triads canonical).
    3. Branch priority order: Exponent limit (p <= 2) is evaluated first to filter trivial
       subdomains early, followed by common source (GCD <= 1), then DMOD threshold.
    4. Unambiguous status reasons (EXPONENT_LIMIT_EXCLUSION, NO_COMMON_SOURCE,
       DMOD_THRESHOLD_EXCEEDED, SOURCE_IDENTIFIED).
    5. Deterministic: same inputs always yield identical results.
    """

    @staticmethod
    def validate_inputs(
        numbers: Sequence[int],
        exponents: Sequence[int],
        threshold: float,
    ) -> None:
        """
        Validate preconditions on numerical inputs.
        """
        if isinstance(numbers, (str, bytes, bytearray)) or isinstance(exponents, (str, bytes, bytearray)):
            raise InvalidInputError(
                "Sequences 'numbers' and 'exponents' must be sequences of integers, not strings or bytes."
            )

        if not numbers or not exponents:
            raise EmptyInputError("Sequences 'numbers' and 'exponents' must not be empty.")

        if len(numbers) != len(exponents):
            raise LengthMismatchError(
                f"Length mismatch: len(numbers)={len(numbers)} != len(exponents)={len(exponents)}."
            )

        for idx, num in enumerate(numbers):
            if not isinstance(num, int) or isinstance(num, bool):
                raise InvalidInputError(f"Base number at index {idx} must be an integer, got {type(num).__name__}.")
            if num <= 0:
                raise InvalidInputError(f"Base number at index {idx} must be strictly positive (> 0), got {num}.")

        for idx, exp in enumerate(exponents):
            if not isinstance(exp, int) or isinstance(exp, bool):
                raise InvalidInputError(f"Exponent at index {idx} must be an integer, got {type(exp).__name__}.")
            if exp <= 0:
                raise InvalidInputError(f"Exponent at index {idx} must be strictly positive (>= 1), got {exp}.")

        if isinstance(threshold, bool) or not isinstance(threshold, (int, float)):
            raise InvalidInputError(f"Threshold must be a numerical float, got {type(threshold).__name__}.")
        if math.isnan(threshold) or math.isinf(threshold):
            raise InvalidInputError(f"Threshold must be a finite real number, got {threshold}.")
        if threshold <= 0.0:
            raise InvalidInputError(f"Threshold must be strictly positive (> 0.0), got {threshold}.")

    @classmethod
    def evaluate(cls, gate_input: DiscreteInput) -> DiscreteGateResult:
        """
        Evaluate inputs against the rectified Discrete Gate criteria.
        """
        # Validate raw types first before any coercion
        cls.validate_inputs(gate_input.numbers, gate_input.exponents, gate_input.threshold)

        numbers = tuple(gate_input.numbers)
        exponents = tuple(gate_input.exponents)
        threshold = float(gate_input.threshold)
        check_exponent_limit = bool(gate_input.check_exponent_limit)

        # 1. Source verification via Greatest Common Divisor
        common_gcd = math.gcd(*numbers)
        source_present = common_gcd > 1

        # 2. DMOD chaos calculation
        sum_exp = sum(exponents)
        tamas_penalty = 0.0 if source_present else 1.0
        dmod = round((sum_exp / 100.0) + tamas_penalty, 10)

        # 3. Balu Exponent Limit Exclusion (p <= 2)
        if check_exponent_limit and any(p <= 2 for p in exponents):
            min_exp = min(exponents)
            return DiscreteGateResult(
                is_triggered=True,
                decision=GateDecision.VOID,
                mode=GateMode.RECTIFIED,
                reason=GateReason.EXPONENT_LIMIT_EXCLUSION,
                status_message=(
                    f"VOID: Exponent limit exclusion triggered (min exponent {min_exp} <= 2, "
                    "outside Beal non-trivial domain)."
                ),
                gcd_value=common_gcd,
                source_present=source_present,
                dmod_value=dmod,
                threshold_value=threshold,
                metadata={
                    "min_exponent": min_exp,
                    "exponents": exponents,
                    "numbers": numbers,
                    "sum_exponents": sum_exp,
                },
            )

        # 4. Trigger condition: No Common Source
        if not source_present:
            return DiscreteGateResult(
                is_triggered=True,
                decision=GateDecision.VOID,
                mode=GateMode.RECTIFIED,
                reason=GateReason.NO_COMMON_SOURCE,
                status_message=f"VOID: No common source detected (GCD={common_gcd} <= 1).",
                gcd_value=common_gcd,
                source_present=False,
                dmod_value=dmod,
                threshold_value=threshold,
                metadata={
                    "numbers": numbers,
                    "exponents": exponents,
                    "sum_exponents": sum_exp,
                },
            )

        # 5. Trigger condition: DMOD chaos threshold exceeded
        if dmod >= threshold:
            return DiscreteGateResult(
                is_triggered=True,
                decision=GateDecision.VOID,
                mode=GateMode.RECTIFIED,
                reason=GateReason.DMOD_THRESHOLD_EXCEEDED,
                status_message=(
                    f"VOID: DMOD chaos threshold exceeded ({dmod:.4f} >= threshold {threshold:.4f})."
                ),
                gcd_value=common_gcd,
                source_present=True,
                dmod_value=dmod,
                threshold_value=threshold,
                metadata={
                    "numbers": numbers,
                    "exponents": exponents,
                    "sum_exponents": sum_exp,
                },
            )

        # 6. Stable passage
        return DiscreteGateResult(
            is_triggered=False,
            decision=GateDecision.PASS,
            mode=GateMode.RECTIFIED,
            reason=GateReason.SOURCE_IDENTIFIED,
            status_message=(
                f"STABLE: Common source identified (GCD={common_gcd}), "
                f"DMOD={dmod:.4f} < {threshold:.4f}."
            ),
            gcd_value=common_gcd,
            source_present=True,
            dmod_value=dmod,
            threshold_value=threshold,
            metadata={
                "numbers": numbers,
                "exponents": exponents,
                "sum_exponents": sum_exp,
            },
        )
