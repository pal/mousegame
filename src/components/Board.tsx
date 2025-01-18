import React from 'react';
import styled from 'styled-components';
import { Point } from '../types';
import { Hexagon } from './Hexagon';

const BoardContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Row = styled.div<{ offset: number }>`
    display: flex;
    margin-left: ${props => props.offset}px;
    margin-top: -13px;
    &:first-child {
        margin-top: 0;
    }
`;

interface BoardProps {
    size: number;
    walls: Point[];
    mousePosition: Point;
    onCellClick: (position: Point) => void;
}

export function Board({ size, walls, mousePosition, onCellClick }: BoardProps) {
    const rows = Array.from({ length: size }, (_, i) => i);
    const cols = Array.from({ length: size }, (_, i) => i);

    return (
        <BoardContainer>
            {rows.map(row => (
                <Row key={row} offset={row * 30}>
                    {cols.map(col => {
                        const position = { x: col, y: row };
                        const isWall = walls.some(
                            wall => wall.x === col && wall.y === row
                        );
                        const hasMouse = 
                            mousePosition.x === col && mousePosition.y === row;

                        return (
                            <Hexagon
                                key={`${col}-${row}`}
                                isWall={isWall}
                                hasMouse={hasMouse}
                                onClick={() => onCellClick(position)}
                            />
                        );
                    })}
                </Row>
            ))}
        </BoardContainer>
    );
} 