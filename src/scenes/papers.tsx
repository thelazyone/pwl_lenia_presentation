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
      The Paper
    </Txt>
  );

  // Add (s) to the title
  yield* title().text("The Paper(s)", 0.5);
  yield* beginSlide('title');

  // Move up as usual
  yield* title().position([0, -view.height()/2 + 150], 1);

  // Add two big text labels
  const smoothLifeLabel = createRef<Txt>();
  const leniaLabel = createRef<Txt>();
  view.add(
    <Txt
      ref={smoothLifeLabel}
      {...textStyles.h2}  
      position={[-300, 0]}
      opacity={0}
      zIndex={1}
    >
      SmoothLife (2011)
    </Txt>  
  );

  view.add(
    <Txt
      ref={leniaLabel}
      {...textStyles.h2}  
      position={[300, 0]}
      opacity={0}
      zIndex={1}
    >
      Lenia (2018)
    </Txt>
  );

  yield* all(
    smoothLifeLabel().opacity(1, .5),
    leniaLabel().opacity(1, .5),
  );
  yield* beginSlide('two-papers');


  yield* leniaLabel().opacity(0.5, .5);
  yield* all(
    smoothLifeLabel().position([- view.width()/2 + 80 + smoothLifeLabel().width()/2, -view.height()/2 + 220], 1),
    leniaLabel().opacity(0.0, .5),
  );
  yield* title().text("The Paper", 1);


  yield* beginSlide('focus-on-smoothlife');

  // Add the abstract image
  const smoothLifeAbstractImage = createRef<Img>();
  view.add(
    <Img
      ref={smoothLifeAbstractImage}
      src={smoothLifeAbstract}
      position={[0,15]}
      opacity={0} 
      width={1100}
      height={550}
    />
  );
  yield* smoothLifeAbstractImage().opacity(1, 1);

  yield* beginSlide('smoothlife-formulas');

  const innerFillingImage  = createRef<Img>();
  const outerFillingImage = createRef<Img>();

  view.add(
    <Img
      ref={innerFillingImage}
      src={innerFilling}
      position={[-350, 410]}
      opacity={0}   
      width={600}
      height={150}
    />
  );  

  view.add(
    <Img
      ref={outerFillingImage}
      src={outerFilling}
      position={[350, 410]}
      opacity={0}
      width={600}
      height={150}
    />
  );  

  yield* all(
    innerFillingImage().opacity(1, 1),
    outerFillingImage().opacity(1, 1),
  );  

  yield* beginSlide('all-paper-shown');

  // Now fading out the main abstract, fading in a circle and a ring, both centered, one orange and one blue.
  yield* smoothLifeAbstractImage().opacity(0, 1);

  const innerCircle = createRef<Rect>();
  const innerCircleBlack = createRef<Rect>();
  const outerRing = createRef<Rect>();


  view.add(
    <Circle
      ref={innerCircle}
      position={[0, 0]}
      opacity={0}
      width={200}
      height={200}
      zIndex={2}
      fill="#ffc66d"
    /> 
  );
  view.add(
    <Circle
      ref={innerCircleBlack}
      position={[0, 0]}
      opacity={0}
      width={240}
      height={240}
      zIndex={1}
      fill="#141414"
    /> 
  );
  view.add(
    <Circle
      ref={outerRing}
      position={[0, 0]}
      opacity={0} 
      width={600}
      height={600}
      zIndex={0}
      fill="#3b3beb"
    />
  );

  yield* all(
    innerCircle().opacity(1, .5),
    innerCircleBlack().opacity(1, .5),
    outerRing().opacity(1, .5),
  );


  // Adding two lines and two text labels, appearing on top of the circle.
  const line1Rect = createRef<Rect>();
  const line2Rect = createRef<Rect>();
  const radius1 = createRef<Txt>();
  const radius2 = createRef<Txt>();

  view.add(
    <Rect
      ref={line1Rect}
      width={100}
      height={10}
      fill="#3b3beb"
      position={[60, 0]}
      opacity={0}
      zIndex={3}
      radius={2}  
    />
  );
  view.add(
    <Txt
      ref={radius1}
      {...textStyles.body}  
      position={[50, -30]}
      opacity={0}
      zIndex={3}
      scale={1.5}
      fill="#3b3beb"
    >
      rm
    </Txt>
  );
  view.add(
    <Rect
      ref={line2Rect}
      width={180}
      height={10}
      fill="#ffc66d"
      position={[210, 0]}
      opacity={0}
      zIndex={3}
      radius={2}  
    />
  );
  view.add(
    <Txt
      ref={radius2}
      {...textStyles.body}  
      position={[210, -30]}
      opacity={0}
      zIndex={3}
      scale={1.5}
      fill="#ffc66d"
    >
      rn
    </Txt>
  );
  
  yield* all(
    line1Rect().opacity(1, .5),
    radius1().opacity(1, .5),
    line2Rect().opacity(1, .5),
    radius2().opacity(1, .5),
  );


  yield* beginSlide('smoother-life');

  const smootherRings = createRef<Img>();

  view.add(
    <Img
      ref={smootherRings}
      src={smootherLife}
      position={[0, 0]}
      opacity={0}   
      width={800}
      height={800}
      zIndex={-1}
    />
  );  

  yield* all(
    innerCircle().opacity(0, .5),
    innerCircleBlack().opacity(0, .5),
    outerRing().opacity(0, .5),
    smootherRings().opacity(1, .5),
  );





  yield* beginSlide('closing-before-transition');

  yield* all(
    line1Rect().opacity(0, .5),
    radius1().opacity(0, .5),
    line2Rect().opacity(0, .5),
    radius2().opacity(0, .5),
    smootherRings().opacity(0, .5),
    smoothLifeLabel().opacity(0, .5),
    innerFillingImage().opacity(0, .5),
    outerFillingImage().opacity(0, .5),
  )


  
  yield* all(
    title().position.y(0, 1),
    title().text("Implementation", 1)
  );
  yield* beginSlide('transition-to-implementation');

}); 