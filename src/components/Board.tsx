import { memo, useMemo } from 'react';
import styled from 'styled-components';
import { Point } from '../types';
import { HexCell } from './Hexagon';

interface BoardProps {
  size: number;
  walls: ReadonlyArray<Point>;
  mouse: Point;
  onCellClick: (p: Point) => void;
  interactive: boolean;
}

const HEX_VERTICAL_RATIO = 0.75;   // pointy-top row vertical advance / hex height
const HEX_HEIGHT_RATIO = 1.1547;   // hex height / hex width (2 / sqrt(3))

const Frame = styled.div<{ $cols: number; $rows: number }>`
  --hex-size: clamp(20px, min(7vw, calc((90vh - 200px) / ${(p) => p.$rows + 1})), 56px);

  position: relative;
  --frame-pad: 12px;
  width: calc((${(p) => p.$cols} + 0.5) * var(--hex-size) + var(--frame-pad) * 2);
  height: calc(
    var(--hex-size) * ${HEX_HEIGHT_RATIO} +
      (${(p) => p.$rows - 1}) * var(--hex-size) * ${HEX_HEIGHT_RATIO} * ${HEX_VERTICAL_RATIO} +
      var(--frame-pad) * 2
  );
  max-width: calc(100vw - 32px);
  margin: 8px auto;
  padding: var(--frame-pad);
  border-radius: 24px;
  background: var(--board);
  box-shadow: var(--shadow);
`;

function BoardImpl({ size, walls, mouse, onCellClick, interactive }: BoardProps) {
  const wallKeys = useMemo(() => {
    const s = new Set<string>();
    for (const w of walls) s.add(`${w.x},${w.y}`);
    return s;
  }, [walls]);

  const cells = useMemo(() => {
    const out: { p: Point; xPct: number; yPct: number }[] = [];
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const rowShift = y % 2 === 0 ? 0 : 0.5;
        out.push({ p: { x, y }, xPct: x + rowShift, yPct: y });
      }
    }
    return out;
  }, [size]);

  return (
    <Frame $cols={size} $rows={size} role="grid" aria-label="Hex board">
      {cells.map(({ p, xPct, yPct }) => {
        const isWall = wallKeys.has(`${p.x},${p.y}`);
        const hasMouse = mouse.x === p.x && mouse.y === p.y;
        return (
          <HexCell
            key={`${p.x},${p.y}`}
            role="gridcell"
            aria-label={
              hasMouse ? 'Mouse' : isWall ? 'Wall' : `Empty cell ${p.x},${p.y}`
            }
            aria-disabled={!interactive || isWall || hasMouse}
            $isWall={isWall}
            $hasMouse={hasMouse}
            $interactive={interactive}
            style={{
              left: `calc(${xPct} * var(--hex-size))`,
              top: `calc(${yPct} * var(--hex-size) * ${HEX_HEIGHT_RATIO} * ${HEX_VERTICAL_RATIO})`,
            }}
            onClick={() => onCellClick(p)}
          />
        );
      })}
    </Frame>
  );
}

export const Board = memo(BoardImpl);
