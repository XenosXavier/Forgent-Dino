# Dino - Claude Development Handbook

## Project Overview

**Tech Stack**: TypeScript 5.3 (Strict) + Vite 5.x + Vitest + ESLint/Prettier
**Architecture**: ECS (Entity Component System)
**Tools**: [GitHub](https://github.com/XenosXavier/Forgent-Dino) · [ClickUp](https://app.clickup.com/901810111459/home) · [GitHub Pages](https://xenosxavier.github.io/Forgent-Dino/)
**Docs**: [GDD/TDD](https://app.clickup.com/901810111459/docs) · [Tasks](https://app.clickup.com/901810111459/v/li/901816875197)
**Constraints**: Zero external libs · TypeScript Strict · Canvas 600×150px

---

## Environment Setup

**Node.js**: 20.x LTS (`node -v`)
**Git Remote**: SSH (`git remote set-url origin git@github.com:XenosXavier/Forgent-Dino.git`)
**Dependencies**: `npm install` → `npm run type-check` to verify

---

## Development Workflow

**1. Get Task** → Change status to "In Development"
**2. Create Branch** → `git checkout -b feat/{name} dev` (kebab-case, no version)
**3. Develop** → Implement Acceptance Criteria + Tests (>90%) + Verify quality
**4. Commit** → `type(scope): description` + `Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>`
**5. Create PR** → Change status to "In Review" → base: dev
**6. Review & Merge** → merge method: merge → Delete local/remote branch
**7. Update Task** → Add PR link → Change status to "SHIPPED" → `git pull origin dev`

---

## Git Standards

**Branch Structure**: `main → release → dev → feat/*`
**Naming**: `feat/{feature-name}` (kebab-case, e.g., `feat/project-init`)
**Commit**: `type(scope): description\n\n- Changes\n\nCo-Authored-By: ...`
**Type**: feat/fix/refactor/test/chore/docs
**PR**: base: dev · merge method: merge · Include Summary/Changes/Testing/Task link
**Forbidden**: Direct merge · Version in branch/commit · HTTPS remote · Keep merged branch

---

## Code Standards

**TypeScript**: Strict Mode · Explicit types · No `any` (use `unknown`)
**ECS**: Entity (ID+Components) · Component (data only) · System (logic only)
**Naming**: Classes `PascalCase` · Functions `camelCase` · Constants `UPPER_SNAKE_CASE` · Files `camelCase.ts`
**Testing**: Coverage >90% · Unit + Integration tests
**Quality**: `npm run lint/format/type-check` must pass

---

## ClickUp Integration

**Status Flow**: `BACKLOG → In Development → In Review → SHIPPED`
**Update Timing**: Step 1 dev · Step 5 create PR · Step 7 done
**PR Link**: Add to Task description bottom: `## 📎 Pull Request\n**PR #X**: [title](url)\n**Status**: ✅ Merged to dev`
**Estimation**: Binary split (controllable=accurate time · uncontrollable=continue splitting or use experience/discussion time)

---

## Version Management

**Format**: Semantic Versioning (x.y.z)
**Usage**: Git Tag only (`git tag v0.1.0 -m "..."` → `git push origin v0.1.0`)
**Forbidden**: Version in branch name/commit message
**Release**: dev→release (PR) → tag → GitHub Release → release→main (PR)
**Release Description**: Feature scope (ref TDD Version List)

---

## Performance & Testing

**Performance**: 60 FPS (<16.67ms/frame) · Load <1s · Memory <50MB
**Unit Tests**: All Component/System/Entity logic
**Integration Tests**: System collaboration · Game loop · Canvas rendering
**Scenario Tests**: New features from this Task + Existing features regression (ref Acceptance Criteria)
**Execute**: `npm run test` · `npm run test:coverage` · `npm run dev` (manual)

---

## Common Commands

**Dev**: `npm run dev/build/preview`
**Test**: `npm run test` · `npm run test:coverage` · `npm run test -- <file>`
**Quality**: `npm run lint/format/type-check`
**Git**: `git checkout -b feat/{name} dev` · `git push -u origin feat/{name}` · `git branch -d feat/{name}` · `git push origin --delete feat/{name}` · `git pull origin dev`

---

## Warnings & Gotchas

**Git**: ❌ Create dev from main · Version in branch/commit · HTTPS · Forget delete/sync · Direct merge ✅ main→release→dev→feat · SSH · PR · Delete+sync immediately
**TypeScript**: ❌ any · Implicit types ✅ unknown · Explicit types+return values
**ClickUp**: ❌ "done"/"complete" ✅ "In Development"/"In Review"/"SHIPPED" · Forget update status/add PR link
**ECS**: ❌ Component has logic · System keeps state ✅ Component data only · System stateless
**Performance**: ❌ Allocate objects/strings in loop · instanceof ✅ Reuse objects · Component queries

---

**Last Updated**: 2026-03-24 · **Owner**: Bug.J
