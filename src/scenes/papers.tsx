import {makeScene2D, Txt, Rect} from '@motion-canvas/2d';
import {all, createRef, beginSlide} from '@motion-canvas/core';
import {Colors, textStyles} from './shared';

export default makeScene2D(function* (view) {
  const title = createRef<Txt>();
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
      opacity={1}
      zIndex={1}
    >
      The Paper
    </Txt>
  );

  // Initial state
  yield* title().text("The Paper(s)", 0.5);
  yield* beginSlide('title');

  // Add (s) to the title
  yield* title().position([0, -view.height()/2 + 150], 1);
  yield* beginSlide('title-top');
}); 