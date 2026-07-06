---
name: pr-summary
description: Generate PR summary and approach sections. Use when asked to create a PR description, write a PR summary, draft pull request content, or when the user wants purpose and approach text for the current branch.
---

# PR Summary

Generate a **Purpose** (1–3 sentences) and **Approach** (max 8 bullet points) for the current branch.

## Workflow

1. Inspect the current branch:
   - Prefer **commit messages** if they clearly describe the work
   - If commits are unclear (e.g. "fix", "wip") or not relevant, derive from **code changes** (diff vs base branch)

2. **Purpose**: 1–3 sentences in plain English describing why this branch exists and what it achieves for the end-user.

3. **Approach**: Only show this section when a diff on a branch on large or rather complex. Max 8 (but as few as possible to describe the general approach) bullet points describing broadly how it was done. Plain, simple, chronological. Don't say "Added the set-clean-to-unattended planning action in data-access, including API client, types, and toggle slice wiring" but "Added the set-clean-to-unattended planning action". The details can be seen in the diff. Examples:
   - Added endpoint
   - Added mocks
   - Added tests

## Output Format

No preamble or extra sections. Just Purpose and Approach.
Return exactly in this format:

**Purpose:**
[2–3 sentences in plain English]

**Approach:**

- [Bullet 1]
- [Bullet 2]
- [Bullet 3]
  ...
