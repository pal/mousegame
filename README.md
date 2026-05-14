# Hex Maze

A tiny strategy game: trap a clever mouse on a honeycomb board by placing walls before it reaches the edge. Built with React 19, TypeScript, styled-components and Vite, with a real shortest-path AI and a deploy-on-push pipeline to GitHub Pages.

## Play

1. Pick a difficulty on the landing page.
2. Click any empty hex to drop a wall. Each wall costs points.
3. The mouse moves one step along its shortest path to the nearest edge after every wall you place. Each move also costs points.
4. **You win** if the mouse has no legal move left.
5. **The mouse wins** if it reaches an edge cell — or if your score hits zero.

## Tech stack

| Layer | Choice |
| --- | --- |
| UI | React 19 + styled-components 6 |
| Build | Vite 8 |
| Language | TypeScript 5 (strict) |
| Tests | Vitest 4, Testing Library, jsdom |
| Runtime | Bun |
| Deploy | GitHub Actions → GitHub Pages |

## Project layout

```
src/
  App.tsx                # top-level view switcher: Landing ↔ Game
  index.tsx              # React entry point
  config.ts              # difficulty presets, board geometry helpers
  types.ts               # shared types (Point, GameStatus, Difficulty, …)
  styles/theme.ts        # global CSS variables + reset
  components/
    Landing.tsx          # start screen, difficulty selector
    Game.tsx             # state machine: score, walls, mouse, status
    Board.tsx            # absolutely-positioned, responsive hex grid
    Hexagon.tsx          # styled hex button (pointy-top, animated)
    Game.test.tsx        # integration tests
  utils/
    gameLogic.ts         # hex math, BFS pathfinder, win/lose checks
    gameLogic.test.ts    # unit tests
  test/setup.ts          # vitest global setup
```

## Architecture notes

* **Odd-r offset hex coordinates.** All hex math (neighbours, bounds, BFS) lives in `src/utils/gameLogic.ts` and assumes pointy-top hexes laid out in odd-r offset coordinates. Even rows have neighbours `{E, W, NE=(0,-1), NW=(-1,-1), SE=(0,+1), SW=(-1,+1)}`; odd rows are shifted right by half a cell. The unit tests verify symmetry (if A is a neighbour of B, B is a neighbour of A).
* **Mouse AI.** `calculateMouseMove` runs a BFS from the mouse's current cell to the nearest edge cell, treating walls as impassable. The mouse then steps one cell along the shortest path. If no edge is reachable it falls back to a degree heuristic — choosing the open neighbour with the most open neighbours of its own.
* **Race-free state.** When the player places a wall, `Game.tsx` first builds the new wall set, then both schedules the mouse's next move and checks win conditions against that same set in the same tick. The original implementation read stale state inside `setTimeout`; that bug is regression-tested.
* **Responsive board.** Hex size is a single CSS custom property (`--hex-size`) computed with `clamp()` from the viewport. The board has no media queries — it just scales.

## Success criteria & acceptance tests

The full criteria are in [`PLAN.md`](./PLAN.md). Summary of automated coverage:

| Criterion | Where it is verified |
| --- | --- |
| F1: six valid neighbours per cell, both row parities | `gameLogic.test.ts` |
| F2: cannot wall the mouse / a wall | `Game.test.tsx` |
| F3, F4: win/lose detection | `gameLogic.test.ts` |
| F6: BFS pathfinding around walls | `gameLogic.test.ts` |
| F7: restart resets state | `Game.test.tsx` |
| F8: walls placed this tick are seen by the AI | `gameLogic.test.ts` (regression) |
| T1: tests pass | `bun run test` |
| T2: typecheck + build | `bun run typecheck && bun run build` |

## Development

```bash
bun install
bun run dev         # http://localhost:3000
bun run test        # vitest run
bun run test:watch  # vitest watch mode
bun run typecheck   # tsc -b --noEmit
bun run build       # tsc -b && vite build → dist/
bun run preview     # serve the production build
```

## Deployment

`.github/workflows/deploy.yml` runs on every push to `main`:

1. Install deps with Bun.
2. Run typecheck and tests.
3. Build with `GITHUB_PAGES_BASE=/<repo-name>/` so all asset URLs work under the project subpath.
4. Publish `dist/` to GitHub Pages.

To enable Pages for the first time, in the GitHub repo settings go to **Pages → Build and deployment → Source** and choose **GitHub Actions**.

The deployed site URL will be `https://<owner>.github.io/<repo>/`.
