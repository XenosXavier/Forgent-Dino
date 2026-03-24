# Dino - Claude Development Handbook

**This is your development manual for building the Chrome Dino game. Follow this guide when implementing features, writing code, and solving problems.**

---

## Project Overview

**Dino** is a faithful Chrome offline dinosaur game recreation.

- **Type**: Endless runner game
- **Platform**: Web browser
- **Tech Stack**: TypeScript + HTML5 Canvas (zero external libraries)
- **Architecture**: ECS (Entity Component System)
- **Target**: 60 FPS, < 1s load time, < 50MB memory

---

## Primary Documents

**Always check these first:**

1. **[GDD.md](GDD.md)** — Game design decisions
   - Use for: What features to build, how mechanics work, visual style

2. **[TDD.md](TDD.md)** — Technical standards and decisions
   - Use for: Code style rules, version planning, performance budgets

3. **[diagrams/](diagrams/)** — Visual references
   - `core_loop.png` — Game loop flow
   - `screen_flow.png` — Screen transitions

---

## Common Commands (Development)

**Starting Development:**
```bash
npm run dev          # Start Vite dev server (localhost:5173)
npm run preview      # Preview production build
```

**Code Quality:**
```bash
npm run lint         # Run ESLint checks
npm run format       # Auto-format with Prettier
npm run type-check   # TypeScript type checking only
```

**Testing:**
```bash
npm run test                # Run all tests (watch mode)
npm run test:coverage       # Generate coverage report
npm run test -- <filename>  # Run specific test file
```

**Build & Deploy:**
```bash
npm run build        # Production build (dist/)
git push origin main # Auto-deploys to GitHub Pages
```

**Performance Profiling:**
```bash
# In browser console during dev:
console.time('frame');
// ... render logic
console.timeEnd('frame');  # Should be < 16.67ms
```

---

## Architecture: ECS (Entity Component System)

**Core Principles:**
- **Entities** — Game objects (Player, Cactus, Pterodactyl, Cloud, Ground)
- **Components** — Data only (Position, Velocity, Sprite, Hitbox, Animation)
- **Systems** — Logic only (RenderSystem, PhysicsSystem, CollisionSystem, InputSystem)

**Structure:** `src/entities/`, `src/components/`, `src/systems/`, `src/core/`

**Pattern:**
- Entity = ID + Components
- Component = Pure data structure
- System = Logic that queries and updates components

---

## Development Workflow

**Feature Development Steps:**

1. **Design** — Check GDD/TDD, identify entities/components/systems needed
2. **Implement** — Create components (data) → systems (logic) → entities (composition)
3. **Test** — Write tests (> 90% coverage), verify in browser, check performance
4. **Optimize** — Profile (< 16.67ms/frame, < 20 draw calls), verify memory stable
5. **Integrate** — Update docs if needed, commit (conventional commits), PR to `dev`
6. **Complete** — Feature works, tests pass, performance met, no TS/ESLint errors

---

## Testing Instructions

**Performance Verification:**
- **60 FPS**: Use `console.time('frame')` in game loop, should be < 16.67ms
- **Load Time**: DevTools Network tab, hard refresh, check "Load" time < 1s
- **Memory**: DevTools Performance Monitor, play 5 min, JS Heap < 50MB (stable)

**Functional Verification:**
- **Collision**: Jump into cactus → Game Over; Duck under pterodactyl → Avoid
- **Input**: Space/Down responds within 1 frame (< 16ms)
- **Score**: Increases continuously; High score updates and resets on refresh

**Browser Testing**: Chrome (primary), Firefox, Safari, Edge

---

## Code Style Quick Reference

**Naming:**
- Classes/Interfaces: `PascalCase` (e.g., `RenderSystem`)
- Functions/Variables: `camelCase` (e.g., `updatePosition`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `CANVAS_WIDTH`)
- Private: `private` keyword (not `#`)

**Files:**
- TypeScript files: `camelCase.ts` (e.g., `renderSystem.ts`)
- Test files: `*.test.ts`

**Types:**
- Always use explicit types
- Avoid `any`, use `unknown` if needed
- Prefer `interface` for objects, `type` for unions

**Comments:**
- JSDoc for all public APIs
- Inline comments for complex logic only

---

## Project-Specific Warnings

### ⚠️ Canvas API Gotchas
- **save/restore**: Always balance `ctx.save()` with `ctx.restore()` to avoid state corruption
- **clearRect**: For Dino, redraw white background instead of clearRect (better performance)
- **Image Loading**: Wait for `img.onload` before drawing, or images may not appear

### ⚠️ Performance Pitfalls
- **No object allocation in game loop**: Reuse objects or use primitives (avoid GC pressure)
- **Component queries over instanceof**: Use `entity.getComponent(Type)` (faster than type checking)
- **Cache strings**: Don't create new strings every frame in render loop

### ⚠️ TypeScript Strict Mode
- Always use explicit types, no implicit `any`
- Function params and return values must be typed
- Use `unknown` instead of `any` when type is truly unknown

### ⚠️ Git & Version
- Never commit to `main`, use feature branches
- Preserve merge commits (`--no-ff`)
- Follow conventional commits: `feat(scope): description`
- **Stick to current version scope** — Don't implement features from future versions (see TDD Section 9)

---

## Performance Budgets (Must Meet)

**Frame Budget:**
- Total frame time: < 16.67ms (60 FPS)
- JavaScript execution: < 10ms/frame
- Rendering: < 6ms/frame

**Load Budget:**
- Initial load: < 1 second
- Asset size: < 100KB (uncompressed)

**Memory Budget:**
- Total usage: < 50MB
- No memory leaks (stable over 5+ minutes)

**Rendering Budget:**
- Draw calls: < 20 per frame
- Use `requestAnimationFrame` only

---

## Constraints (Must Follow)

1. **Zero External Libraries** — No npm packages in production build
2. **TypeScript Strict Mode** — `"strict": true` in tsconfig.json
3. **Test Coverage > 90%** — All features must have tests
4. **ECS Architecture** — Follow Entity-Component-System pattern
5. **Canvas Size: 600×150px** — Fixed, never change
6. **No Audio** — This game has no sound

---

## Quick Reference

| Need | Check |
|------|-------|
| What to build | GDD.md |
| How to build | This file (CLAUDE.md) |
| Code style | TDD Section 5 |
| Version scope | TDD Section 9 |
| Performance targets | TDD Section 7 |
| Git workflow | TDD Section 6 |

---

**Last Updated:** 2026-03-24
**Project Owner:** Bug.J
**Your Role:** Implement features following this handbook
