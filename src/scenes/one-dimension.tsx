import {makeScene2D, Txt, Layout, Rect, Node} from '@motion-canvas/2d';
import {all, createRef, beginSlide, waitFor} from '@motion-canvas/core';
import {Colors, textStyles} from './shared';

// Wolfram Rule 30 implementation
function getWolframState(iteration: number): boolean[] {
  // Start with a single cell in the middle
  const size =23;
  let state = new Array(size).fill(false);
  state[Math.floor(size/2)] = true;

  // Apply Rule 30 for each iteration
  for (let i = 0; i < iteration; i++) {
    const newState = new Array(size).fill(false);
    for (let j = 1; j < size - 1; j++) {
      const left = state[j-1];
      const center = state[j];
      const right = state[j+1];
      
      // Rule 30: □□■, ■□□, □■□, or □■■
      newState[j] = (!left && !center && right) || 
                    (left && !center && !right) || 
                    (!left && center && !right) || 
                    (!left && center && right);
    }
    state = newState;
  }
  return state;
}

export default makeScene2D(function* (view) {
  view.lineHeight(64);
  const title = createRef<Txt>();
  const description = createRef<Layout>();
  const automata = createRef<Layout>();
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
      One Dimension
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
        Steven Wolfram's Elementary Cellular Automata
      </Txt>
      <Txt {...textStyles.body} textAlign="center">
        Alive if □□■,  ■□□,  □■□, or  □■■ (asymmetric!)
      </Txt>
    </Layout>
  );

  // Single line visualization
  view.add(
    <Layout
      ref={automata}
      direction="row"
      gap={12}
      alignItems="center"
      position={[0, 100]}
      opacity={0}
      layout
    >
      {getWolframState(0).map((alive, i) => (
        <Rect
          key={"single_line_"+i.toString()}
          width={50}
          height={50}
          fill={alive ? Colors.whiteLabel : Colors.surface}
          radius={8}
        />
      ))}
    </Layout>
  );

  // Grid visualization (without bottom row)
  view.add(
    <Layout
      ref={grid}
      direction="column"
      gap={12}
      alignItems="center"
      position={[0, 150]}
      opacity={0}
      scale={1}
      layout
    >
      {Array.from({length: 10}, (_, i) => (
        <Layout
          key={"grid_row_"+i.toString()}
          direction="row"
          gap={12}
          alignItems="center"
        >
          {getWolframState(i).map((alive, j) => (
            <Rect
              key={"grid_cell_"+i.toString()+"_"+j.toString()}
              width={50}
              height={50}
              fill={alive ? Colors.whiteLabel : Colors.surface}
              radius={8}
            />
          ))}
        </Layout>
      ))}
    </Layout>
  );

  // Initial state
  title().opacity(1);
  description().opacity(0);
  automata().opacity(0);
  grid().opacity(0);

  // First slide: Move title up and show description
  yield* title().position.y(-view.height()/2 + 150, 1)
  yield* description().opacity(1, 0.5)
  yield* beginSlide('description');

  // Show automata
  yield* automata().opacity(1, 0.5);
  yield* beginSlide('show-automata');

  // Animate through iterations
  for (let i = 1; i <= 3; i++) {
    const newState = getWolframState(i);
    yield* all(
      ...automata().children().map((cell, j) => 
        (cell as Rect).fill(newState[j] ? Colors.whiteLabel : Colors.surface, 0.5)
      )
    );
    yield* beginSlide(`iteration-${i.toString()}`);
  }

  // Do another 4 iterations automatically
  for (let i = 4; i <= 9; i++) {
    const newState = getWolframState(i);
    yield* all(
      ...automata().children().map((cell, j) => 
        (cell as Rect).fill(newState[j] ? Colors.whiteLabel : Colors.surface, 0.35)
      )
    );
  }

  yield* beginSlide('group-of-all');

  // First move the automata down, then fade out automata while showing grid
  yield* automata().position.y(430, 1);
  yield* all(
    automata().opacity(0, 1),
    grid().opacity(1, 1)
  );

  yield* beginSlide('end');

  // First fade out everything except title
  yield* all(
    description().opacity(0, 0.5),
    grid().opacity(0, 0.5)
  );

  // Then move title back to center and change text
  yield* all(
    title().position.y(0, 1),
    title().text("Game of Life", 1)
  );
  yield* beginSlide('transition-to-game-of-life');
}); 