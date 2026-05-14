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
}
