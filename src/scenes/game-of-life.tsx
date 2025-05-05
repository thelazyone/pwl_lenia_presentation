import {makeScene2D, Txt, Layout, Rect, Code} from '@motion-canvas/2d';
import {all, createRef, beginSlide, waitFor, loopUntil, loopFor, loop} from '@motion-canvas/core';
import {Colors, textStyles} from './shared';

// Game of Life implementation
function getGameOfLifeState(initialState: [number, number][], iteration: number): boolean[][] {
  const width = 43;
  const height = 33;
  
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
  if (iteration === 0) return Array(33).fill(null).map(() => Array(43).fill(false));
  return getGameOfLifeState(initialState, iteration - 1);
}

// Function to create a glider object from coordinates
function createGliderObject(coordinates: [number, number][]) {
  // Find the minimum x and y to normalize coordinates
  const minX = Math.min(...coordinates.map(([x]) => x));
  const minY = Math.min(...coordinates.map(([, y]) => y));
  
  // Create a layout to hold the glider
  const gliderLayout = createRef<Layout>();
  
  // Create the squares with normalized coordinates
  const squares = coordinates.map(([x, y]) => {
    const normalizedX = (x - minX) * 62; // 50 (width) + 12 (gap)
    const normalizedY = (y - minY) * 62;
    return (
      <Rect
        width={50}
        height={50}
        x={normalizedX}
        y={normalizedY}
        fill={Colors.whiteLabel}
        radius={8}
      />
    );
  });

  return {gliderLayout, squares};
}

// Game of Life object definitions
const gameObjects: Record<string, [number, number][]> = {
  glider: [
    [0, 0], [1, 0], [2, 0],
    [2, 1],
    [1, 2]
  ] as [number, number][],
  spaceship: [ // Light-weight spaceship
    [0, 0], [3, 0],
    [4, 1],
    [0, 2], [4, 2],
    [1, 3], [2, 3], [3, 3], [4, 3]
  ] as [number, number][],
  blinker: [ // Period 2 oscillator
    [0, 0],
    [0, 1],
    [0, 2]
  ] as [number, number][],
  pulsar: [ // Period 3 oscillator
    [0, 2], [0, 3], [0, 9], [0, 10],
    [1, 3], [1, 4], [1, 8], [1, 9],
    [2, 0], [2, 3], [2, 5], [2, 7], [2, 9], [2, 12],
    [3, 0], [3, 1], [3, 2], [3, 4], [3, 5], [3, 0], [3, 7], [3, 8], [3, 10], [3, 11], [3, 12],
    [4, 1], [4, 3], [4, 5], [4, 7], [4, 9], [4, 11],
    [5, 2], [5, 3], [5, 4], [5, 8], [5, 9], [5, 10],
    [7, 2], [7, 3], [7, 4], [7, 8], [7, 9], [7, 10],
    [8, 1], [8, 3], [8, 5], [8, 7], [8, 9], [8, 11],
    [9, 0], [9, 1], [9, 2], [9, 4], [9, 5], [9, 0], [9, 7], [9, 8], [9, 10], [9, 11], [9, 12],
    [10, 0], [10, 3], [10, 5], [10, 7], [10, 9], [10, 12],
    [11, 3], [11, 4], [11, 8], [11, 9],
    [12, 2], [12, 3], [12, 9], [12, 10],
  ] as [number, number][],
  beehive: [ // Still life
    [1, 0], [2, 0],
    [0, 1], [3, 1],
    [1, 2], [2, 2]
  ] as [number, number][],
  tub: [ // Still life
    [1, 0],
    [0, 1], [2, 1],
    [1, 2]
  ] as [number, number][],
  puffer1: [ // Small puffer
    [0, 0], [1, 0], [2, 0],
    [0, 1], [2, 1],
    [0, 2], [1, 2], [2, 2],
    [3, 3], [4, 3], [5, 3],
    [3, 4], [5, 4],
    [3, 5], [4, 5], [5, 5]
  ] as [number, number][]
};

// Pattern type definition
type Pattern = {
  name: string;
  coordinates: [number, number][];
  scale?: number;
};

// Pattern definitions
const patterns: Record<string, Pattern> = {
  glider: {
    name: 'glider',
    coordinates: [
      [0, 0], [1, 0], [2, 0],
      [2, 1],
      [1, 2]
    ],
    scale: 0.8
  },
  spaceship: {
    name: 'spaceship',
    coordinates: [
      [0, 0], [3, 0],
      [4, 1],
      [0, 2], [4, 2],
      [1, 3], [2, 3], [3, 3], [4, 3]
    ],
    scale: 0.8
  },
  blinker: {
    name: 'blinker',
    coordinates: [
      [0, 0],
      [0, 1],
      [0, 2]
    ],
    scale: 0.8
  },
  pulsar: {
    name: 'pulsar',
    coordinates: [
      [0, 2], [0, 3], [0, 9], [0, 10],
      [1, 3], [1, 4], [1, 8], [1, 9],
      [2, 0], [2, 3], [2, 5], [2, 7], [2, 9], [2, 12],
      [3, 0], [3, 1], [3, 2], [3, 4], [3, 5], [3, 7], [3, 8], [3, 10], [3, 11], [3, 12],
      [4, 1], [4, 3], [4, 5], [4, 7], [4, 9], [4, 11],
      [5, 2], [5, 3], [5, 4], [5, 8], [5, 9], [5, 10],
      [7, 2], [7, 3], [7, 4], [7, 8], [7, 9], [7, 10],
      [8, 1], [8, 3], [8, 5], [8, 7], [8, 9], [8, 11],
      [9, 0], [9, 1], [9, 2], [9, 4], [9, 5], [9, 7], [9, 8], [9, 10], [9, 11], [9, 12],
      [10, 0], [10, 3], [10, 5], [10, 7], [10, 9], [10, 12],
      [11, 3], [11, 4], [11, 8], [11, 9],
      [12, 2], [12, 3], [12, 9], [12, 10],
    ],
    scale: 0.8
  },
  beehive: {
    name: 'beehive',
    coordinates: [
      [1, 0], [2, 0],
      [0, 1], [3, 1],
      [1, 2], [2, 2]
    ],
    scale: 0.8
  },
  tub: {
    name: 'tub',
    coordinates: [
      [1, 0],
      [0, 1], [2, 1],
      [1, 2]
    ],
    scale: 0.8
  },
  puffer1: {
    name: 'puffer1',
    coordinates: [
      [0, 0], [1, 0], [2, 0],
      [0, 1], [2, 1],
      [0, 2], [1, 2], [2, 2],
      [3, 3], [4, 3], [5, 3],
      [3, 4], [5, 4],
      [3, 5], [4, 5], [5, 5]
    ],
    scale: 0.8
  }
};

// Helper function to calculate pattern dimensions
function getPatternDimensions(coordinates: [number, number][]): { width: number, height: number } {
  const minX = Math.min(...coordinates.map(([x]) => x));
  const maxX = Math.max(...coordinates.map(([x]) => x));
  const minY = Math.min(...coordinates.map(([, y]) => y));
  const maxY = Math.max(...coordinates.map(([, y]) => y));
  
  return {
    width: (maxX - minX + 1) * 62, // 50 (cell width) + 12 (gap)
    height: (maxY - minY + 1) * 62
  };
}

// Function to create a pattern object
function createPatternObject(pattern: Pattern, position: [number, number]) {
  const { width, height } = getPatternDimensions(pattern.coordinates);
  const scale = pattern.scale || 0.6;
  
  // Create squares for the pattern
  const squares = pattern.coordinates.map(([x, y]) => {
    const normalizedX = x * 62; // 50 (width) + 12 (gap)
    const normalizedY = y * 62;
    return (
      <Rect
        width={50}
        height={50}
        x={normalizedX}
        y={normalizedY}
        fill={Colors.whiteLabel}
        radius={8}
      />
    );
  });

  return {
    layout: createRef<Layout>(),
    squares,
    position,
    scale,
    width: width * scale,
    height: height * scale,
    name: pattern.name,
    label: createRef<Txt>()
  };
}

// Function to position patterns in a column
function positionPatternsInColumn(patterns: Pattern[], startY: number, margin: number, align: 'left' | 'right' = 'left') {
  let currentY = startY;
  const objects = [];

  for (const pattern of patterns) {
    const obj = createPatternObject(pattern, [0, currentY]);
    currentY += obj.height + margin;
    objects.push(obj);
  }

  return objects;
}

// Function to calculate next state from current boolean grid
function calculateNextState(currentState: boolean[][]): boolean[][] {
  const height = currentState.length;
  const width = currentState[0].length;
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
          if (nx >= 0 && nx < width && ny >= 0 && ny < height && currentState[ny][nx]) {
            count++;
          }
        }
      }
      
      // Apply Game of Life rules
      if (currentState[y][x]) {
        newGrid[y][x] = count === 2 || count === 3;
      } else {
        newGrid[y][x] = count === 3;
      }
    }
  }
  
  return newGrid;
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
  function* updateGrid(currentState: boolean[][], previousState: boolean[][], show_previous: boolean = true, delay: number = 0.5) {
    yield* all(
      ...grid().children().flatMap((row, i) =>
        (row as Layout).children().map((cell, j) => {
          const rect = cell as Rect;
          if (currentState[i][j]) {
            return rect.fill(Colors.whiteLabel, delay);
          } else if (previousState[i][j] && show_previous) {
            return rect.fill('#4c3131', delay); // Red shade for recently dead cells
          } else {
            return rect.fill(Colors.surface, delay);
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

  // Do 10 iterations automatically
  for (let i = 1; i <= 10; i++) {
    yield* updateGrid(
      getGameOfLifeState(semaphore, i),
      getPreviousState(semaphore, i), 
      true,
      0.1
    );
    yield* waitFor(0.2);
  }

  yield* beginSlide('semaphore-after-loop');

  // Clear the grid
  yield* updateGrid(
    Array(23).fill(null).map(() => Array(33).fill(false)),
    Array(23).fill(null).map(() => Array(33).fill(false)),
    false
  );
  yield* beginSlide('clear-grid');

  // Create a glider in the bottom left
  const glider: [number, number][] = [
    [3, 10], [4, 10], [5, 10],  // Horizontal line
    [5, 11],                    // Right cell
    [4, 12]                     // Middle cell
  ];

  yield* updateGrid(
    getGameOfLifeState(glider, 0),
    getPreviousState(glider, 0),
    false
  );
  yield* beginSlide('glider-born');

  // Show first iteration
  yield* updateGrid(
    getGameOfLifeState(glider, 1),
    getPreviousState(glider, 1)
  );
  yield* beginSlide('glider-iteration-1');

  // Show second iteration
  yield* updateGrid(
    getGameOfLifeState(glider, 2),
    getPreviousState(glider, 2)
  );
  yield* beginSlide('glider-iteration-2');

  // Show third iteration
  yield* updateGrid(
    getGameOfLifeState(glider, 3),
    getPreviousState(glider, 3)
  );
  yield* beginSlide('glider-iteration-3');

  // Do 10 more iterations automatically
  for (let i = 4; i <= 40; i++) {
    yield* updateGrid(
      getGameOfLifeState(glider, i),
      getPreviousState(glider, i),
      true,
      0.0
    );
    yield* waitFor(0.1);
  }
  yield* beginSlide('glider-after-loop');

  // Create and show the glider object
  const {gliderLayout, squares} = createGliderObject(glider);
  
  // Add the glider layout to the view
  view.add(
    <Layout
      ref={gliderLayout}
      position={[124, -302]}
      opacity={0}
      scale={1}
    >
      {squares}
    </Layout>
  );

  // Add label
  const gliderLabel = createRef<Txt>();
  view.add(
    <Txt
      ref={gliderLabel}
      {...textStyles.h2}
      position={[300, -302]}
      opacity={0}
      textAlign="left"
    >
      glider
    </Txt>
  );

  // First fade out grid and fade in glider
  yield* all(
    grid().opacity(0, 0.5),
    gliderLayout().opacity(1, 0.5)
  );
  
  // Then move and scale glider
  gliderLabel().position([-850 + (62 * 5 * 0.6) + 50, -302]); // glider position + width + margin
  yield* all(
    gliderLayout().position([-850, -302], 0.5), // -1920/2 + 50 + (62 * 5)/2
    gliderLayout().scale(0.8, 0.5),
  );
  yield* gliderLabel().opacity(1, 0.5)
  yield* beginSlide('glider-with-label');

  // Create and position all objects
  const margin = 80;

  // Create pattern objects with direct positioning
  const spaceshipObj = createPatternObject(patterns.spaceship, [-view.width()/2 + margin, -view.height()/2 + 520]);
  view.add(
    <Layout
      ref={spaceshipObj.layout}
      position={spaceshipObj.position}
      scale={spaceshipObj.scale}
      opacity={0}
    >
      {spaceshipObj.squares}
    </Layout>
  );
  view.add(
    <Txt
      ref={spaceshipObj.label}
      {...textStyles.h2}
      position={[-view.width()/2 + 420, -view.height()/2 + 500]}
      opacity={0}
      textAlign="left"
    >
      spaceship
    </Txt>
  );

  const blinkerObj = createPatternObject(patterns.blinker, [-view.width()/2 + margin + 100, -view.height()/2 + 880]);
  view.add(
    <Layout
      ref={blinkerObj.layout}
      position={blinkerObj.position}
      scale={blinkerObj.scale}
      opacity={0}
    >
      {blinkerObj.squares}
    </Layout>
  );
  view.add(
    <Txt
      ref={blinkerObj.label}
      {...textStyles.h2}
      position={[-view.width()/2 + 350, -view.height()/2 + 880]}
      opacity={0}
      textAlign="left"
    >
      blinker
    </Txt>
  );

  const beehiveObj = createPatternObject(patterns.beehive, [view.width()/2 - margin - 150, -view.height()/2 + margin + 160]);
  view.add(
    <Layout
      ref={beehiveObj.layout}
      position={beehiveObj.position}
      scale={beehiveObj.scale}
      opacity={0}
    >
      {beehiveObj.squares}
    </Layout>
  );
  view.add(
    <Txt
      ref={beehiveObj.label}
      {...textStyles.h2}
      position={[view.width()/2 - margin - 310, -view.height()/2 + margin + 210]}
      opacity={0}
      textAlign="left"
    >
      beehive
    </Txt>
  );

  const tubObj = createPatternObject(patterns.tub, [view.width()/2 - margin - 150, -view.height()/2 + margin + 440]);
  view.add(
    <Layout
      ref={tubObj.layout}
      position={tubObj.position}
      scale={tubObj.scale}
      opacity={0}
    >
      {tubObj.squares}
    </Layout>
  );
  view.add(
    <Txt
      ref={tubObj.label}
      {...textStyles.h2}
      position={[view.width()/2 - margin - 270, -view.height()/2 + margin + 485]}
      opacity={0}
      textAlign="left"
    >
      tub
    </Txt>
  );

  const pufferObj = createPatternObject(patterns.puffer1, [view.width()/2 - margin - 250, -view.height()/2 + margin + 660]);
  view.add(
    <Layout
      ref={pufferObj.layout}
      position={pufferObj.position}
      scale={pufferObj.scale}
      opacity={0}
    >
      {pufferObj.squares}
    </Layout>
  );
  view.add(
    <Txt
      ref={pufferObj.label}
      {...textStyles.h2}
      position={[view.width()/2 - margin - 270, -view.height()/2 + margin + 860]}
      opacity={0}
      textAlign="left"
    >
      puffer
    </Txt>
  );

  const pulsarObj = createPatternObject(patterns.pulsar, [-305, -view.height()/2 + 380]);
  view.add(
    <Layout
      ref={pulsarObj.layout}
      position={pulsarObj.position}
      scale={pulsarObj.scale}
      opacity={0}
    >
      {pulsarObj.squares}
    </Layout>
  );
  view.add(
    <Txt
      ref={pulsarObj.label}
      {...textStyles.h2}
      position={[0, -210]}
      opacity={0}
      textAlign="center"
    >
      pulsar
    </Txt>
  );

  // Animate all objects appearing
  yield* all(
    spaceshipObj.layout().opacity(1, 0.5),
    spaceshipObj.label().opacity(1, 0.5),
    blinkerObj.layout().opacity(1, 0.5),
    blinkerObj.label().opacity(1, 0.5),
    pulsarObj.layout().opacity(1, 0.5),
    pulsarObj.label().opacity(1, 0.5),
    beehiveObj.layout().opacity(1, 0.5),
    beehiveObj.label().opacity(1, 0.5),
    tubObj.layout().opacity(1, 0.5),
    tubObj.label().opacity(1, 0.5),
    pufferObj.layout().opacity(1, 0.5),
    pufferObj.label().opacity(1, 0.5)
  );

  yield* beginSlide('all-objects');

  // Clear the view for the next slide
  yield* all(
    spaceshipObj.layout().opacity(0, 0.5),
    spaceshipObj.label().opacity(0, 0.5),
    blinkerObj.layout().opacity(0, 0.5),
    blinkerObj.label().opacity(0, 0.5),
    pulsarObj.layout().opacity(0, 0.5),
    pulsarObj.label().opacity(0, 0.5),
    beehiveObj.layout().opacity(0, 0.5),
    beehiveObj.label().opacity(0, 0.5),
    tubObj.layout().opacity(0, 0.5),
    tubObj.label().opacity(0, 0.5),
    pufferObj.layout().opacity(0, 0.5),
    pufferObj.label().opacity(0, 0.5),

    // Clearing the glider as well.
    gliderLayout().opacity(0, 0.5),
    gliderLabel().opacity(0, 0.5) ,

    title().opacity(0, 0.5)
  );

  // Create a new grid for the running simulation
  const runningGrid = createRef<Layout>();
  view.add(
    <Layout
      ref={runningGrid}
      direction="column"
      gap={12}
      alignItems="center"
      position={[0, 0]}
      opacity={0}
      scale={0.5}
      layout
    >
      {Array.from({length: 33}, (_, i) => (
        <Layout
          key={"loop-row-" + i.toString()}
          direction="row"
          gap={12}
          alignItems="center"
        >
          {Array.from({length: 43}, (_, j) => (
            <Rect
              key={`loop-${i}-${j}`}
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

  // Fade in the grid
  yield* runningGrid().opacity(1, 0.5);

  // Create a random initial state
  const randomState: [number, number][] = [];
  for (let i = 0; i < 33; i++) {
    for (let j = 0; j < 43; j++) {
      if (Math.random() < 0.3) { // 30% chance of being alive
        randomState.push([j, i]);
      }
    }
  }

  // Function to update the grid with a given state
  function* updateRunningGrid(currentState: boolean[][], previousState: boolean[][], show_previous: boolean = true, delay: number = 0.5) {
    yield* all(
      ...runningGrid().children().flatMap((row, i) =>
        (row as Layout).children().map((cell, j) => {
          const rect = cell as Rect;
          if (currentState[i][j]) {
            return rect.fill(Colors.whiteLabel, delay);
          } else if (previousState[i][j] && show_previous) {
            return rect.fill('#4c3131', delay); // Red shade for recently dead cells
          } else {
            return rect.fill(Colors.surface, delay);
          }
        })
      )
    );
  }
  
  // set the random state to the grid
  yield* updateRunningGrid(getGameOfLifeState(randomState, 0), getPreviousState(randomState, 0), false, 0);

  yield* beginSlide('grid-in');
  
  yield* waitFor(0.5);
 

  // Run the simulation until the next slide
  let currentState = getGameOfLifeState(randomState, 0);
  yield loop(function* () {
    currentState = calculateNextState(currentState);
    yield* updateRunningGrid(currentState, currentState, false, 0.1);
    yield* waitFor(0.2);
  });

  yield* beginSlide('end-loop');

}); 