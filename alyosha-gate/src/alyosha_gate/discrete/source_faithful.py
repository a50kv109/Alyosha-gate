"""
source_faithful implementation of Discrete Gate (Reserved/Blocked).

STATUS: BLOCKED (Awaiting primary source listing).
SCIENTIFIC INTEGRITY RULE:
No guesses, heuristics, or reverse-engineered mocks are permitted in this module.
When the exact primary source listing is provided, it will be placed here verbatim.
"""

from alyosha_gate.errors import SourceListingRequired
from alyosha_gate.types import DiscreteGateResult, DiscreteInput


class SourceFaithfulDiscreteGate:
    """
    Placeholder/guard for source_faithful Discrete Gate.
    Unconditionally raises SourceListingRequired until authoritative listing is provided.
    """

    @classmethod
    def evaluate(cls, gate_input: DiscreteInput) -> DiscreteGateResult:
        """
        Attempting evaluation raises SourceListingRequired.
        """
        raise SourceListingRequired(
            component_name="SourceFaithfulDiscreteGate",
            message=(
                "Cannot evaluate in 'source_faithful' mode: Primary source listing "
                "from Zenodo 18759741 (Appendix A) / 18783390 has not been provided. "
                "To prevent academic drift, this implementation remains blocked. "
                "Please use RectifiedDiscreteGate (mode='rectified') instead."
            ),
        )
