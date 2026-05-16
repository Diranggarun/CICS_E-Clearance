# Team Workflow

Rules for keeping 9 developers from overwriting each other.

---

## Git branch structure

main      production-ready, protected, PRs only
  |
  dev       integration branch, all PRs target this
  |
  +-- feat/auth-login-flow          Dimalutang
  +-- feat/payment-receipts         Asraf
  +-- feat/student-dashboard        Norman
  +-- feat/approval-prerequisites   Landia
  +-- ... etc

---

## Branch naming

feat/module-short-description     new features
fix/module-short-description      bug fixes
chore/short-description           non-code changes
refactor/module-short-description internal refactors

Examples:
  feat/auth-account-approval
  fix/payment-receipt-size-check
  chore/update-readme
  refactor/approval-prerequisite-checks

---

## Daily routine

git checkout dev
git pull origin dev
git checkout feat/your-feature    (or create it)
git rebase dev                    (keep branch fresh)

... do work, commit often ...

git add -A
git commit -m "auth: add pending accounts endpoint"
git push origin feat/your-feature

When feature is ready: open PR on GitHub/GitLab targeting dev.

---

## PR rules

1. Always target dev, never main.
2. PR title: module: what changed  (e.g. auth: add account approval endpoint)
3. PR description must include:
   - What changed
   - Which API contract endpoints affected
   - Any DB schema changes (Affhan must review these)
   - Screenshots for frontend changes
4. Reviewers:
   - Module owner reviews their own module PRs
   - Affhan reviews ALL PRs touching database/
   - Norman and Shaheel both review changes to frontend/src/components/shared/
5. Merge only after: 1 approval AND no unresolved comments.
6. Squash on merge to keep dev history clean.

---

## Forbidden

- Pushing directly to main or dev
- Force-pushing to dev or main
- Merging your own PR without a second set of eyes
- Editing database/schema.sql (only Affhan)
- Editing old migration files (only add new ones)
- Changing API_CONTRACT.md without team approval

---

## Merge conflict resolution

git checkout feat/your-feature
git rebase dev

If conflicts appear:
- Open conflicting files in VS Code
- If conflict is in someone else module, ask them before resolving
- git add resolved-files
- git rebase --continue
- git push origin feat/your-feature --force-with-lease

---

## Standup template (daily, 10 minutes max)

Each person answers:
1. What did I do yesterday?
2. What am I doing today?
3. Am I blocked?

Standup is not for problem-solving. Discussions longer than 30 seconds happen after standup.

---

## What to do when your change affects another module

Before making the change:
1. Post in team channel: I need to change X which will affect Y module owned by @owner. OK?
2. Wait for response.
3. If urgent, get verbal agreement and document in DECISIONS.md.

After making the change:
1. Open PR and tag the module owner as required reviewer.
2. Do not merge without their sign-off.

---

## Escalate to tech lead when

- Teammate has not responded in 24 hours and you are blocked
- Two of you disagree on architecture
- API contract needs to change and you cannot get consensus
- Schedule slipping more than 2 days

---

## End of phase checklist

- All PRs for the phase merged to dev
- PROGRESS.md updated
- DECISIONS.md updated with non-trivial choices
- DEBUGGING.md updated with solved bugs
- At least one teammate confirmed the code works locally
