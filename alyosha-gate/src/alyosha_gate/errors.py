"""
Custom exceptions for the Alyosha Gate package.
"""


class AlyoshaGateError(Exception):
    """Base exception for all errors raised by alyosha-gate."""
    pass


class SourceListingRequired(AlyoshaGateError):
    """
    Raised when attempting to execute the `source_faithful` mode
    without providing an authoritative, primary source code listing.

    Scientific Integrity Invariant:
    We do NOT reconstruct legacy/authoritative code from summaries or hearsay.
    A verifiable, authoritative primary artifact (e.g., specific Zenodo preprint appendix)
    must be attached and verified first.
    """
    def __init__(
        self,
        component_name: str = "DiscreteGate",
        message: str = (
            "Execution blocked: 'source_faithful' mode strictly requires an authentic, "
            "authoritative source code listing (e.g., from Zenodo 18759741 / 18783390 Appendix). "
            "Reconstruction from second-hand reports is disallowed to preserve scientific integrity. "
            "Use mode='rectified' for the validated practical implementation."
        ),
    ):
        self.component_name = component_name
        super().__init__(message)


class InvalidInputError(AlyoshaGateError, ValueError):
    """Raised when input parameters fail structural or mathematical preconditions."""
    pass


class LengthMismatchError(InvalidInputError):
    """Raised when the length of numbers does not match the length of exponents."""
    pass


class EmptyInputError(InvalidInputError):
    """Raised when numbers or exponents sequence is empty."""
    pass
