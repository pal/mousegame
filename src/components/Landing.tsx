import styled from 'styled-components';
import { Difficulty } from '../types';

const Wrap = styled.section`
  display: grid;
  gap: 24px;
  width: min(680px, 100%);
  padding: 32px;
  border-radius: 24px;
  background: var(--surface);
  box-shadow: var(--shadow);
  text-align: center;
`;

const Title = styled.h1`
  margin: 0;
  font-size: clamp(28px, 5vw, 44px);
  letter-spacing: -0.01em;
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

const Subtitle = styled.p`
  margin: 0 auto;
  max-width: 48ch;
  color: var(--ink-soft);
  line-height: 1.5;
`;

const Rules = styled.ul`
  margin: 0 auto;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 8px;
  max-width: 48ch;
  text-align: left;
  color: var(--ink);
`;

const Rule = styled.li`
  position: relative;
  padding-left: 28px;
  &::before {
    content: '◆';
    position: absolute;
    left: 8px;
    top: 0;
    color: var(--accent);
  }
`;

const DifficultyRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.button`
  appearance: none;
  border: 2px solid transparent;
  background: var(--accent-soft);
  color: var(--ink);
  border-radius: 16px;
  padding: 16px;
  cursor: pointer;
  display: grid;
  gap: 4px;
  text-align: center;
  font: inherit;
  transition: transform 120ms ease, border-color 120ms ease, background 120ms ease;
  &:hover { transform: translateY(-2px); border-color: var(--accent); }
  &:active { transform: translateY(0); }
  &:focus-visible { outline: 2px solid var(--accent-ring); outline-offset: 2px; }
`;

const CardTitle = styled.strong`
  font-size: 18px;
  color: var(--accent);
`;

const CardMeta = styled.span`
  color: var(--ink-soft);
  font-size: 13px;
`;

interface LandingProps {
  onStart: (difficulty: Difficulty) => void;
}

export function Landing({ onStart }: LandingProps) {
  return (
    <Wrap aria-label="Start screen">
      <Title>Hex Maze</Title>
      <Subtitle>
        A tiny strategy game. Trap a wandering mouse by placing walls on a
        honeycomb board. Move fast — every wall and every mouse step costs
        points.
      </Subtitle>

      <Rules>
        <Rule>Click any empty hex to place a wall.</Rule>
        <Rule>The mouse moves one step toward the nearest edge after every wall.</Rule>
        <Rule>Win by surrounding the mouse so it has no legal move.</Rule>
        <Rule>Lose if it reaches an edge — or if your score hits zero.</Rule>
      </Rules>

      <DifficultyRow>
        <Card onClick={() => onStart('EASY')} aria-label="Easy difficulty">
          <CardTitle>Easy</CardTitle>
          <CardMeta>9 × 9 · clumsy mouse</CardMeta>
        </Card>
        <Card onClick={() => onStart('NORMAL')} aria-label="Normal difficulty">
          <CardTitle>Normal</CardTitle>
          <CardMeta>11 × 11 · smart mouse</CardMeta>
        </Card>
        <Card onClick={() => onStart('HARD')} aria-label="Hard difficulty">
          <CardTitle>Hard</CardTitle>
          <CardMeta>13 × 13 · ruthless mouse</CardMeta>
        </Card>
      </DifficultyRow>
    </Wrap>
  );
}
