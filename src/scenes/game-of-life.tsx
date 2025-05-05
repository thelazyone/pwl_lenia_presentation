import {makeScene2D, Txt, Layout, Rect, Code} from '@motion-canvas/2d';
import {all, createRef, beginSlide, waitFor} from '@motion-canvas/core';
import {Colors, textStyles} from './shared';

// Game of Life implementation
function getGameOfLifeState(initialState: [number, number][], iteration: number): boolean[][] {
  const width = 23;
  const height = 13;
  
  // Initialize grid with all cells dead
  let grid = Array(height).fill(null).map(() => Array(width).fill(false));
  
  // Set initial alive cells
  initialState.forEach(([x, y]) => {
    if (x >= 0 && x < width && y >= 0 && y < height) {
      grid[y][x] = true;
    }
  });

  // Apply Game of Life rules for each iteration
  for (let i = 0; i < iteration; i++) {
    const newGrid = Array(height).fill(null).map(() => Array(width).fill(false));
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        // Count live neighbors
        let count = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue;
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < width && ny >= 0 && ny < height && grid[ny][nx]) {
              count++;
            }
          }
        }
        
        // Apply Game of Life rules
        if (grid[y][x]) {
          newGrid[y][x] = count === 2 || count === 3;
        } else {
          newGrid[y][x] = count === 3;
        }
      }
    }
    grid = newGrid;
  }
  
  return grid;
}

// Helper function to get previous state
function getPreviousState(initialState: [number, number][], iteration: number): boolean[][] {
  if (iteration === 0) return Array(13).fill(null).map(() => Array(23).fill(false));
  return getGameOfLifeState(initialState, iteration - 1);
}

export default makeScene2D(function* (view) {
  view.lineHeight(64);
  const title = createRef<Txt>();
  const subtitle = createRef<Txt>();
  const description = createRef<Layout>();
  const pseudocode = createRef<Code>();
  const grid = createRef<Layout>();
  const background = createRef<Rect>();

  // Add background
  view.add(
    <Rect
      ref={background}
      width={1920}
      height={1080}
      fill={Colors.background}
    />
  );

  // Title
  view.add(
    <Txt
      ref={title}
      {...textStyles.h1}
      position={[0, 0]}
    >
      Game of Life
    </Txt>
  );

  // Subtitle
  view.add(
    <Txt
      ref={subtitle}
      {...textStyles.h2}
      position={[0, 100]}
      opacity={0}
    >
      I'll be quick, I promise
    </Txt>
  );

  // Description
  view.add(
    <Layout
      ref={description}
      direction="column"
      gap={0}
      alignItems="center"
      position={[0, -view.height()/2 + 285]}
      opacity={0}
      layout
    >
      <Txt {...textStyles.body} textAlign="center">
        Created by John Horton Conway
      </Txt>
      <Txt {...textStyles.body} textAlign="center">
        2D square grid, for each cell count the neighbours that are alive
      </Txt>
    </Layout>
  );

  // Pseudocode
  view.add(
    <Code
      ref={pseudocode}
      position={[0, 100]}
      opacity={0}
      fontSize={48}
      code={`\
if (count == 2 && isAlive) {
    isAlive = true;
} else if (count == 3) {
    isAlive = true;
} else {
    isAlive = false;
}`}
    />
  );

  // Grid
  view.add(
    <Layout
      ref={grid}
      direction="column"
      gap={12}
      alignItems="center"
      position={[0, 70]}
      opacity={0}
      layout
    >
      {Array.from({length: 13}, (_, i) => (
        <Layout
          key={i.toString()}
          direction="row"
          gap={12}
          alignItems="center"
        >
          {Array.from({length: 23}, (_, j) => (
            <Rect
              key={`${i}-${j}`}
              width={50}
              height={50}
              fill={Colors.surface}
              radius={8}
            />
          ))}
        </Layout>
      ))}
    </Layout>
  );

  // Initial state
  title().opacity(1);
  subtitle().opacity(0);
  description().opacity(0);
  pseudocode().opacity(0);
  grid().opacity(0);

  // Show subtitle
  yield* subtitle().opacity(1, 0.5);
  yield* beginSlide('subtitle');

  // Fade out subtitle and move title up
  yield* all(
    subtitle().opacity(0, 0.5),
    title().position.y(-view.height()/2 + 150, 1)
  );

  // Show description
  yield* description().opacity(1, 0.5);
  yield* beginSlide('description');

  // Show pseudocode
  yield* pseudocode().opacity(1, 0.5);
  yield* beginSlide('pseudocode');

  // Highlight first part (until else)
  yield* pseudocode().selection([[0, 0], [4, 0]], 0.5);
  yield* beginSlide('highlight-first-part');

  // Highlight remaining part
  yield* pseudocode().selection([[4, 0], [7, 0]], 0.5);
  yield* beginSlide('highlight-second-part');

  // Show grid
  yield* all(
    description().opacity(0, 0.5),
    pseudocode().opacity(0, 0.5),
  );
  yield* grid().opacity(1, 0.5)
  yield* beginSlide('show-grid');

  // Function to update grid with a given state
  function* updateGrid(currentState: boolean[][], previousState: boolean[][], show_previous: boolean = true) {
    yield* all(
      ...grid().children().flatMap((row, i) =>
        (row as Layout).children().map((cell, j) => {
          const rect = cell as Rect;
          if (currentState[i][j]) {
            return rect.fill(Colors.whiteLabel, 0.5);
          } else if (previousState[i][j] && show_previous) {
            return rect.fill('#6c3b3b', 0.5); // Red shade for recently dead cells
          } else {
            return rect.fill(Colors.surface, 0.5);
          }
        })
      )
    );
  }

  // Make central cell alive
  const centerX = 11; // Middle of 23 cells
  const centerY = 6;  // Middle of 13 cells
  const initialState: [number, number][] = [[centerX, centerY]];
  
  // Update grid with initial state
  yield* updateGrid(
    getGameOfLifeState(initialState, 0),
    getPreviousState(initialState, 0)
  );
  yield* beginSlide('central-cell');

  // Show first iteration
  yield* updateGrid(
    getGameOfLifeState(initialState, 1),
    getPreviousState(initialState, 1),
  );

  yield* beginSlide('central-cell-dead');

  const semaphore: [number, number][] = [[centerX, centerY], [centerX, centerY+1], [centerX, centerY-1]];

   yield* updateGrid(
    getGameOfLifeState(semaphore, 0),
    getPreviousState(semaphore, 0),
    false //resetting the grid
  );

  yield* beginSlide('semaphore-born');

    yield* updateGrid(
    getGameOfLifeState(semaphore, 1),
    getPreviousState(semaphore, 1)
  );

  yield* beginSlide('semaphore-iteration');

  yield* beginSlide('semaphore-after-loop');

 

}); 