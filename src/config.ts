import { BoardConfig, Difficulty, Point } from './types';

export const DIFFICULTY: Record<Difficulty, BoardConfig> = {
  EASY:   { size: 9,  startingScore: 1000, scorePerWall: 5,  scorePerMove: 5,  aiSmartness: 0.35 },
  NORMAL: { size: 11, startingScore: 1000, scorePerWall: 10, scorePerMove: 10, aiSmartness: 0.7  },
  HARD:   { size: 13, startingScore: 800,  scorePerWall: 15, scorePerMove: 15, aiSmartness: 1    },
};

/** Centre cell of an n x n board (works for both odd and even n). */
export const centerOf = (size: number): Point => ({
  x: Math.floor(size / 2),
  y: Math.floor(size / 2),
});
