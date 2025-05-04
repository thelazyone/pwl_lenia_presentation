import {makeScene2D, Txt, Layout, Rect} from '@motion-canvas/2d';
import {all, createRef, beginSlide, waitFor} from '@motion-canvas/core';
import {Colors, textStyles} from './shared';

export default makeScene2D(function* (view) {
  view.lineHeight(64);
  const title = createRef<Txt>();
  const subtitle = createRef<Txt>();
  const definition = createRef<Txt>();
  const layout = createRef<Layout>();
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

  view.add(
    <Layout ref={layout} direction="column" gap={40} layout>
      <Txt
        ref={title}
        {...textStyles.h1}
      >
        Cellular Automata
      </Txt>
      <Txt
        ref={subtitle}
        {...textStyles.h2}
      >
        Discrete - Abstract - Computational
      </Txt>
      <Txt
        ref={definition}
        {...textStyles.body}
        maxWidth={1000}
        textAlign="center"
      >
        A discrete computational model of a graph (usually a grid) that evolves over discrete time steps based on the state of the previous iteration.
      </Txt>
    </Layout>
  );

  // Initial state
  title().opacity(0);
  subtitle().opacity(0);
  definition().opacity(0);

  // First slide: Title
  yield* title().opacity(1, 1);
  yield* beginSlide('title');

  // Second slide: Subtitle
  yield* subtitle().opacity(1, 1);
  yield* beginSlide('subtitle');

  // Third slide: Definition
  yield* definition().opacity(1, 1);
  yield* beginSlide('definition');
}); 