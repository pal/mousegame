import { Point } from '../types';

const getNeighbors = (position: Point): Point[] => {
    // In a hexagonal grid, each cell has 6 neighbors
    // For even rows (y % 2 === 0), neighbors are slightly different than odd rows
    const isEvenRow = position.y % 2 === 0;
    
    const directions = isEvenRow ? [
        { x: 0, y: -1 },  // top
        { x: 1, y: -1 },  // top-right
        { x: 1, y: 0 },   // right
        { x: 0, y: 1 },   // bottom
        { x: 1, y: 1 },   // bottom-right
        { x: -1, y: 0 },  // left
    ] : [
        { x: 0, y: -1 },   // top
        { x: 0, y: 1 },    // bottom
        { x: 1, y: 0 },    // right
        { x: -1, y: 0 },   // left
        { x: -1, y: -1 },  // top-left
        { x: -1, y: 1 },   // bottom-left
    ];

    return directions.map(dir => ({
        x: position.x + dir.x,
        y: position.y + dir.y
    }));
};

export const isMouseAtEdge = (position: Point): boolean => {
    return position.x === 0 || position.x === 10 || 
           position.y === 0 || position.y === 10;
};

export const isMouseTrapped = (position: Point, walls: Point[]): boolean => {
    const neighbors = getNeighbors(position);
    return neighbors.every(neighbor => {
        const isWall = walls.some(wall => 
            wall.x === neighbor.x && wall.y === neighbor.y
        );
        const isOutOfBounds = 
            neighbor.x < 0 || neighbor.x > 10 || 
            neighbor.y < 0 || neighbor.y > 10;
        return isWall || isOutOfBounds;
    });
};

export const calculateMouseMove = (position: Point, walls: Point[]): Point => {
    const neighbors = getNeighbors(position).filter(neighbor => {
        const isWall = walls.some(wall => 
            wall.x === neighbor.x && wall.y === neighbor.y
        );
        const isInBounds = 
            neighbor.x >= 0 && neighbor.x <= 10 && 
            neighbor.y >= 0 && neighbor.y <= 10;
        return !isWall && isInBounds;
    });

    if (neighbors.length === 0) return position;

    // Move towards the nearest edge
    return neighbors.reduce((closest, current) => {
        const currentDistanceToEdge = Math.min(
            current.x,
            current.y,
            Math.abs(10 - current.x),
            Math.abs(10 - current.y)
        );
        const closestDistanceToEdge = Math.min(
            closest.x,
            closest.y,
            Math.abs(10 - closest.x),
            Math.abs(10 - closest.y)
        );
        return currentDistanceToEdge < closestDistanceToEdge ? current : closest;
    });
}; 