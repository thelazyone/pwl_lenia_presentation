import {makeScene2D, Rect} from '@motion-canvas/2d';
import {all, createRef, beginSlide, waitFor, loopUntil, loopFor, loop} from '@motion-canvas/core';
import {Colors} from './shared';

export default makeScene2D(function* (view) {

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

  // Create a square
  const square = createRef<Rect>();
  view.add(
    <Rect
      ref={square}
      width={200}
      height={200}
      fill={Colors.whiteLabel}
      radius={8}
      opacity={0}
    />
  );

  // First slide: show the square
  yield* beginSlide('show-square');
  yield* square().opacity(1, 0.5);

  // Second slide: make it blink until next slide
  yield* beginSlide('blink-square');
  
  // // Blink until next slide
  // yield* loopFor(999, function* () {
  //   yield* square().opacity(0, 0.2);
  //   yield* waitFor(0.2);
  //   yield* square().opacity(1, 0.2);
  //   yield* waitFor(0.2);
  // });

  var light_counter = 0;
  yield loop(function* () {
    light_counter += 10;
    yield* square().opacity(0, 0.1);
    yield* square().position([light_counter, 1], 0);
    // TODO SET COLOR HERE
    yield* waitFor(0.01);
    yield* square().opacity(1, 0.);
    yield* waitFor(0.01);
  });

  // Third slide: make it solid again
  yield* beginSlide('solid-square');
  yield* square().opacity(1, 0.5);

  // Wait a bit before ending
  yield* waitFor(1);
}); 