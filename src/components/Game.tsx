import React, { useState } from 'react';
import styled from 'styled-components';
import { Board } from './Board';
import { Point, GameState } from '../types';
import { calculateMouseMove, isMouseTrapped, isMouseAtEdge } from '../utils/gameLogic';

const GameContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
`;

const ScoreDisplay = styled.div`
    font-size: 24px;
    margin-bottom: 20px;
`;

export function Game() {
    const [score, setScore] = useState(1000);
    const [mousePosition, setMousePosition] = useState<Point>({ x: 5, y: 5 });
    const [gameState, setGameState] = useState<GameState>('PLAYING');
    const [walls, setWalls] = useState<Point[]>([]);

    const handleCellClick = (position: Point) => {
        if (gameState !== 'PLAYING') return;
        
        const isWallPresent = walls.some(wall => 
            wall.x === position.x && wall.y === position.y
        );
        
        if (!isWallPresent) {
            setWalls([...walls, position]);
            setScore(prev => Math.max(0, prev - 10));
            moveMouseAfterDelay();
        }
    };

    const moveMouseAfterDelay = () => {
        setTimeout(() => {
            const newPosition = calculateMouseMove(mousePosition, walls);
            setMousePosition(newPosition);
            setScore(prev => Math.max(0, prev - 10));
            checkGameState(newPosition);
        }, 500);
    };

    const checkGameState = (mousePos: Point) => {
        if (isMouseTrapped(mousePos, walls)) {
            setGameState('PLAYER_WON');
        } else if (isMouseAtEdge(mousePos)) {
            setGameState('MOUSE_WON');
        }
    };

    return (
        <GameContainer>
            <ScoreDisplay>Score: {score}</ScoreDisplay>
            <Board
                size={11}
                walls={walls}
                mousePosition={mousePosition}
                onCellClick={handleCellClick}
            />
            {gameState !== 'PLAYING' && (
                <div>
                    {gameState === 'PLAYER_WON' ? 'You Won!' : 'Mouse Escaped!'}
                </div>
            )}
        </GameContainer>
    );
} 