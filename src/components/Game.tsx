import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { Board } from './Board';
import { BoardConfig, GameStatus, Point } from '../types';
import { centerOf } from '../config';
import {
  calculateMouseMove,
  isMouseAtEdge,
  isMouseTrapped,
  samePoint,
} from '../utils/gameLogic';

const MOUSE_DELAY_MS = 220;

const Wrap = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
`;

const HUD = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 12px;
  width: min(640px, 100%);
  padding: 12px 16px;
  border-radius: 16px;
  background: var(--surface);
  box-shadow: var(--shadow);
  font-weight: 600;
`;

const Pill = styled.span<{ $tone?: 'good' | 'bad' | 'neutral' }>`
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 14px;
  background: ${(p) =>
    p.$tone === 'good'
      ? 'var(--good)'
      : p.$tone === 'bad'
        ? 'var(--bad)'
        : 'var(--accent-soft)'};
  color: ${(p) => (p.$tone && p.$tone !== 'neutral' ? 'white' : 'var(--ink)')};
`;

const Spacer = styled.div`flex: 1;`;

const Button = styled.button`
  appearance: none;
  border: 0;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 999px;
  background: var(--accent);
  color: white;
  transition: transform 120ms ease, filter 120ms ease;
  &:hover { filter: brightness(1.08); }
  &:active { transform: translateY(1px); }
  &:focus-visible { outline: 2px solid var(--accent-ring); outline-offset: 2px; }
`;

const Banner = styled.div<{ $tone: 'good' | 'bad' }>`
  width: min(640px, 100%);
  padding: 16px 20px;
  border-radius: 16px;
  background: ${(p) => (p.$tone === 'good' ? 'var(--good)' : 'var(--bad)')};
  color: white;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: var(--shadow);
`;

const BannerText = styled.div`flex: 1; font-weight: 600;`;

interface GameProps {
  config: BoardConfig;
  onExit: () => void;
}

export function Game({ config, onExit }: GameProps) {
  const initial = useMemo<{ mouse: Point; walls: Point[]; score: number }>(
    () => ({ mouse: centerOf(config.size), walls: [], score: config.startingScore }),
    [config],
  );

  const [mouse, setMouse] = useState<Point>(initial.mouse);
  const [walls, setWalls] = useState<Point[]>(initial.walls);
  const [score, setScore] = useState(initial.score);
  const [status, setStatus] = useState<GameStatus>('PLAYING');
  const [thinking, setThinking] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reset = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setMouse(initial.mouse);
    setWalls(initial.walls);
    setScore(initial.score);
    setStatus('PLAYING');
    setThinking(false);
  }, [initial]);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const placeWall = useCallback(
    (cell: Point) => {
      if (status !== 'PLAYING' || thinking) return;
      if (samePoint(cell, mouse)) return;
      if (walls.some((w) => samePoint(w, cell))) return;

      const nextWalls = [...walls, cell];
      const nextScore = Math.max(0, score - config.scorePerWall);
      setWalls(nextWalls);
      setScore(nextScore);

      if (isMouseTrapped(mouse, nextWalls, config.size)) {
        setStatus('PLAYER_WON');
        return;
      }

      setThinking(true);
      timer.current = setTimeout(() => {
        const next = calculateMouseMove(mouse, nextWalls, config.size, {
          smartness: config.aiSmartness,
        });
        const moveCost = samePoint(next, mouse) ? 0 : config.scorePerMove;
        const updatedScore = Math.max(0, nextScore - moveCost);
        setMouse(next);
        setScore(updatedScore);
        setThinking(false);

        if (isMouseAtEdge(next, config.size)) {
          setStatus('MOUSE_WON');
        } else if (isMouseTrapped(next, nextWalls, config.size)) {
          setStatus('PLAYER_WON');
        } else if (updatedScore === 0) {
          setStatus('MOUSE_WON');
        }
      }, MOUSE_DELAY_MS);
    },
    [config, mouse, score, status, thinking, walls],
  );

  return (
    <Wrap>
      <HUD aria-label="Game status">
        <Pill $tone="neutral">Score {score}</Pill>
        <Pill $tone="neutral">Walls {walls.length}</Pill>
        <Spacer />
        <Button onClick={reset} aria-label="Restart game">Restart</Button>
        <Button onClick={onExit} aria-label="Back to menu">Menu</Button>
      </HUD>

      <Board
        size={config.size}
        walls={walls}
        mouse={mouse}
        onCellClick={placeWall}
        interactive={status === 'PLAYING' && !thinking}
      />

      {status === 'PLAYER_WON' && (
        <Banner $tone="good" role="status">
          <BannerText>You trapped the mouse! Final score: {score}</BannerText>
          <Button onClick={reset}>Play again</Button>
        </Banner>
      )}
      {status === 'MOUSE_WON' && (
        <Banner $tone="bad" role="status">
          <BannerText>The mouse escaped. Final score: {score}</BannerText>
          <Button onClick={reset}>Play again</Button>
        </Banner>
      )}
    </Wrap>
  );
}
