"""
Tests verifying that source_faithful mode refuses to run without authoritative primary listing.
Compatible with both pytest and standard library unittest.
"""

import unittest

from alyosha_gate.discrete.source_faithful import SourceFaithfulDiscreteGate
from alyosha_gate.discrete import evaluate_discrete_gate
from alyosha_gate.errors import SourceListingRequired
from alyosha_gate.types import DiscreteInput, GateMode


class TestSourceFaithfulPlaceholder(unittest.TestCase):
    """
    Scientific Integrity Test:
    Ensures the library does not counterfeit an 'authoritative' implementation
    before the authentic source listing is attached.
    """

    def test_direct_class_call_raises_source_listing_required(self):
        """Direct call to SourceFaithfulDiscreteGate must raise SourceListingRequired."""
        inp = DiscreteInput(numbers=[4, 8, 12], exponents=[3, 3, 3])
        with self.assertRaises(SourceListingRequired) as ctx:
            SourceFaithfulDiscreteGate.evaluate(inp)

        err_msg = str(ctx.exception)
        assert "source_faithful" in err_msg
        assert "Primary source listing" in err_msg or "Zenodo" in err_msg

    def test_facade_function_call_raises_source_listing_required(self):
        """Calling evaluate_discrete_gate with mode='source_faithful' must raise SourceListingRequired."""
        with self.assertRaises(SourceListingRequired):
            evaluate_discrete_gate(
                numbers=[4, 8, 12],
                exponents=[3, 3, 3],
                mode=GateMode.SOURCE_FAITHFUL,
            )

        with self.assertRaises(SourceListingRequired):
            evaluate_discrete_gate(
                numbers=[4, 8, 12],
                exponents=[3, 3, 3],
                mode="source_faithful",
            )
