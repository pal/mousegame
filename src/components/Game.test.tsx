import { describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { Game } from './Game';
import { BoardConfig } from '../types';

const config: BoardConfig = {
  size: 5,
  startingScore: 100,
  scorePerWall: 10,
  scorePerMove: 10,
};

const clickCell = (x: number, y: number) => {
  const cell = screen.getByLabelText(new RegExp(`Empty cell ${x},${y}`));
  fireEvent.click(cell);
};

const advance = async (ms = 500) => {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(ms);
  });
};

describe('<Game />', () => {
  it('renders the HUD and a board', () => {
    render(<Game config={config} onExit={() => {}} />);
    expect(screen.getByText(/Score 100/)).toBeInTheDocument();
    expect(screen.getByText(/Walls 0/)).toBeInTheDocument();
    expect(screen.getByLabelText('Hex board')).toBeInTheDocument();
  });

  it('places a wall, deducts score, and moves the mouse', async () => {
    vi.useFakeTimers();
    render(<Game config={config} onExit={() => {}} />);
    clickCell(0, 0);
    await advance();
    expect(screen.getByText(/Walls 1/)).toBeInTheDocument();
    expect(screen.queryByText(/Score 100/)).not.toBeInTheDocument();
    vi.useRealTimers();
  });

  it('refuses to place a wall on the mouse cell', () => {
    render(<Game config={config} onExit={() => {}} />);
    const mouseCell = screen.getByLabelText('Mouse');
    fireEvent.click(mouseCell);
    expect(screen.getByText(/Walls 0/)).toBeInTheDocument();
  });

  it('ends with a banner when the mouse reaches an edge', async () => {
    vi.useFakeTimers();
    render(<Game config={config} onExit={() => {}} />);
    for (let i = 0; i < config.size * config.size; i++) {
      if (screen.queryByRole('status')) break;
      const empty = screen.queryAllByLabelText(/Empty cell/);
      if (empty.length === 0) break;
      fireEvent.click(empty[0]);
      await advance();
    }
    expect(screen.getByRole('status')).toBeInTheDocument();
    vi.useRealTimers();
  });

  it('Restart resets walls, score, and game state', async () => {
    vi.useFakeTimers();
    render(<Game config={config} onExit={() => {}} />);
    clickCell(0, 0);
    await advance();
    fireEvent.click(screen.getByRole('button', { name: /restart/i }));
    expect(screen.getByText(/Walls 0/)).toBeInTheDocument();
    expect(screen.getByText(/Score 100/)).toBeInTheDocument();
    vi.useRealTimers();
  });
});
