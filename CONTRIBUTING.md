# Contributing to CICS E-Clearance

Welcome! This document describes how our team collaborates on this repository.

## Branch structure

```
main           Production-ready code. Protected. Merges only via PR.
develop        Integration branch. All feature branches merge here first.
feature/*      New features and enhancements.
bugfix/*       Non-urgent bug fixes.
hotfix/*       Urgent production fixes (branched from main).
```

## Branch naming

Use lowercase, hyphen-separated names:

- `feature/<your-name>/<short-task>` — e.g., `feature/hussien/clearance-form`
- `bugfix/<your-name>/<short-task>` — e.g., `bugfix/diran/login-redirect`
- `hotfix/<short-task>` — e.g., `hotfix/auth-token-expiry`

## Workflow for a new feature

1. **Sync with develop**
   ```bash
   git checkout develop
   git pull
   ```

2. **Create your branch**
   ```bash
   git checkout -b feature/yourname/short-task
   ```

3. **Commit your work**

   Use [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` new feature
   - `fix:` bug fix
   - `chore:` tooling, deps, config
   - `docs:` documentation only
   - `refactor:` code change without behavior change
   - `test:` adding or updating tests

   ```bash
   git add <files>
   git commit -m "feat(clearance): add student form validation"
   ```

4. **Push and open a Pull Request**
   ```bash
   git push -u origin feature/yourname/short-task
   ```
   On GitHub, open a PR with **base: `develop`**, **compare: your branch**.

5. **After review and approval**, the PR is squash-merged into `develop`.

## Release flow

`feature/*` → PR into `develop` → tested on `develop` → PR `develop` into `main` for release.

## Hotfix flow (urgent only)

1. Branch from `main`: `git checkout -b hotfix/<task> main`
2. Fix, commit, push, open PR into `main`.
3. After merge, also merge `main` back into `develop` to keep them in sync.

## Pull request rules

- Keep PRs focused and small when possible.
- Fill out the PR description: what changed, why, and how to test.
- At least **one approval** is required before merging.
- All status checks must pass.
- Resolve all review comments before merging.
- Do not force-push to `main` or `develop`.

## Local hygiene

- Pull `develop` before starting new work.
- Rebase or merge `develop` into your feature branch if it falls behind.
- Delete your branch (locally and on GitHub) after the PR is merged:
  ```bash
  git branch -d feature/yourname/short-task
  git push origin --delete feature/yourname/short-task
  ```

## Code review etiquette

- Review within one business day when possible.
- Be specific and kind — comment on code, not the author.
- Use "suggestion" blocks for small fixes the author can apply with one click.
- Approve only when you would be comfortable shipping the change.

## Questions

Ping the team lead in your usual channel before making changes that affect:
- Database schema or migrations
- Authentication or authorization
- Shared API contracts between frontend and backend
- CI/CD or deployment configuration
