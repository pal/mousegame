## Hex Maze — Rework Plan

A complete plan for fixing the broken logic, modernising the stack, and shipping the game to GitHub Pages. Every change in this branch is checked against the **Success Criteria** below.

## Diagnosed bugs in the original code

1. **Wrong hex neighbours.** `getNeighbors` in `src/utils/gameLogic.ts` returns asymmetric offsets that do not match any standard offset-coordinate convention (odd-r, even-r, odd-q, even-q). The mouse traverses an invalid neighbourhood, so trap/escape detection is incorrect.
2. **Stale-closure race.** `moveMouseAfterDelay` in `src/components/Game.tsx` runs inside `setTimeout` and reads `walls`/`mousePosition` from the closure. Because React state updates are asynchronous, the wall you just placed is **not** in the array the AI considers, so the mouse can walk through it.
3. **Hard-coded bounds.** `isMouseAtEdge` and `isMouseTrapped` use a literal `10` while `Game.tsx` uses `size = 11`. Inconsistent.
4. **Wall on top of mouse.** `handleCellClick` only checks if the cell already has a wall — it does not check if the mouse occupies it.
5. **Broken hex rendering.** `Board.tsx` offsets each row by `row * 30px` (linear, monotonic) instead of a fixed odd/even shift, and `margin-top: -13px` does not match the hex height. The visual grid does not represent the logical grid.
6. **Naive AI.** `calculateMouseMove` picks the neighbour with the smallest min-distance to an edge — pure greedy, no pathfinding, dead-end prone.
7. **No game-over on zero score.** Score decrements to 0 and stays there.
8. **No restart, no landing page, no tests, no CI, no GH Pages deploy.**

## Success criteria

Each criterion has an acceptance test (automated where possible, manual otherwise).

### Functional correctness
- **F1.** `getNeighbors(p)` returns exactly 6 neighbours using **odd-r offset** coordinates, for both even and odd rows. *(unit test)*
- **F2.** Player cannot place a wall on the mouse cell or on an existing wall. *(unit + UI test)*
- **F3.** Game ends `PLAYER_WON` iff the mouse has no in-bounds, non-wall neighbours **and** is not on an edge. *(unit test)*
- **F4.** Game ends `MOUSE_WON` iff the mouse reaches any edge cell of the configured board size. *(unit test)*
- **F5.** Game ends `MOUSE_WON` if score reaches 0 before the mouse is trapped. *(unit test)*
- **F6.** Mouse AI runs a BFS to the nearest reachable edge and moves one step along the shortest path. If no edge is reachable it picks the neighbour that maximises future mobility (degree heuristic). *(unit test)*
- **F7.** Restart button resets walls, score, mouse position, and game state. *(UI test)*
- **F8.** The wall the player just placed is included in the wall-set the mouse uses when it decides its next move. *(integration test — guards against the original race condition)*

### Visual / UX
- **V1.** Hex grid renders with proper odd-r offset; no overlapping hexes, no gaps. *(manual + screenshot)*
- **V2.** Layout is responsive: works at 360px (mobile) and 1440px (desktop) widths without horizontal scroll. *(manual)*
- **V3.** Mouse, walls and empty cells are visually distinct; hover state on empty cells; subtle animation when a wall is placed and when the mouse moves. *(manual)*
- **V4.** A landing page is shown before the game with title, rules, difficulty selector, and a Start button. *(manual)*
- **V5.** End-of-game banner with score and a "Play again" button. *(manual)*

### Performance
- **P1.** Click-to-render of a placed wall is under one animation frame (≤ 16 ms) in production build. *(perf check via React profiler — manual)*
- **P2.** `vite build` output is under 250 KB gzipped. *(`du`/`ls` after build)*

### Tests, docs, deploy
- **T1.** `bun test` passes (vitest + jsdom + testing-library). Coverage of `gameLogic.ts` ≥ 90 %.
- **T2.** `bun run typecheck` and `bun run build` succeed with zero errors.
- **D1.** README documents: how to play, controls, dev/build/test commands, deploy URL, architecture notes.
- **D2.** All exported functions in `gameLogic.ts` carry a one-line JSDoc.
- **C1.** Pushes to `main` deploy to GitHub Pages via a workflow. App loads with the correct asset base path.

## Implementation order

1. **Plan + criteria** — this file.
2. **Deps** — React 19, Vite 7, styled-components 6, vitest, @testing-library/react, jsdom, @types/* updates.
3. **Game logic rewrite** — correct odd-r neighbours, board-size parameterised, BFS pathfinder, zero-score loss, win/lose unification.
4. **State machine fix** — `Game.tsx` computes the new wall set first and passes it to the AI in the same tick.
5. **Rendering rewrite** — `Board` and `Hexagon` use proper geometry with viewport-relative sizing; CSS variables for theme.
6. **Landing page** — title screen → game → end-screen state machine at the app root.
7. **Tests** — unit (gameLogic) + integration (full play flow) + a UI smoke test.
8. **Deploy** — `.github/workflows/deploy.yml` builds with the correct `base` and publishes to Pages.
9. **Docs** — README rewritten.
10. **Verify** — typecheck, tests, build, dev server smoke check before handing off.

## Verification checklist (run before declaring done)

- [ ] `bun install` clean
- [ ] `bun run typecheck` zero errors
- [ ] `bun run test` all green
- [ ] `bun run build` succeeds and dist is < 250 KB gzipped
- [ ] `bun run preview` serves the built site; the game is playable end-to-end
- [ ] Landing page renders, Start launches the game
- [ ] Place walls, mouse moves, win condition fires
- [ ] Restart resets everything
- [ ] Responsive at 360 px width
