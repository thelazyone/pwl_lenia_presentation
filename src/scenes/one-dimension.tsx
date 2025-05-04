import {makeScene2D, Txt, Layout, Rect} from '@motion-canvas/2d';
import {all, createRef, beginSlide, waitFor} from '@motion-canvas/core';
import {Colors, textStyles} from './shared';

export default makeScene2D(function* (view) {
  view.lineHeight(64);
  const title = createRef<Txt>();
  const description = createRef<Layout>();
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
      position={[0, -view.height()/2 + 300]}
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

  // Initial state
  title().opacity(1);
  description().opacity(0);

  // First slide: Move title up and description
  yield* title().position.y(-view.height()/2 + 150, 1);
  yield* description().opacity(1, .5);
  yield* beginSlide('description');
}); 