import {makeScene2D, Txt, Layout, Rect} from '@motion-canvas/2d';
import {all, createRef, beginSlide, waitFor} from '@motion-canvas/core';
import {Colors, textStyles} from './shared';

export default makeScene2D(function* (view) {
  view.lineHeight(64);
  const title = createRef<Txt>();
  const description = createRef<Txt>();
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
        One-Dimensional Cellular Automata
      </Txt>
      <Txt
        ref={description}
        {...textStyles.body}
        maxWidth={1000}
        textAlign="center"
      >
        Steven Wolfram's Elementary Cellular Automata: A single line of cells starting with ONE cell alive, expanding in a noisy yet deterministic way.
      </Txt>
    </Layout>
  );

  // Initial state
  title().opacity(0);
  description().opacity(0);

  // First slide: Title
  yield* title().opacity(1, 1);
  yield* beginSlide('title');

  // Second slide: Description
  yield* description().opacity(1, 1);
  yield* beginSlide('description');
}); 