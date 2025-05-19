import {makeScene2D, Txt, Rect, Circle, Img} from '@motion-canvas/2d';
import {all, createRef, beginSlide} from '@motion-canvas/core';
import {Colors, textStyles} from './shared';

import smoothLifeAbstract from '../images/smoothlife_abstract.jpg';
import outerFilling from '../images/outer_filling.jpg';
import innerFilling from '../images/inner_filling.jpg';
import smootherLife from '../images/smoother_life.jpg';

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
      Conclusions
    </Txt>
  );


  // Move up as usual
  yield* title().position([0, -view.height()/2 + 150], 1);
  yield* beginSlide('title-top');


  yield* beginSlide('closing-before-transition');

  yield* all(
    // Closing stuff

  )


  
  yield* all(
    title().position.y(0, 1),
    title().text("The End", 1)
  );
  yield* beginSlide('The End');

}); 