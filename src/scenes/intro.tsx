import {makeScene2D, Txt, Layout, Rect} from '@motion-canvas/2d';
import {all, createRef, beginSlide, waitFor} from '@motion-canvas/core';
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
      fill={Colors.TEXT}
      opacity={0}
      position={[0, 350]}
    >
      Emergent Behaviour
    </Txt>
  );

  // Initial state
  title().opacity(0);
  wordsLayout().opacity(0);

  // First slide: Title centered
  yield* title().opacity(1, 1);
  yield* beginSlide('title');

  // Second slide: Move title up and show all words
  yield* all(
    title().position.y(-view.height()/2 + 150, 1),
    wordsLayout().opacity(1, 0.5)
  );
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
}); 