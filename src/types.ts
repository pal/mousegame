export interface Point {
  x: number;
  y: number;
}

export type GameStatus = 'PLAYING' | 'PLAYER_WON' | 'MOUSE_WON';

export type Difficulty = 'EASY' | 'NORMAL' | 'HARD';

export interface BoardConfig {
  size: number;
  startingScore: number;
  scorePerWall: number;
  scorePerMove: number;
  /** Probability the mouse plays the optimal BFS step; otherwise it picks a random open neighbour. 1 = perfect, 0 = pure random walk. */
  aiSmartness: number;
}
