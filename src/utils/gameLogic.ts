import { Point } from '../types';

/**
 * Odd-r offset coordinates: odd-numbered rows are shifted right by half a hex.
 * Returns the six neighbour offsets for a given row parity.
 */
const NEIGHBOR_OFFSETS_EVEN_ROW: ReadonlyArray<Point> = [
  { x: +1, y: 0 },  // E
  { x: -1, y: 0 },  // W
  { x: 0, y: -1 },  // NE
  { x: -1, y: -1 }, // NW
  { x: 0, y: +1 },  // SE
  { x: -1, y: +1 }, // SW
];

const NEIGHBOR_OFFSETS_ODD_ROW: ReadonlyArray<Point> = [
  { x: +1, y: 0 },  // E
  { x: -1, y: 0 },  // W
  { x: +1, y: -1 }, // NE
  { x: 0, y: -1 },  // NW
  { x: +1, y: +1 }, // SE
  { x: 0, y: +1 },  // SW
];

/** Six in-grid + out-of-grid neighbours of a hex in odd-r offset coordinates. */
export const getNeighbors = (position: Point): Point[] => {
  const offsets =
    position.y % 2 === 0 ? NEIGHBOR_OFFSETS_EVEN_ROW : NEIGHBOR_OFFSETS_ODD_ROW;
  return offsets.map((d) => ({ x: position.x + d.x, y: position.y + d.y }));
};

/** True iff (x, y) lies inside an `size x size` board. */
export const inBounds = (p: Point, size: number): boolean =>
  p.x >= 0 && p.x < size && p.y >= 0 && p.y < size;

/** True iff the cell is on the outer ring of the board. */
export const isMouseAtEdge = (p: Point, size: number): boolean =>
  p.x === 0 || p.y === 0 || p.x === size - 1 || p.y === size - 1;

const key = (p: Point): string => `${p.x},${p.y}`;

/** Build a set of wall keys for O(1) lookup. */
const buildWallSet = (walls: ReadonlyArray<Point>): Set<string> => {
  const s = new Set<string>();
  for (const w of walls) s.add(key(w));
  return s;
};

/** Open (in-bounds, non-wall) neighbours of `p`. */
export const openNeighbors = (
  p: Point,
  walls: ReadonlyArray<Point>,
  size: number,
): Point[] => {
  const wallSet = buildWallSet(walls);
  return getNeighbors(p).filter(
    (n) => inBounds(n, size) && !wallSet.has(key(n)),
  );
};

/** Mouse has no legal move and is not already on an edge cell. */
export const isMouseTrapped = (
  p: Point,
  walls: ReadonlyArray<Point>,
  size: number,
): boolean => !isMouseAtEdge(p, size) && openNeighbors(p, walls, size).length === 0;

/**
 * Breadth-first search from `start` to the nearest edge cell.
 * Returns the path including `start` at index 0; `null` if no edge reachable.
 */
export const shortestPathToEdge = (
  start: Point,
  walls: ReadonlyArray<Point>,
  size: number,
): Point[] | null => {
  if (isMouseAtEdge(start, size)) return [start];
  const wallSet = buildWallSet(walls);
  const visited = new Set<string>([key(start)]);
  const parent = new Map<string, Point>();
  const queue: Point[] = [start];

  while (queue.length > 0) {
    const current = queue.shift()!;
    for (const n of getNeighbors(current)) {
      if (!inBounds(n, size)) continue;
      const k = key(n);
      if (visited.has(k) || wallSet.has(k)) continue;
      visited.add(k);
      parent.set(k, current);
      if (isMouseAtEdge(n, size)) {
        const path: Point[] = [n];
        let cursor: Point | undefined = current;
        while (cursor) {
          path.unshift(cursor);
          cursor = parent.get(key(cursor));
        }
        return path;
      }
      queue.push(n);
    }
  }
  return null;
};

/**
 * Pick the mouse's next position.
 *  - If an edge is reachable: step one cell along the shortest path.
 *  - If not: pick the open neighbour with the largest open degree (stay mobile).
 *  - If completely surrounded: stay put.
 */
export const calculateMouseMove = (
  position: Point,
  walls: ReadonlyArray<Point>,
  size: number,
): Point => {
  const path = shortestPathToEdge(position, walls, size);
  if (path && path.length >= 2) return path[1];

  const open = openNeighbors(position, walls, size);
  if (open.length === 0) return position;
  return open.reduce((best, candidate) => {
    const bestDeg = openNeighbors(best, walls, size).length;
    const candDeg = openNeighbors(candidate, walls, size).length;
    return candDeg > bestDeg ? candidate : best;
  });
};

/** True iff `a` and `b` refer to the same cell. */
export const samePoint = (a: Point, b: Point): boolean =>
  a.x === b.x && a.y === b.y;
