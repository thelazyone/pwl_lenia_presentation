import {makeScene2D, Txt, Rect, Layout, Img} from '@motion-canvas/2d';
import {all, createRef, beginSlide, waitFor} from '@motion-canvas/core';
import {Colors, textStyles} from './shared';
import distancePattern from '../images/distance-pattern.png';

// Function to generate a bitmap using Canvas
function generateDistanceBitmap(size: number, maxRange: number, peakDistance: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  const cellSize = 50;
  canvas.width = size * cellSize;
  canvas.height = size * cellSize;
  const ctx = canvas.getContext('2d')!;
  
  // Fill background
  ctx.fillStyle = Colors.surface;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw the distance-based pattern
  const center = Math.floor(size / 2);
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const distance = Math.sqrt(Math.pow(i - center, 2) + Math.pow(j - center, 2));
      const intensity = Math.max(0, Math.min(1, 1 - Math.abs(peakDistance - distance)));
      
      if (intensity > 0) {
        ctx.fillStyle = `rgba(255, 49, 49, ${intensity})`;
        ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
      }
    }
  }
  
  return canvas;
}

// Function to create a continuous grid
function createContinuousGrid(scale: number = 1) {
  const grid = createRef<Img>();
  const totalSize = 700; // Size of the image
  
  return {
    grid,
    element: (
      <Img
        ref={grid}
        src={distancePattern}
        width={totalSize}
        height={totalSize}
        position={[0, 100]}
        opacity={0}
        scale={scale}
      />
    )
  };
}

// Function to create a grid with distance-based coloring
function createDistanceGrid(size: number, maxRange: number, peakDistance: number, scale: number = 1) {
  const grid = createRef<Layout>();
  const center = Math.floor(size / 2);
  
  return {
    grid,
    element: (
      <Layout
        ref={grid}
        direction="column"
        gap={12}
        alignItems="center"
        position={[0, 100]}
        opacity={0}
        scale={scale}
        layout
      >
        {Array.from({length: size}, (_, i) => (
          <Layout
            key={"cont_grid_row_" + i.toString() + size.toString() + peakDistance.toString()}
            direction="row"
            gap={12}
            alignItems="center"
          >
            {Array.from({length: size}, (_, j) => {
              const isCenter = i === center && j === center;
              const distance = Math.sqrt(Math.pow(i - center, 2) + Math.pow(j - center, 2));
              const isNeighbor = distance <= maxRange && !isCenter;
              const intensity = isNeighbor ? Math.max(0, Math.min(1, 1 - Math.abs(peakDistance - distance))) : 0;
              const color = isCenter ? Colors.whiteLabel : 
                           isNeighbor ? `rgb(${76 + Math.floor(intensity * 179)}, ${49 + Math.floor(intensity * 49)}, ${49 + Math.floor(intensity * 49)})` : 
                           Colors.surface;
              return (
                <Rect
                  key={"cont_grid_cell_" + `${i}-${j}` + size.toString() + peakDistance.toString()}
                  width={50}
                  height={50}
                  fill={color}
                  radius={8}
                />
              );
            })}
          </Layout>
        ))}
      </Layout>
    )
  };
}

export default makeScene2D(function* (view) {
  view.lineHeight(64);
  const title = createRef<Txt>();
  const rulesLayout = createRef<Layout>();
  const conclusionLayout = createRef<Layout>();
  const discreteSpace = createRef<Txt>();
  const discreteTime = createRef<Txt>();
  const discreteStates = createRef<Txt>();
  const localInteraction = createRef<Txt>();
  const discreteDynamics = createRef<Txt>();
  const smallGrid = createRef<Layout>();
  const background = createRef<Rect>();

  // Add background
  view.add(
    <Rect
      ref={background}
      width={1920}
      height={1080}
      fill={Colors.background}
      zIndex={-1}
    />
  );

  // Title
  view.add(
    <Txt
      ref={title}
      {...textStyles.h1}
      position={[0, 0]}
      opacity={0}
      zIndex={1}
    >
      Continuous Space
    </Txt>
  );

  // Rules Layout
  view.add(
    <Layout
      ref={rulesLayout}
      direction="column"
      gap={20}
      alignItems="center"
      position={[0, -view.height()/2 + 285]}
      opacity={0}
      layout
      zIndex={1}
    >
      <Layout direction="row" gap={40} alignItems="center">
        <Txt ref={discreteSpace} {...textStyles.body} textAlign="center">
          Discrete Space
        </Txt>
        <Txt ref={discreteTime} {...textStyles.body} textAlign="center">
          Discrete Time
        </Txt>
        <Txt ref={discreteStates} {...textStyles.body} textAlign="center">
          Discrete States
        </Txt>
      </Layout>
      <Layout direction="row" gap={40} alignItems="center">
        <Txt 
          ref={localInteraction} 
          {...textStyles.body} 
          textAlign="center"
        >
          Local Interaction
        </Txt>
        <Txt ref={discreteDynamics} {...textStyles.body} textAlign="center">
          Discrete Dynamics
        </Txt>
      </Layout>
    </Layout>
  );

  // Small Grid (5x5)
  view.add(
    <Layout
      ref={smallGrid}
      direction="column"
      gap={12}
      alignItems="center"
      position={[0, 100]}
      opacity={0}
      layout
      zIndex={0}
    >
      {Array.from({length: 5}, (_, i) => (
        <Layout
          key={i.toString()}
          direction="row"
          gap={12}
          alignItems="center"
        >
          {Array.from({length: 5}, (_, j) => {
            const isCenter = i === 2 && j === 2;
            const isNeighbor = Math.abs(i - 2) <= 1 && Math.abs(j - 2) <= 1 && !isCenter;
            return (
              <Rect
                key={`${i}-${j}`}
                width={50}
                height={50}
                fill={isCenter ? Colors.whiteLabel : isNeighbor ? '#4c3131' : Colors.surface}
                radius={8}
              />
            );
          })}
        </Layout>
      ))}
    </Layout>
  );

  // Create grids with different parameters
  const {grid: largeGridFlat, element: largeGridFlatElement} = createDistanceGrid(13, 5.1, 999, 0.5);
  const {grid: largeGrid, element: largeGridElement} = createDistanceGrid(13, 5.1, 3, 0.5);
  const {grid: hugeGrid, element: hugeGridElement} = createDistanceGrid(31, 5.1, 3, 0.5);
  const {grid: hugeGridWide, element: hugeGridWideElement} = createDistanceGrid(31, 12.2, 8, 0.5);
  const {grid: continuousGrid, element: continuousGridElement} = createContinuousGrid(0.5);
  
  view.add(largeGridElement);
  view.add(hugeGridElement);
  view.add(hugeGridWideElement);
  view.add(largeGridFlatElement);
  view.add(continuousGridElement);

  // Initial state
  title().opacity(1);
  yield* title().position([0, -view.height()/2 + 150], 1)
  yield* rulesLayout().opacity(1, 0.5);
  yield* beginSlide('rules');

  // Show small grid
  yield* smallGrid().opacity(1, 0.5);
  yield* beginSlide('small-grid');

  // Showing a larger grid, first resizing the current one and then replacing it with a double fade.
  yield* smallGrid().scale(0.5, 0.5);

  yield* all(
    smallGrid().opacity(0, 0.5),
    largeGridFlat().opacity(1, 0.5),
    localInteraction().fill('#683535', 0.5)
  );
  yield* beginSlide('large-grid');

  yield* all(
    largeGridFlat().opacity(0, 0.5),
    largeGrid().opacity(1, 0.5),
    discreteDynamics().fill('#683535', 0.5)
  );

  yield* beginSlide('large-grid-ring');


  yield* discreteStates().fill('#683535', 0.5)
  yield* beginSlide('no-states');

  // Huge grid is in a smaller scale!
  hugeGrid().scale(0.2);
  hugeGridWide().scale(0.2);

  // First shrink the large grid
  yield* largeGrid().scale(0.2, 0.5);
  // Then transition to the huge grid
  yield* all(
    largeGrid().opacity(0, 0.5),
    hugeGrid().opacity(1, 0.5),
  );
  // Transition to the wider range grid
  yield* all(
    hugeGrid().opacity(0, 0.5),
    hugeGridWide().opacity(1, 0.5)
  );

  yield* beginSlide('large-grid-ringawdawd');

  // Transition to the continuous grid
  yield* all(
    hugeGridWide().opacity(0, 0.5),
    continuousGrid().opacity(1, 0.5),
    discreteSpace().fill('#683535', 0.5),
    discreteTime().fill('#683535', 0.5)
  );

  yield* beginSlide('continuous-grid');


  

  yield* continuousGrid().position([0, 0], 0.5);

  // Add conclusion text
  const conclusionTitle = createRef<Txt>();
  const conclusionTitle2 = createRef<Txt>();
  const conclusionSubtitle = createRef<Txt>();

  view.add(
    <Layout
      ref={conclusionLayout}
      direction="column"
      gap={20}
      alignItems="center"
      position={[0, 290]}
      opacity={0}
      layout
      zIndex={1}
    >
      <Txt
        ref={conclusionTitle}
        {...textStyles.h2}
        opacity={1}
        textAlign="center"
      >
        fundamentally different
      </Txt>
      <Txt
        ref={conclusionTitle2}
        {...textStyles.h2}
        opacity={0}
        textAlign="center"
      >
        also fundamentally similar
      </Txt>
      <Txt
        ref={conclusionSubtitle}
        {...textStyles.body}
        opacity={0}
        textAlign="center"
      >
        abstract and deterministic
      </Txt>
    </Layout>
  );

  yield* conclusionLayout().opacity(1, 0.5);

  yield* beginSlide('conclusions');

  yield* all(
    conclusionTitle2().opacity(1, 0.5),
    conclusionSubtitle().opacity(1, 0.5),
  );

  yield* beginSlide('conclusions2');

  yield* all(
    continuousGrid().opacity(0, 0.5),
    conclusionLayout().opacity(0, 0.5),
    rulesLayout().opacity(0, 0.5),
  );


  // Then move title back to center and change text
  yield* all(
    title().position.y(0, 1),
    title().text("The Paper", 1)
  );
  yield* beginSlide('transition-to-papers');
}); 