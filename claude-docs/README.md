# claude-docs/

Planning and reference documentation for the CICS E-Clearance project.
Used by Claude Code for persistent context across sessions.

Nothing in this folder is executed, imported, or part of the build.

## Files

| File | Purpose | Owner |
|---|---|---|
| PROMPTS.md | 17-phase build spec | Tech lead |
| PROGRESS.md | Per-module checklist | All devs (update your row) |
| AUDIT.md | Snapshot of existing code | Run audit prompt to refresh |
| MODULES.md | Scope and contracts per module | Module owners |
| API_CONTRACT.md | Agreed endpoint shapes | All backend devs (consensus to change) |
| ERD.md | 13-table database schema | Affhan |
| DECISIONS.md | Project decisions log | All |
| DEBUGGING.md | Known errors and fixes | All |
| WORKFLOW.md | Git rules and PR process | Tech lead |

## Safe to delete

Deleting this folder and root CLAUDE.md restores the project to its original state.
No source code depends on either file.

## Multi-developer rules

- Never modify another developer s module without asking the owner.
- Never change API_CONTRACT.md without team consensus.
- Always pull from dev before starting work.
- Announce changes to shared files in the team channel.
