import { describe, expect, it } from 'vitest';
import {
  calculateMouseMove,
  getNeighbors,
  inBounds,
  isMouseAtEdge,
  isMouseTrapped,
  openNeighbors,
  samePoint,
  shortestPathToEdge,
} from './gameLogic';
import { Point } from '../types';

const sortPts = (a: Point[]) =>
  [...a].sort((p, q) => (p.y - q.y) || (p.x - q.x));

describe('getNeighbors (odd-r offset)', () => {
  it('returns six unique neighbours for an even row', () => {
    const ns = sortPts(getNeighbors({ x: 3, y: 2 }));
    expect(ns).toEqual(
      sortPts([
        { x: 4, y: 2 }, { x: 2, y: 2 },
        { x: 3, y: 1 }, { x: 2, y: 1 },
        { x: 3, y: 3 }, { x: 2, y: 3 },
      ]),
    );
    expect(ns).toHaveLength(6);
  });

  it('returns six unique neighbours for an odd row', () => {
    const ns = sortPts(getNeighbors({ x: 3, y: 3 }));
    expect(ns).toEqual(
      sortPts([
        { x: 4, y: 3 }, { x: 2, y: 3 },
        { x: 4, y: 2 }, { x: 3, y: 2 },
        { x: 4, y: 4 }, { x: 3, y: 4 },
      ]),
    );
    expect(ns).toHaveLength(6);
  });

  it('is symmetric: if A is a neighbour of B then B is a neighbour of A', () => {
    for (let y = 0; y < 7; y++) {
      for (let x = 0; x < 7; x++) {
        for (const n of getNeighbors({ x, y })) {
          const back = getNeighbors(n);
          expect(back.some((b) => samePoint(b, { x, y }))).toBe(true);
        }
      }
    }
  });
});

describe('inBounds / isMouseAtEdge', () => {
  it('inBounds works', () => {
    expect(inBounds({ x: 0, y: 0 }, 5)).toBe(true);
    expect(inBounds({ x: 4, y: 4 }, 5)).toBe(true);
    expect(inBounds({ x: -1, y: 0 }, 5)).toBe(false);
    expect(inBounds({ x: 5, y: 4 }, 5)).toBe(false);
  });

  it('isMouseAtEdge detects the outer ring', () => {
    expect(isMouseAtEdge({ x: 0, y: 3 }, 7)).toBe(true);
    expect(isMouseAtEdge({ x: 6, y: 3 }, 7)).toBe(true);
    expect(isMouseAtEdge({ x: 3, y: 0 }, 7)).toBe(true);
    expect(isMouseAtEdge({ x: 3, y: 6 }, 7)).toBe(true);
    expect(isMouseAtEdge({ x: 3, y: 3 }, 7)).toBe(false);
  });
});

describe('isMouseTrapped', () => {
  it('returns false when at least one open neighbour exists', () => {
    expect(isMouseTrapped({ x: 3, y: 3 }, [], 7)).toBe(false);
  });

  it('returns true when every neighbour is a wall', () => {
    const mouse = { x: 3, y: 3 };
    const walls = getNeighbors(mouse);
    expect(isMouseTrapped(mouse, walls, 7)).toBe(true);
  });

  it('is not trapped if mouse is already on the edge', () => {
    const mouse = { x: 0, y: 3 };
    const walls = getNeighbors(mouse);
    expect(isMouseTrapped(mouse, walls, 7)).toBe(false);
  });
});

describe('openNeighbors', () => {
  it('omits walls and out-of-bounds cells', () => {
    const mouse = { x: 0, y: 0 };
    const walls: Point[] = [{ x: 1, y: 0 }];
    const open = openNeighbors(mouse, walls, 3);
    expect(open.every((p) => inBounds(p, 3))).toBe(true);
    expect(open.some((p) => samePoint(p, { x: 1, y: 0 }))).toBe(false);
  });
});

describe('shortestPathToEdge (BFS)', () => {
  it('returns a single-cell path when the mouse is already on the edge', () => {
    const path = shortestPathToEdge({ x: 0, y: 2 }, [], 5);
    expect(path).toEqual([{ x: 0, y: 2 }]);
  });

  it('finds a straight-line path on an empty board', () => {
    const path = shortestPathToEdge({ x: 2, y: 2 }, [], 5);
    expect(path).not.toBeNull();
    expect(path![0]).toEqual({ x: 2, y: 2 });
    expect(isMouseAtEdge(path![path!.length - 1], 5)).toBe(true);
  });

  it('routes around a wall', () => {
    const mouse = { x: 2, y: 2 };
    const walls: Point[] = [
      { x: 2, y: 1 }, { x: 1, y: 1 }, { x: 3, y: 1 },
    ];
    const path = shortestPathToEdge(mouse, walls, 5);
    expect(path).not.toBeNull();
    for (const step of path!) {
      expect(walls.some((w) => samePoint(w, step))).toBe(false);
    }
    expect(isMouseAtEdge(path![path!.length - 1], 5)).toBe(true);
  });

  it('returns null when no edge is reachable', () => {
    const mouse = { x: 2, y: 2 };
    const walls = getNeighbors(mouse);
    expect(shortestPathToEdge(mouse, walls, 5)).toBeNull();
  });
});

describe('calculateMouseMove', () => {
  it('takes the first step of the shortest path', () => {
    const mouse = { x: 2, y: 2 };
    const next = calculateMouseMove(mouse, [], 5);
    const path = shortestPathToEdge(mouse, [], 5)!;
    expect(next).toEqual(path[1]);
  });

  it('never steps onto a wall', () => {
    const mouse = { x: 2, y: 2 };
    const walls: Point[] = [{ x: 2, y: 1 }];
    const next = calculateMouseMove(mouse, walls, 5);
    expect(walls.some((w) => samePoint(w, next))).toBe(false);
  });

  it('stays put if completely surrounded', () => {
    const mouse = { x: 2, y: 2 };
    const walls = getNeighbors(mouse);
    expect(calculateMouseMove(mouse, walls, 5)).toEqual(mouse);
  });

  it('picks an open neighbour when not surrounded', () => {
    const mouse = { x: 3, y: 3 };
    const walls: Point[] = [{ x: 3, y: 2 }];
    const next = calculateMouseMove(mouse, walls, 7);
    const ns = getNeighbors(mouse);
    expect(ns.some((n) => samePoint(n, next))).toBe(true);
    expect(walls.some((w) => samePoint(w, next))).toBe(false);
  });

  it('respects walls placed since the last move (regression for stale-walls race)', () => {
    const mouse = { x: 3, y: 3 };
    const wallsBefore: Point[] = [];
    const aboutToPlace: Point = calculateMouseMove(mouse, wallsBefore, 7);
    const wallsAfter = [...wallsBefore, aboutToPlace];
    const next = calculateMouseMove(mouse, wallsAfter, 7);
    expect(samePoint(next, aboutToPlace)).toBe(false);
  });
});
