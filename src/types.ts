export interface Point {
    x: number;
    y: number;
}

export interface HexCell {
    position: Point;
    isWall: boolean;
    hasMouse: boolean;
}

export type GameState = 'PLAYING' | 'PLAYER_WON' | 'MOUSE_WON'; 