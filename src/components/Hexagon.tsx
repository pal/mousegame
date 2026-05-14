import styled, { css, keyframes } from 'styled-components';

const pop = keyframes`
  from { transform: scale(0.7); opacity: 0; }
  to   { transform: scale(1);   opacity: 1; }
`;

const wiggle = keyframes`
  0%   { transform: translate(-50%, -50%) scale(1)   rotate(0deg); }
  30%  { transform: translate(-50%, -50%) scale(1.1) rotate(-6deg); }
  60%  { transform: translate(-50%, -50%) scale(1.1) rotate(6deg); }
  100% { transform: translate(-50%, -50%) scale(1)   rotate(0deg); }
`;

interface CellProps {
  $isWall: boolean;
  $hasMouse: boolean;
  $interactive: boolean;
}

export const HexCell = styled.button<CellProps>`
  --hex-w: var(--hex-size);
  --hex-h: calc(var(--hex-size) * 1.1547);

  position: absolute;
  width: var(--hex-w);
  height: var(--hex-h);
  border: 0;
  padding: 0;
  background: transparent;
  cursor: ${(p) => (p.$interactive && !p.$isWall && !p.$hasMouse ? 'pointer' : 'default')};
  outline: none;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
    background: ${(p) =>
      p.$isWall
        ? 'linear-gradient(180deg, #3b2a4d 0%, #25182f 100%)'
        : 'linear-gradient(180deg, #f8f3ff 0%, #ece2f8 100%)'};
    box-shadow: ${(p) =>
      p.$isWall
        ? 'inset 0 -3px 0 rgba(0,0,0,0.35), inset 0 2px 0 rgba(255,255,255,0.06)'
        : 'inset 0 -2px 0 rgba(0,0,0,0.05)'};
    transition: filter 120ms ease, transform 120ms ease;
    ${(p) => p.$isWall && css`animation: ${pop} 160ms ease;`}
  }

  &:hover::before {
    filter: ${(p) =>
      p.$interactive && !p.$isWall && !p.$hasMouse ? 'brightness(1.06)' : 'none'};
  }

  &:focus-visible::before {
    outline: 2px solid var(--accent-ring);
    outline-offset: 2px;
  }

  ${(p) =>
    p.$hasMouse &&
    css`
      &::after {
        content: '🐭';
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        font-size: calc(var(--hex-size) * 0.55);
        animation: ${wiggle} 600ms ease;
        pointer-events: none;
      }
    `}
`;
