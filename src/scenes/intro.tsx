import {makeScene2D, Txt, Layout, Rect} from '@motion-canvas/2d';
import {all, createRef, beginSlide, waitFor, loop, loopFor} from '@motion-canvas/core';
import {Colors, textStyles} from './shared';

export default makeScene2D(function* (view) {
  view.lineHeight(64);
  const title = createRef<Txt>();
  const computational = createRef<Txt>();
  const abstract = createRef<Txt>();
  const discrete = createRef<Txt>();
  const emergent = createRef<Txt>();
  const wordsLayout = createRef<Layout>();
  const background = createRef<Rect>();
  const soloCell = createRef<Rect>();
  const grid = createRef<Layout>();

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
      Cellular Automata
    </Txt>
  );


  // Solo Cell (before the grid)
  view.add(
      <Rect
        ref={soloCell}
        width={80}
        height={80}
        fill={Colors.whiteLabel}
        radius={8}
        opacity={0}
        position={[0, 70]}
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
      {Array.from({length: 5}, (_, i) => (
        <Layout
          key={i.toString()}
          direction="row"
          gap={12}
          alignItems="center"
        >
          {Array.from({length: 5}, (_, j) => (
            <Rect
              key={`${i}-${j}`}
              width={80}
              height={80}
              fill={Colors.surface}
              radius={8}
            />
          ))}
        </Layout>
      ))}
    </Layout>
  );

  // Three words
  view.add(
    <Layout 
      ref={wordsLayout} 
      direction="column" 
      gap={60} 
      alignItems="center" 
      position={[0, 50]}
      layout
    >
      <Txt
        ref={computational}
        {...textStyles.h2}
        fill={Colors.TEXT}
      >
        Computational
      </Txt>
      <Txt
        ref={abstract}
        {...textStyles.h2}
        fill={Colors.TEXT}
      >
        Abstract
      </Txt>
      <Txt
        ref={discrete}
        {...textStyles.h2}
        fill={Colors.TEXT}
      >
        Discrete
      </Txt>
    </Layout>
  );

  // Emergent behavior
  view.add(
    <Txt
      ref={emergent}
      {...textStyles.h2}
      opacity={0}
      position={[0, 350]}
    >
      Emergent Behaviour
    </Txt>
  );

  // Initial state
  title().opacity(0);
  wordsLayout().opacity(0);
  grid().opacity(0);

  // First slide: Title centered
  yield* title().opacity(1, 1);
  yield* beginSlide('title');

  // Move up the title
  yield* title().position([0, -view.height()/2 + 150], 1);
 
  // Show a single cell
  yield* soloCell().opacity(1, 0.5);
  yield* beginSlide('solo-cell');

  // Solo cells blinks for a bit
  yield* loop(3, function* () {
    yield* soloCell().fill(Colors.surface, .5);  
    yield* soloCell().fill(Colors.whiteLabel, .5);  
  });

  yield* beginSlide('solo-cell-blink ');

  // Make only central cell alive initially
  const centerCell = grid().children()[2].children()[2] as Rect;
  centerCell.fill(Colors.whiteLabel);

  yield* all(
    grid().opacity(1, 0.5),
    soloCell().opacity(0, 0.5)
  );

  yield* beginSlide('other-cells');

   // Show a label with a t_0:
   const t0 = createRef<Txt>();
   view.add(
     <Txt
       ref={t0}
       {...textStyles.h2}
       fill={Colors.TEXT}
       position={[0, 350]}
       opacity={0}
     >
       t = 0 
     </Txt>
   );
  
  // Activate more cells to form a pattern
  yield* all(
    t0().opacity(1, 0.5),
    (grid().children()[1].children()[4] as Rect).fill(Colors.whiteLabel, 0.5),
    (grid().children()[3].children()[0] as Rect).fill(Colors.whiteLabel, 0.5),
    (grid().children()[4].children()[1] as Rect).fill(Colors.whiteLabel, 0.5),
    (grid().children()[0].children()[2] as Rect).fill(Colors.whiteLabel, 0.5),
  );

 
  yield* beginSlide('random-values');

  yield* all(
    (grid().children()[1].children()[4] as Rect).fill(Colors.whiteLabel, 0.5),
    (grid().children()[3].children()[0] as Rect).fill(Colors.surface, 0.5),
    (grid().children()[3].children()[1] as Rect).fill(Colors.whiteLabel, 0.5),
    (grid().children()[4].children()[1] as Rect).fill(Colors.whiteLabel, 0.5),
    (grid().children()[0].children()[2] as Rect).fill(Colors.surface, 0.5),
    (grid().children()[1].children()[1] as Rect).fill(Colors.whiteLabel, 0.5),
    t0().text("t = 1", 0.3),
  );
  yield* beginSlide('random-values-after');

  yield* all(
    (grid().children()[1].children()[4] as Rect).fill(Colors.surface, 0.5),
    (grid().children()[2].children()[2] as Rect).fill(Colors.surface, 0.5),
    (grid().children()[3].children()[1] as Rect).fill(Colors.whiteLabel, 0.5),
    (grid().children()[4].children()[1] as Rect).fill(Colors.surface, 0.5),
    (grid().children()[1].children()[1] as Rect).fill(Colors.whiteLabel, 0.5),
    (grid().children()[3].children()[3] as Rect).fill(Colors.whiteLabel, 0.5),
    (grid().children()[4].children()[4] as Rect).fill(Colors.whiteLabel, 0.5),
    t0().text("t = 2", 0.3),
  );
  yield* beginSlide('random-values-after-after');

  // Hide grid and caption
  yield* all(
    grid().opacity(0, 0.5),
    t0().opacity(0, 0.5),
  );

  // Move title up and show all words
  yield* wordsLayout().opacity(1, 0.5)
  yield* beginSlide('words');

  // Highlight words sequentially
  yield* computational().fill('#ff6b6b', 0.5);
  yield* beginSlide('highlight-computational');

  yield* all(
    computational().fill(Colors.TEXT, 0.5),
    abstract().fill('#ff6b6b', 0.5)
  );
  yield* beginSlide('highlight-abstract');

  yield* all(
    abstract().fill(Colors.TEXT, 0.5),
    discrete().fill('#ff6b6b', 0.5)
  );
  yield* beginSlide('highlight-discrete');

  // Show emergent behavior and move words up
  yield* all(
    discrete().fill(Colors.TEXT, 0.5),
    emergent().opacity(1, 0.5),
    wordsLayout().position.y(-30, 0.5)
  );
  yield* beginSlide('emergent');

  // First fade out everything except title
  yield* all(
    wordsLayout().opacity(0, 0.5),
    emergent().opacity(0, 0.5)
  );
  

  // Then move title back to center and change text
  yield* all(
    title().position.y(0, 1),
    title().text("One Dimension", 1)
  );
  yield* beginSlide('transition-to-one-dimension');
}); 