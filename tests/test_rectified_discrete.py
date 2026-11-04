"""
Unit tests for the rectified Discrete Gate implementation.
Compatible with both pytest and standard library unittest.
"""

import math
import unittest

try:
    import pytest
except ImportError:
    pytest = None

from alyosha_gate.discrete.rectified import RectifiedDiscreteGate
from alyosha_gate.errors import (
    EmptyInputError,
    InvalidInputError,
    LengthMismatchError,
)
from alyosha_gate.types import (
    DiscreteInput,
    GateDecision,
    GateMode,
    GateReason,
)


class TestRectifiedDiscreteGate(unittest.TestCase):
    """Test suite covering all operational paths of RectifiedDiscreteGate."""

    def test_stable_passage_common_source_and_low_dmod(self):
        """
        Numbers [4, 8, 12] with exponents [3, 3, 3]:
        GCD(4, 8, 12) = 4 > 1 -> source_present = True.
        DMOD = (3 + 3 + 3) / 100 + 0 = 0.09 < 1.0.
        Expected: PASS (STABLE), Reason: SOURCE_IDENTIFIED.
        """
        inp = DiscreteInput(numbers=[4, 8, 12], exponents=[3, 3, 3], threshold=1.0)
        res = RectifiedDiscreteGate.evaluate(inp)

        assert res.is_triggered is False
        assert res.decision == GateDecision.PASS
        assert res.mode == GateMode.RECTIFIED
        assert res.reason == GateReason.SOURCE_IDENTIFIED
        assert res.gcd_value == 4
        assert res.source_present is True
        self.assertAlmostEqual(res.dmod_value, 0.09, places=4)
        assert "STABLE" in res.status_message

    def test_void_when_no_common_source(self):
        """
        Numbers [3, 5, 8] with exponents [3, 3, 3]:
        GCD(3, 5, 8) = 1 <= 1 -> source_present = False.
        DMOD = (3 + 3 + 3) / 100 + 1.0 = 1.09.
        Expected: VOID, Reason: NO_COMMON_SOURCE.
        """
        inp = DiscreteInput(numbers=[3, 5, 8], exponents=[3, 3, 3], threshold=1.0)
        res = RectifiedDiscreteGate.evaluate(inp)

        assert res.is_triggered is True
        assert res.decision == GateDecision.VOID
        assert res.reason == GateReason.NO_COMMON_SOURCE
        assert res.gcd_value == 1
        assert res.source_present is False
        self.assertAlmostEqual(res.dmod_value, 1.09, places=4)
        assert "No common source" in res.status_message

    def test_void_when_dmod_exceeds_threshold(self):
        """
        Numbers [4, 8, 12] with huge exponents [50, 50, 50]:
        GCD = 4 > 1 -> source_present = True.
        DMOD = 150 / 100 + 0 = 1.50 >= threshold 1.0.
        Expected: VOID, Reason: DMOD_THRESHOLD_EXCEEDED.
        """
        inp = DiscreteInput(numbers=[4, 8, 12], exponents=[50, 50, 50], threshold=1.0)
        res = RectifiedDiscreteGate.evaluate(inp)

        assert res.is_triggered is True
        assert res.decision == GateDecision.VOID
        assert res.reason == GateReason.DMOD_THRESHOLD_EXCEEDED
        assert res.gcd_value == 4
        assert res.source_present is True
        self.assertAlmostEqual(res.dmod_value, 1.50, places=4)
        assert "threshold exceeded" in res.status_message

    def test_dmod_exactly_at_threshold_triggers_void(self):
        """
        Boundary condition: DMOD exactly equals threshold.
        Rule: DMOD >= threshold -> VOID.
        Exponents [30, 35, 35] -> sum = 100 -> DMOD = 100/100 = 1.0.
        Threshold = 1.0.
        """
        inp = DiscreteInput(numbers=[6, 12, 18], exponents=[30, 35, 35], threshold=1.0)
        res = RectifiedDiscreteGate.evaluate(inp)

        assert res.is_triggered is True
        assert res.decision == GateDecision.VOID
        assert res.reason == GateReason.DMOD_THRESHOLD_EXCEEDED
        self.assertAlmostEqual(res.dmod_value, 1.0, places=4)

    def test_dmod_just_below_threshold_passes(self):
        """
        Boundary condition: DMOD = 0.99 < 1.0 -> PASS.
        Exponents [33, 33, 33] -> sum = 99 -> DMOD = 0.99.
        """
        inp = DiscreteInput(numbers=[6, 12, 18], exponents=[33, 33, 33], threshold=1.0)
        res = RectifiedDiscreteGate.evaluate(inp)

        assert res.is_triggered is False
        assert res.decision == GateDecision.PASS
        assert res.reason == GateReason.SOURCE_IDENTIFIED
        self.assertAlmostEqual(res.dmod_value, 0.99, places=4)

    def test_exponent_limit_exclusion(self):
        """
        Balu limit check: any exponent <= 2 must trigger VOID immediately.
        Even if numbers share a common factor like [6, 8, 10] (GCD=2).
        Exponents: [2, 3, 3] -> min exponent is 2.
        """
        inp = DiscreteInput(
            numbers=[6, 8, 10],
            exponents=[2, 3, 3],
            threshold=1.0,
            check_exponent_limit=True,
        )
        res = RectifiedDiscreteGate.evaluate(inp)

        assert res.is_triggered is True
        assert res.decision == GateDecision.VOID
        assert res.reason == GateReason.EXPONENT_LIMIT_EXCLUSION
        assert "Exponent limit exclusion triggered" in res.status_message

    def test_exponent_limit_can_be_disabled_via_flag(self):
        """
        If check_exponent_limit=False, exponents <= 2 are evaluated normally by GCD & DMOD.
        """
        inp = DiscreteInput(
            numbers=[6, 8, 10],
            exponents=[2, 2, 2],
            threshold=1.0,
            check_exponent_limit=False,
        )
        res = RectifiedDiscreteGate.evaluate(inp)

        assert res.is_triggered is False
        assert res.decision == GateDecision.PASS
        assert res.reason == GateReason.SOURCE_IDENTIFIED

    def test_empty_input_validation(self):
        """Empty numbers or exponents must raise EmptyInputError."""
        with self.assertRaises(EmptyInputError):
            RectifiedDiscreteGate.evaluate(DiscreteInput(numbers=[], exponents=[]))

        with self.assertRaises(EmptyInputError):
            RectifiedDiscreteGate.evaluate(DiscreteInput(numbers=[2, 4], exponents=[]))

    def test_length_mismatch_validation(self):
        """Numbers and exponents sequences of different lengths must raise LengthMismatchError."""
        with self.assertRaises(LengthMismatchError):
            RectifiedDiscreteGate.evaluate(DiscreteInput(numbers=[2, 4, 6], exponents=[3, 3]))

    def test_non_positive_numbers_validation(self):
        """Non-positive base numbers (0 or negative) must raise InvalidInputError."""
        with self.assertRaises(InvalidInputError):
            RectifiedDiscreteGate.evaluate(DiscreteInput(numbers=[0, 4, 8], exponents=[3, 3, 3]))

        with self.assertRaises(InvalidInputError):
            RectifiedDiscreteGate.evaluate(DiscreteInput(numbers=[-2, 4, 8], exponents=[3, 3, 3]))

    def test_non_positive_exponents_validation(self):
        """Non-positive exponents (0 or negative) must raise InvalidInputError."""
        with self.assertRaises(InvalidInputError):
            RectifiedDiscreteGate.evaluate(DiscreteInput(numbers=[2, 4, 8], exponents=[0, 3, 3]))

    def test_invalid_threshold_validation(self):
        """Non-positive or non-numerical threshold must raise InvalidInputError."""
        with self.assertRaises(InvalidInputError):
            RectifiedDiscreteGate.evaluate(
                DiscreteInput(numbers=[2, 4, 8], exponents=[3, 3, 3], threshold=0.0)
            )

    def test_exponent_limit_consistent_diagnostics(self):
        """
        When exponent limit triggers, real GCD and DMOD diagnostics must still be reported.
        Numbers [6, 8, 10] have GCD=2 and source_present=True.
        """
        inp = DiscreteInput(
            numbers=[6, 8, 10],
            exponents=[2, 3, 3],
            threshold=1.0,
            check_exponent_limit=True,
        )
        res = RectifiedDiscreteGate.evaluate(inp)

        assert res.is_triggered is True
        assert res.decision == GateDecision.VOID
        assert res.reason == GateReason.EXPONENT_LIMIT_EXCLUSION
        assert res.gcd_value == 2
        assert res.source_present is True
        self.assertAlmostEqual(res.dmod_value, 0.08, places=4)
        assert res.metadata["min_exponent"] == 2

    def test_dmod_boundary_slightly_above_threshold_triggers_void(self):
        """
        Boundary condition: DMOD = 1.01 > 1.0 -> VOID.
        Exponents [34, 34, 33] -> sum = 101 -> DMOD = 1.01.
        """
        inp = DiscreteInput(numbers=[6, 12, 18], exponents=[34, 34, 33], threshold=1.0)
        res = RectifiedDiscreteGate.evaluate(inp)

        assert res.is_triggered is True
        assert res.decision == GateDecision.VOID
        assert res.reason == GateReason.DMOD_THRESHOLD_EXCEEDED
        self.assertAlmostEqual(res.dmod_value, 1.01, places=4)

    def test_nan_threshold_raises_invalid_input(self):
        """Threshold float('nan') must raise InvalidInputError."""
        with self.assertRaises(InvalidInputError):
            RectifiedDiscreteGate.evaluate(
                DiscreteInput(numbers=[4, 8, 12], exponents=[3, 3, 3], threshold=float("nan"))
            )

    def test_inf_threshold_raises_invalid_input(self):
        """Threshold float('inf') or -float('inf') must raise InvalidInputError."""
        with self.assertRaises(InvalidInputError):
            RectifiedDiscreteGate.evaluate(
                DiscreteInput(numbers=[4, 8, 12], exponents=[3, 3, 3], threshold=float("inf"))
            )

        with self.assertRaises(InvalidInputError):
            RectifiedDiscreteGate.evaluate(
                DiscreteInput(numbers=[4, 8, 12], exponents=[3, 3, 3], threshold=float("-inf"))
            )

    def test_bool_threshold_raises_invalid_input(self):
        """Threshold passed as boolean must raise InvalidInputError."""
        with self.assertRaises(InvalidInputError):
            RectifiedDiscreteGate.evaluate(
                DiscreteInput(numbers=[4, 8, 12], exponents=[3, 3, 3], threshold=True)
            )

    def test_bool_in_numbers_or_exponents_raises_invalid_input(self):
        """Boolean values inside numbers or exponents must raise InvalidInputError."""
        with self.assertRaises(InvalidInputError):
            RectifiedDiscreteGate.evaluate(
                DiscreteInput(numbers=[True, 4, 8], exponents=[3, 3, 3])
            )

        with self.assertRaises(InvalidInputError):
            RectifiedDiscreteGate.evaluate(
                DiscreteInput(numbers=[4, 8, 12], exponents=[3, False, 3])
            )

    def test_float_in_numbers_or_exponents_raises_invalid_input(self):
        """Float values inside numbers or exponents must raise InvalidInputError."""
        with self.assertRaises(InvalidInputError):
            RectifiedDiscreteGate.evaluate(
                DiscreteInput(numbers=[4.0, 8, 12], exponents=[3, 3, 3])
            )

        with self.assertRaises(InvalidInputError):
            RectifiedDiscreteGate.evaluate(
                DiscreteInput(numbers=[4, 8, 12], exponents=[3, 3.5, 3])
            )

    def test_string_or_bytes_sequence_raises_invalid_input(self):
        """Strings or bytes passed instead of integer lists must raise InvalidInputError."""
        with self.assertRaises(InvalidInputError):
            RectifiedDiscreteGate.evaluate(
                DiscreteInput(numbers="123", exponents=[3, 3, 3])
            )

        with self.assertRaises(InvalidInputError):
            RectifiedDiscreteGate.evaluate(
                DiscreteInput(numbers=[4, 8, 12], exponents=b"\x03\x03\x03")
            )

    def test_input_immutability_caller_side_mutation(self):
        """Mutating the original caller list after passing it to DiscreteInput must not corrupt input."""
        caller_nums = [4, 8, 12]
        caller_exps = [3, 3, 3]

        inp = DiscreteInput(numbers=caller_nums, exponents=caller_exps)
        caller_nums.append(100)
        caller_exps.append(100)

        assert len(inp.numbers) == 3
        assert len(inp.exponents) == 3
        res = RectifiedDiscreteGate.evaluate(inp)
        assert res.decision == GateDecision.PASS
        assert len(res.metadata["numbers"]) == 3

    def test_invalid_mode_in_facade(self):
        """Passing an unsupported mode string to evaluate_discrete_gate must raise InvalidInputError."""
        from alyosha_gate.discrete import evaluate_discrete_gate

        with self.assertRaises(InvalidInputError):
            evaluate_discrete_gate(
                numbers=[4, 8, 12],
                exponents=[3, 3, 3],
                mode="nonexistent_mode",
            )

    def test_deterministic_stability(self):
        """Evaluating identical inputs 10 times in a row must yield identical results."""
        inp = DiscreteInput(numbers=[15, 30, 45, 60], exponents=[3, 4, 5, 6], threshold=1.0)
        results = [RectifiedDiscreteGate.evaluate(inp) for _ in range(10)]

        first = results[0]
        for item in results[1:]:
            assert item.is_triggered == first.is_triggered
            assert item.decision == first.decision
            assert item.reason == first.reason
            assert item.gcd_value == first.gcd_value
            assert item.dmod_value == first.dmod_value

    def test_singleton_input_with_factor_passes(self):
        """
        Singleton inputs (len=1) are permitted as PROJECT_PROPOSAL.
        For numbers=[5], exponents=[3]: GCD(5)=5 > 1 -> source_present=True.
        DMOD = 3/100 = 0.03 < 1.0 -> PASS.
        """
        inp = DiscreteInput(numbers=[5], exponents=[3], threshold=1.0)
        res = RectifiedDiscreteGate.evaluate(inp)

        assert res.is_triggered is False
        assert res.decision == GateDecision.PASS
        assert res.reason == GateReason.SOURCE_IDENTIFIED
        assert res.gcd_value == 5
        assert res.source_present is True
        self.assertAlmostEqual(res.dmod_value, 0.03, places=4)

    def test_singleton_input_with_unit_voids_no_common_source(self):
        """
        Singleton input with unit base: numbers=[1], exponents=[3].
        GCD(1)=1 <= 1 -> source_present=False.
        DMOD = 3/100 + 1.0 = 1.03 -> VOID (NO_COMMON_SOURCE).
        """
        inp = DiscreteInput(numbers=[1], exponents=[3], threshold=1.0)
        res = RectifiedDiscreteGate.evaluate(inp)

        assert res.is_triggered is True
        assert res.decision == GateDecision.VOID
        assert res.reason == GateReason.NO_COMMON_SOURCE
        assert res.gcd_value == 1
        assert res.source_present is False
        self.assertAlmostEqual(res.dmod_value, 1.03, places=4)

    def test_arbitrary_quad_sequence_passes(self):
        """
        Arbitrary sequence length k=4 is permitted (triads are canonical but not exclusive).
        Numbers [6, 12, 18, 24] with exponents [3, 4, 5, 6]:
        GCD(6, 12, 18, 24) = 6 > 1 -> source_present=True.
        DMOD = (3 + 4 + 5 + 6)/100 = 0.18 < 1.0 -> PASS.
        """
        inp = DiscreteInput(numbers=[6, 12, 18, 24], exponents=[3, 4, 5, 6], threshold=1.0)
        res = RectifiedDiscreteGate.evaluate(inp)

        assert res.is_triggered is False
        assert res.decision == GateDecision.PASS
        assert res.reason == GateReason.SOURCE_IDENTIFIED
        assert res.gcd_value == 6
        assert res.source_present is True
        self.assertAlmostEqual(res.dmod_value, 0.18, places=4)

