---
name: web-design-guidelines
description: Review UI code for Web Interface Guidelines compliance. Use when asked to "review my UI", "check accessibility", "audit design", "review UX", or "check my site against best practices".
metadata:
  author: vercel
  version: "1.0.0"
  argument-hint: <file-or-pattern>
---

# Web Interface Guidelines

Review files for compliance with Web Interface Guidelines.

## How It Works

1. Fetch fresh guidelines from the remote URL, or use the bundled local fallback if offline or unreachable:
   - Remote: `https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md` (via `read_url_content` or `curl -s`)
   - Local Fallback: `references/guidelines.md` in this skill's directory
2. Read the specified target files (or prompt user for files/pattern)
3. Audit against all rules in the guidelines (tap targets $\ge 44\times 44$px, WCAG AA contrast, keyboard focus rings, layout stability)
4. Output findings in the terse `file:line` format

## Guidelines Source

- **Remote URL**: `https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md`
- **Bundled Fallback**: `references/guidelines.md` (use when network is unavailable or rate-limited)

## Usage

When a user provides a file or pattern argument:
1. Load guidelines (remote or local fallback)
2. Read the specified files
3. Apply all rules from the guidelines
4. Output findings using the `file:line` format

If no files are specified, ask the user which files or UI components to review.
