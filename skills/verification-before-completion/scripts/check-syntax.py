#!/usr/bin/env python3
"""
check-syntax.py - Fast, zero-dependency file-level syntax & static error verification.
Part of the Hyperpowers framework.

Scans modified files (or specified directories) across Python, JavaScript,
JSON, Shell, TOML, and YAML to ensure no files contain syntax or structural errors
before declaring implementation complete.

Usage:
    python3 check-syntax.py                 # Check all modified/uncommitted git files
    python3 check-syntax.py --all           # Check all supported files in current repository
    python3 check-syntax.py path/to/file    # Check specific file(s)
"""

import ast
import json
import os
import shutil
import subprocess
import sys
from pathlib import Path

# Optional parsers
try:
    import tomllib
except ImportError:
    try:
        import tomli as tomllib
    except ImportError:
        tomllib = None

try:
    import yaml
except ImportError:
    yaml = None

IGNORED_DIRS = {
    ".git",
    "node_modules",
    "venv",
    ".venv",
    "env",
    ".env",
    "__pycache__",
    "dist",
    "build",
    ".pytest_cache",
    ".mypy_cache",
    ".ruff_cache",
    "coverage",
    ".next",
    ".nuxt",
    ".turbo",
    ".cache",
}

NODE_BIN = shutil.which("node")
BASH_BIN = shutil.which("bash")


def check_python(path: Path) -> str | None:
    try:
        content = path.read_text(encoding="utf-8")
        ast.parse(content, filename=str(path))
        return None
    except SyntaxError as e:
        return f"{path}:{e.lineno or 1}:{e.offset or 1}: SyntaxError: {e.msg}"
    except UnicodeDecodeError as e:
        return f"{path}: UnicodeDecodeError: {e.reason}"
    except Exception as e:
        return f"{path}: {type(e).__name__}: {e}"


def check_json(path: Path) -> str | None:
    try:
        content = path.read_text(encoding="utf-8")
        json.loads(content)
        return None
    except json.JSONDecodeError as e:
        return f"{path}:{e.lineno}:{e.colno}: JSONDecodeError: {e.msg}"
    except UnicodeDecodeError as e:
        return f"{path}: UnicodeDecodeError: {e.reason}"
    except Exception as e:
        return f"{path}: {type(e).__name__}: {e}"


def check_shell(path: Path) -> str | None:
    if not BASH_BIN:
        return None
    try:
        proc = subprocess.run(
            [BASH_BIN, "-n", str(path)],
            capture_output=True,
            text=True,
            timeout=5,
        )
        if proc.returncode != 0:
            err = proc.stderr.strip() or f"bash -n failed with code {proc.returncode}"
            return f"{path}: ShellSyntaxError: {err}"
        return None
    except Exception as e:
        return f"{path}: ShellCheckError: {e}"


def check_javascript(path: Path) -> str | None:
    if not NODE_BIN:
        return None
    try:
        proc = subprocess.run(
            [NODE_BIN, "--check", str(path)],
            capture_output=True,
            text=True,
            timeout=5,
        )
        if proc.returncode != 0:
            err = proc.stderr.strip().split("\n")[-1] or f"node --check failed with code {proc.returncode}"
            return f"{path}: JavaScriptSyntaxError: {err}"
        return None
    except Exception as e:
        return f"{path}: JavaScriptCheckError: {e}"


def check_toml(path: Path) -> str | None:
    if not tomllib:
        return None
    try:
        content = path.read_text(encoding="utf-8")
        tomllib.loads(content)
        return None
    except Exception as e:
        return f"{path}: TOMLDecodeError: {e}"


def check_yaml(path: Path) -> str | None:
    if not yaml:
        return None
    try:
        content = path.read_text(encoding="utf-8")
        yaml.safe_load(content)
        return None
    except Exception as e:
        return f"{path}: YAMLDecodeError: {e}"


def check_file(path: Path) -> str | None:
    ext = path.suffix.lower()
    if ext == ".py":
        return check_python(path)
    elif ext == ".json":
        return check_json(path)
    elif ext in (".sh", ".bash"):
        return check_shell(path)
    elif ext in (".js", ".cjs", ".mjs"):
        return check_javascript(path)
    elif ext == ".toml":
        return check_toml(path)
    elif ext in (".yml", ".yaml"):
        return check_yaml(path)
    return None


def get_git_modified_files(repo_root: Path) -> list[Path]:
    files: set[Path] = set()
    # 1. Uncommitted and untracked changes
    proc = subprocess.run(
        ["git", "status", "--porcelain"],
        cwd=repo_root,
        capture_output=True,
        text=True,
    )
    if proc.returncode == 0:
        for line in proc.stdout.splitlines():
            line = line.strip()
            if not line:
                continue
            # format is "XY filename" or "XY orig -> new"
            parts = line.split(maxsplit=1)
            if len(parts) == 2:
                raw_path = parts[1]
                if " -> " in raw_path:
                    raw_path = raw_path.split(" -> ")[1]
                p = repo_root / raw_path
                if p.is_file():
                    files.add(p)
                elif p.is_dir():
                    files.update(get_all_repo_files(p))

    # 2. Latest commit delta if working tree is clean
    if not files:
        proc_commit = subprocess.run(
            ["git", "diff", "--name-only", "HEAD~1..HEAD"],
            cwd=repo_root,
            capture_output=True,
            text=True,
        )
        if proc_commit.returncode == 0:
            for line in proc_commit.stdout.splitlines():
                line = line.strip()
                if line:
                    p = repo_root / line
                    if p.is_file():
                        files.add(p)

    return sorted(files)


def get_all_repo_files(target_dir: Path) -> list[Path]:
    files = []
    supported_exts = {".py", ".json", ".sh", ".bash", ".js", ".cjs", ".mjs", ".toml", ".yml", ".yaml"}
    for root, dirs, filenames in os.walk(target_dir):
        # Prune ignored directories
        dirs[:] = [d for d in dirs if d not in IGNORED_DIRS and not d.startswith(".")]
        for f in filenames:
            p = Path(root) / f
            if p.suffix.lower() in supported_exts:
                files.append(p)
    return sorted(files)


def main():
    args = sys.argv[1:]
    target_paths: list[Path] = []
    scan_all = "--all" in args or "-a" in args

    if scan_all:
        args = [a for a in args if a not in ("--all", "-a")]

    if args:
        for a in args:
            p = Path(a)
            if p.is_dir():
                target_paths.extend(get_all_repo_files(p))
            elif p.is_file():
                target_paths.append(p)
    elif scan_all:
        target_paths = get_all_repo_files(Path("."))
    else:
        # Default: check git modified files
        target_paths = get_git_modified_files(Path("."))

    if not target_paths:
        print("[check-syntax] No modified files detected to check.")
        sys.exit(0)

    errors = []
    checked_count = 0

    for path in target_paths:
        ext = path.suffix.lower()
        if ext not in {".py", ".json", ".sh", ".bash", ".js", ".cjs", ".mjs", ".toml", ".yml", ".yaml"}:
            continue
        checked_count += 1
        err = check_file(path)
        if err:
            errors.append(err)

    if errors:
        print(f"[check-syntax] ✖ Found {len(errors)} syntax error(s) across {checked_count} file(s):", file=sys.stderr)
        for err in errors:
            print(f"  • {err}", file=sys.stderr)
        sys.exit(1)

    print(f"[check-syntax] ✔ Syntax and static parsing clean across {checked_count} file(s).")
    sys.exit(0)


if __name__ == "__main__":
    main()
