"""
Basic usage example for the `alyosha-gate` Python library (Discrete Gate).
"""

import sys
from pathlib import Path

# Add src to sys.path so the example works out-of-the-box in standalone check
src_path = Path(__file__).resolve().parent.parent / "src"
if str(src_path) not in sys.path:
    sys.path.insert(0, str(src_path))

from alyosha_gate import (
    evaluate_discrete_gate,
    GateDecision,
    GateMode,
    GateReason,
    SourceListingRequired,
)


def run_example():
    print("=== Alyosha Gate (Discrete Gate) — Usage Demonstration ===\n")

    # Case 1: Stable Branch (Valid common source, low DMOD)
    print("--- 1. Evaluating Stable Case [4, 8, 12]^3 ---")
    res1 = evaluate_discrete_gate(
        numbers=[4, 8, 12],
        exponents=[3, 3, 3],
        threshold=1.0,
        mode=GateMode.RECTIFIED,
    )
    print(f"Decision: {res1.decision.value}")
    print(f"Reason:   {res1.reason.value}")
    print(f"Status:   {res1.status_message}")
    print(f"GCD:      {res1.gcd_value}, DMOD: {res1.dmod_value:.4f}")
    assert res1.decision == GateDecision.PASS
    print("-> Result: PASS (Allowed to continue)\n")

    # Case 2: No Common Source (gcd <= 1)
    print("--- 2. Evaluating Void Case (No Common Root) [3, 5, 8]^3 ---")
    res2 = evaluate_discrete_gate(
        numbers=[3, 5, 8],
        exponents=[3, 3, 3],
        threshold=1.0,
        mode=GateMode.RECTIFIED,
    )
    print(f"Decision: {res2.decision.value}")
    print(f"Reason:   {res2.reason.value}")
    print(f"Status:   {res2.status_message}")
    print(f"GCD:      {res2.gcd_value}, DMOD: {res2.dmod_value:.4f}")
    assert res2.decision == GateDecision.VOID
    print("-> Result: VOID (Branch intercepted / annihilated)\n")

    # Case 3: Exponent Limit Exclusion (p <= 2)
    print("--- 3. Evaluating Exponent Limit Case [6, 8, 10] with exponents [2, 3, 3] ---")
    res3 = evaluate_discrete_gate(
        numbers=[6, 8, 10],
        exponents=[2, 3, 3],
        threshold=1.0,
        mode=GateMode.RECTIFIED,
        check_exponent_limit=True,
    )
    print(f"Decision: {res3.decision.value}")
    print(f"Reason:   {res3.reason.value}")
    print(f"Status:   {res3.status_message}")
    assert res3.decision == GateDecision.VOID
    assert res3.reason == GateReason.EXPONENT_LIMIT_EXCLUSION
    print("-> Result: VOID (Excluded by exponent <= 2 rule)\n")

    # Case 4: Calling source_faithful mode (Scientific Guard)
    print("--- 4. Calling source_faithful mode without primary listing ---")
    try:
        evaluate_discrete_gate(
            numbers=[4, 8, 12],
            exponents=[3, 3, 3],
            mode=GateMode.SOURCE_FAITHFUL,
        )
    except SourceListingRequired as err:
        print(f"Caught expected guard: {type(err).__name__}")
        print(f"Message: {err}")
        print("-> Result: Safely blocked to protect academic integrity.\n")

    print("All demonstrations executed successfully.")


if __name__ == "__main__":
    run_example()
