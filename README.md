# Hex Maze Game

A strategic web-based game where players compete against an AI mouse in a hexagonal grid. Build walls to trap the mouse while it tries to escape to the edges of the board.

## Game Rules
- Players click empty hexagons to build walls
- The mouse moves after each wall placement
- Score starts at 1000 and decreases by 10 with each move
- Players win by trapping the mouse with no escape route
- The mouse wins by reaching any edge of the board

## Tech Stack
- React
- TypeScript
- Styled Components
- Bun as the runtime

## Implementation Plan

### Completed
- ✅ Basic game board layout
- ✅ Hexagonal grid system
- ✅ Wall placement mechanics
- ✅ Mouse movement logic
- ✅ Score tracking
- ✅ Win/lose conditions

### Todo
1. Mouse AI Improvements
   - Implement pathfinding algorithm (A*)
   - Add difficulty levels
   - Make mouse movement more strategic

2. UI/UX Enhancements
   - Add responsive design for mobile
   - Improve visual feedback for player actions
   - Add animations for mouse movement
   - Add a game restart button

3. Game Features
   - Add a tutorial/help section
   - Implement different board sizes
   - Add sound effects
   - Save high scores

4. Performance Optimization
   - Optimize render cycles
   - Add memoization where needed

5. Testing
   - Add unit tests for game logic
   - Add integration tests
   - Add browser compatibility tests

## Development

To run the project locally:

```bash
bun install
bun dev
```

This implementation provides a solid foundation for the game. The next priority should be improving the mouse AI to make the game more challenging and implementing the responsive design for mobile devices. Would you like me to focus on any specific aspect from the todo list?