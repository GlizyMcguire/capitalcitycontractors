---
type: "always_apply"
---

# RULES.md — Guardrails for Code-Editing Agents

> **Purpose**: Keep changes *scoped, safe, and reviewable*. Prevent the agent from “fixing three things when asked to fix one.”

---

## 0) TL;DR (Pin This)

* **Touch only what’s in scope.** No drive‑by edits or refactors.
* **One concern per PR.** If you discover other issues, list them in the PR as follow‑ups — do not change them.
* **Make the smallest change that passes tests.**
* **Show diffs and explain *why* each hunk is needed.**
* **Never change dependencies, build config, or formatting outside the edited lines unless explicitly allowed.**

---

## 1) Task Envelope

Define a *strict envelope* for every task. The agent **must** stay inside it.

```yaml
# task-envelope.yaml (example the agent must honor)
intent: "Fix bug where clicking 'Save' double-submits when network is slow"
allowed_paths:
  - src/components/Form/**
  - src/hooks/useSubmit.ts
forbidden_paths:
  - node_modules/**
  - package*.json
  - src/theme/**
  - src/**/*.test.*   # tests may be added alongside, but not edited unless failing
allowed_operations:
  - edit_existing_code
  - add_unit_tests
  - add_small_util_in_allowed_paths
forbidden_operations:
  - rename/move files
  - broad refactors
  - formatting entire files
  - dependency changes
change_budget:
  max_files: 4
  max_hunks_per_file: 4
  max_added_lines_total: 120
requires_user_confirmation_if_exceeded: true
```

**Rule**: If the requested change requires going outside the envelope, the agent must **stop** and request confirmation with rationale and proposed minimal diff.

---

## 2) Scope Fences & Non-Interference

* **Do not edit unrelated code** (including exports, props, signatures, context providers) unless the change is *directly required* to satisfy the task intent.
* **No opportunistic fixes** (typos, “improvements”, renames, style nits) unless explicitly in scope.
* **No cascade refactors** (renaming symbols across the repo, changing APIs) without an explicit refactor ticket.
* **No dependency changes** (including lockfiles) unless the task explicitly says so.
* **No configuration changes** (TS config, ESLint, Prettier, Babel, Vite/Webpack) unless explicitly authorized.
* **Do not change global styles/themes** unless the task is about them.
* **Avoid changing public interfaces**. If absolutely necessary, propose the interface change in the PR description and wait for sign‑off.

---

## 3) Safety Checks Before and After

**Before editing:**

1. Run existing tests and lints. Capture baseline status.
2. Read the relevant files *only* (keep context window focused). Note exported APIs.
3. Identify minimal insertion points (guard against side effects).

**After editing:**

1. Run tests and lints again. New failures outside scope → **revert and reassess**.
2. Self-review with the checklist (below). Ensure no unrelated snapshots/golden files changed.
3. Generate a *scoped* diff summary (map edits to intent).

---

## 4) Minimal-Change Principle

* Prefer **local fixes** over cross-cutting changes.
* Prefer **composition** over mutation of shared utilities.
* Prefer a **feature flag** or **opt-in prop** rather than changing defaults that other features use.
* Keep functions **pure** where possible; avoid global state changes.

---

## 5) Tests & Repro

* If a bug is addressed: **add a failing test first**, then fix code to make it pass.
* Tests must be **narrow-scope** and colocated with the changed module (unless project conventions say otherwise).
* Do **not** rewrite unrelated tests or enlarge snapshot coverage.
* If the fix touches UI timing or async behavior, include a test proving no double effects (e.g., click debounce, idempotent handlers).

**Template (Jest/RTL)**

```ts
it("prevents double-submit when network is slow", async () => {
  // arrange
  // act: click Save twice quickly
  // assert: handler called once; button disabled while pending
});
```

---

## 6) Performance & Accessibility Budgets

* No new renders > **+1 extra render** on critical paths (React) without approval.
* Avoid synchronous heavy work on the main thread; schedule with `requestIdleCallback` or split with dynamic import.
* **A11y**: No regressions to `aria-*`, focus management, or keyboard nav. Add tests if you modify interactive elements.

---

## 7) Logging & Telemetry

* No verbose logging in production builds.
* Do not change log formats or event names unless part of the task.
* Guard debug logs behind `process.env.NODE_ENV !== 'production'` or project logger flags.

---

## 8) Security & Privacy

* Never log secrets, tokens, or PII.
* Don’t modify auth flows, CSP, CORS, or cookie flags unless explicitly in scope.
* Keep third‑party scripts & SDK versions unchanged unless authorized.

---

## 9) Styling & Formatting

* Run formatter **only on edited hunks** (respect `.prettierignore`).
* Do not reorder imports globally or apply project‑wide style changes.
* CSS/Design tokens: only touch tokens/components **inside** the envelope.

---

## 10) Commit & PR Hygiene

**Commit message template**

```
<scope>: <one-line intent>

Why: <bug/goal, issue link>
How (minimal): <key changes>
Risk: <blast radius, mitigations>
Testing: <tests added/updated, manual steps>
```

**PR description template**

```
## Intent
Fix X without affecting Y and Z.

## Scope Envelope
- Paths: <list>
- Forbidden: <list>
- Change budget: <numbers>

## Diffs (per file)
- <file>: <why this hunk is necessary>

## Out-of-Scope Findings
- [ ] Issue: <title/summary> (file/line) → filed as follow-up #123

## Verification
- [ ] Unit tests added/updated
- [ ] No unrelated snapshots changed
- [ ] Lint/Typecheck clean
- [ ] Manual QA steps documented
```

---

## 11) Auto-Abort & Escalation Rules

The agent must **abort and request guidance** when encountering any of the following:

* Change budget would be exceeded.
* Required edits fall outside `allowed_paths`.
* A failing test appears outside of the touched modules.
* The fix would break a public API or change default behavior.
* A dependency or config change seems necessary.

When aborting, output: *cause*, *proposed minimal diff*, and *questions*.

---

## 12) Patterns to Prefer

* **Guarded events**: prevent double‑actions (disable button while pending, ignore while `inFlight`).
* **Idempotent handlers**: ensure multiple calls have same effect.
* **Stable refs**: avoid re‑creating callbacks unnecessarily.
* **Feature flags**: introduce new behavior behind flags when risk is uncertain.

---

## 13) Patterns to Avoid

* Silent catch‑alls or swallowing errors.
* Increasing component surface area (new props) without docs.
* Mutating shared utilities to satisfy a local edge case.
* Changing function signatures used widely.

---

## 14) Lint, Types, and CI Rules

* No merging with type errors or ESLint errors.
* No `// @ts-ignore` unless explained and linked to a follow-up issue.
* Snapshots must be reviewed — if they change beyond the touched component, revert or split.

---

## 15) Example: “Fix 1 without creating 3”

**Scenario**: Button double-submits.

**Allowed**

* Add `isSubmitting` state in the button’s local component.
* Disable button while pending.
* Debounce click handler *for that button only*.

**Not Allowed**

* Refactor the entire form library.
* Rename `onSubmit` to `handleSubmit` across repo.
* Update `react` or `react-hook-form` versions.
* Reformat unrelated files.

---

## 16) Checklist (Agent Must Tick All)

* [ ] Changes confined to `allowed_paths`.
* [ ] No forbidden operations performed.
* [ ] Smallest diff that passes tests.
* [ ] New/updated tests cover the intent.
* [ ] No dep/config/style drift.
* [ ] PR describes each hunk’s necessity.
* [ ] Out-of-scope issues listed, not fixed.

---

## 17) Config Hooks (Optional)

You can enforce these in tooling:

**.editorconfig / Prettier** — limit formatting to staged hunks with `lint-staged`:

```json
{
  "lint-staged": {
    "src/**/*.{ts,tsx,js,jsx,css,scss}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

**Husky pre-commit** — block forbidden paths:

```bash
#!/usr/bin/env bash
for f in $(git diff --cached --name-only); do
  if [[ $f == package.json || $f == package-lock.json || $f == yarn.lock ]]; then
    echo "Blocked: dependency changes are not allowed by RULES.md"; exit 1;
  fi
done
```

**DangerJS** — enforce envelope & budget in CI:

```ts
// dangerfile.ts
import { danger, fail, warn } from 'danger';
const MAX_FILES = 4; const MAX_LINES = 120;
const changed = danger.git.modified_files.concat(danger.git.created_files);
if (changed.length > MAX_FILES) fail(`Too many files changed: ${changed.length} > ${MAX_FILES}`);
// Add path allowlist / denylist checks here.
```

---

## 18) Acknowledge & Evolve

This file is a living contract. If the agent frequently requests broader scope, prefer **splitting work** into explicit tickets with their own `task-envelope.yaml` rather than loosening these guardrails.
