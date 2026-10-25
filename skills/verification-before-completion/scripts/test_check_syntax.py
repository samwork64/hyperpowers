#!/usr/bin/env python3
"""
Unit tests for check-syntax.py
"""

import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

# Add script directory to sys.path
SCRIPT_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(SCRIPT_DIR))

import importlib.util
spec = importlib.util.spec_from_file_location("check_syntax", SCRIPT_DIR / "check-syntax.py")
check_syntax = importlib.util.module_from_spec(spec)
spec.loader.exec_module(check_syntax)


class TestCheckSyntax(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.TemporaryDirectory()
        self.dir_path = Path(self.temp_dir.name)

    def tearDown(self):
        self.temp_dir.cleanup()

    def test_python_valid(self):
        py_file = self.dir_path / "valid.py"
        py_file.write_text("def add(a, b):\n    return a + b\n")
        err = check_syntax.check_python(py_file)
        self.assertIsNone(err)

    def test_python_syntax_error(self):
        py_file = self.dir_path / "invalid.py"
        py_file.write_text("def broken(:\n    pass\n")
        err = check_syntax.check_python(py_file)
        self.assertIsNotNone(err)
        self.assertIn("SyntaxError", err)

    def test_json_valid(self):
        json_file = self.dir_path / "valid.json"
        json_file.write_text('{"name": "test", "count": 42}')
        err = check_syntax.check_json(json_file)
        self.assertIsNone(err)

    def test_json_trailing_comma_error(self):
        json_file = self.dir_path / "invalid.json"
        json_file.write_text('{"name": "test", "count": 42,}')
        err = check_syntax.check_json(json_file)
        self.assertIsNotNone(err)
        self.assertIn("JSONDecodeError", err)

    def test_shell_valid(self):
        sh_file = self.dir_path / "valid.sh"
        sh_file.write_text("#!/usr/bin/env bash\necho 'hello world'\n")
        err = check_syntax.check_shell(sh_file)
        self.assertIsNone(err)

    def test_shell_syntax_error(self):
        sh_file = self.dir_path / "invalid.sh"
        sh_file.write_text("if [ true ]; then\necho 'missing fi'\n")
        err = check_syntax.check_shell(sh_file)
        self.assertIsNotNone(err)
        self.assertIn("ShellSyntaxError", err)

    def test_cli_exit_code_zero(self):
        py_file = self.dir_path / "good.py"
        py_file.write_text("x = 10\n")
        proc = subprocess.run(
            [sys.executable, str(SCRIPT_DIR / "check-syntax.py"), str(py_file)],
            capture_output=True,
            text=True,
        )
        self.assertEqual(proc.returncode, 0)
        self.assertIn("Syntax and static parsing clean", proc.stdout)

    def test_cli_exit_code_one_on_failure(self):
        py_file = self.dir_path / "bad.py"
        py_file.write_text("def bad(\n")
        proc = subprocess.run(
            [sys.executable, str(SCRIPT_DIR / "check-syntax.py"), str(py_file)],
            capture_output=True,
            text=True,
        )
        self.assertEqual(proc.returncode, 1)
        self.assertIn("SyntaxError", proc.stderr)


if __name__ == "__main__":
    unittest.main()
