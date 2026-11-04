"""
Test suite verifying ECP contract integrity (AG-ECP-001).
Ensures that machine-readable ECP manifests, JSON schemas, and documentation
stay in strict parity with runtime Python types, enumerations, and repository structure.
"""

import json
import re
import unittest
from pathlib import Path

from alyosha_gate.types import GateDecision, GateMode, GateReason

try:
    import jsonschema
    HAS_JSONSCHEMA = True
except ImportError:
    HAS_JSONSCHEMA = False


class TestECPContractIntegrity(unittest.TestCase):
    """
    Validate that the ECP JSON manifest matches Python runtime enums,
    validates against its JSON Schema, and resolves all referenced files.
    """

    @classmethod
    def setUpClass(cls) -> None:
        # Locate alyosha-gate base directory (repository root for the Python package)
        cls.base_dir = Path(__file__).resolve().parent.parent
        cls.manifest_path = cls.base_dir / "docs" / "ecp_discrete_gate.json"
        cls.schema_path = cls.base_dir / "docs" / "schemas" / "ecp_manifest.schema.json"
        cls.md_path = cls.base_dir / "docs" / "ECP_DISCRETE_GATE.md"
        cls.agent_index_path = cls.base_dir / "AGENT_INDEX.md"
        cls.integration_path = cls.base_dir / "docs" / "AGENT_INTEGRATION.md"
        cls.source_status_path = cls.base_dir / "docs" / "SOURCE_STATUS.md"

    def test_schema_file_is_valid_json_schema(self) -> None:
        """Verify docs/schemas/ecp_manifest.schema.json exists and is a valid JSON Schema."""
        self.assertTrue(self.schema_path.exists(), f"Missing schema at {self.schema_path}")
        with open(self.schema_path, "r", encoding="utf-8") as f:
            schema = json.load(f)

        self.assertEqual(schema.get("$schema"), "https://json-schema.org/draft/2020-12/schema")
        self.assertEqual(schema.get("type"), "object")

        if HAS_JSONSCHEMA:
            # Validates that the schema itself is a compliant Draft 2020-12 schema
            jsonschema.Draft202012Validator.check_schema(schema)

    def test_manifest_validates_against_json_schema(self) -> None:
        """Verify docs/ecp_discrete_gate.json satisfies the manifest schema."""
        self.assertTrue(self.manifest_path.exists(), f"Missing manifest at {self.manifest_path}")
        with open(self.manifest_path, "r", encoding="utf-8") as f:
            manifest = json.load(f)
        with open(self.schema_path, "r", encoding="utf-8") as f:
            schema = json.load(f)

        if HAS_JSONSCHEMA:
            # Full Draft 2020-12 JSON Schema validation
            validator = jsonschema.Draft202012Validator(schema)
            errors = list(validator.iter_errors(manifest))
            self.assertEqual(len(errors), 0, f"Schema validation errors: {[e.message for e in errors]}")
        else:
            # Fallback strict structural verification when jsonschema library is not installed
            for req in schema["required"]:
                self.assertIn(req, manifest, f"Missing required manifest field: {req}")
            self.assertTrue(re.match(r"^AG-ECP-\d{3}$", manifest["id"]))
            self.assertEqual(manifest["type"], "Engineering Constructor Primitive (ECP)")

    def test_manifest_enums_match_python_enums(self) -> None:
        """Verify enum values in manifest precisely match runtime Python enums."""
        with open(self.manifest_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        json_decisions = set(data["interfaces"]["outputs"]["decision"]["enum"])
        py_decisions = {e.value for e in GateDecision}
        self.assertEqual(json_decisions, py_decisions, "GateDecision enum mismatch")

        json_reasons = set(data["interfaces"]["outputs"]["reason"]["enum"])
        py_reasons = {e.value for e in GateReason}
        self.assertEqual(json_reasons, py_reasons, "GateReason enum mismatch")

        json_modes = set(data["interfaces"]["inputs"]["mode"]["enum"])
        py_modes = {e.value for e in GateMode}
        self.assertEqual(json_modes, py_modes, "GateMode enum mismatch")

    def test_repository_root_file_references_resolve(self) -> None:
        """Verify that paths declared in the manifest and catalog resolve from repo root."""
        with open(self.manifest_path, "r", encoding="utf-8") as f:
            manifest = json.load(f)

        # 1. normative_authority declared in manifest
        normative_rel = manifest["normative_authority"]
        normative_file = self.base_dir / normative_rel
        self.assertTrue(normative_file.exists(), f"Path '{normative_rel}' does not resolve from repo root")

        # 2. Key documentation files exist and cite AG-ECP-001
        for file_path in [self.md_path, self.agent_index_path, self.integration_path, self.source_status_path]:
            self.assertTrue(file_path.exists(), f"Missing expected document: {file_path}")
            content = file_path.read_text(encoding="utf-8")
            self.assertIn("AG-ECP-001", content, f"{file_path.name} must reference primitive ID AG-ECP-001")


if __name__ == "__main__":
    unittest.main()
