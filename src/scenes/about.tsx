import {makeScene2D, Txt, Rect, Circle, Img, Layout} from '@motion-canvas/2d';
import {all, createRef, beginSlide, waitFor} from '@motion-canvas/core';
import {Colors, textStyles} from './shared';

import big_eyes from '../images/big_eyes.jpg';
import small_eyes from '../images/small_eyes.jpg';
import double_gliders from '../images/double_gliders.jpg';
import gliders from '../images/gliders.jpg';
import bridges from '../images/bridges.jpg';


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
      scale={1.5}
    >
      A Continuous Game of Life
    </Txt>
  );

  yield* beginSlide('opening');

  yield* waitFor(1);

  // Disappear title
  yield* title().text("", 1);

  // Title becoming "about me"
  title().scale(1);
  title().position([0, -view.height()/2 + 150]);
  yield* title().text("About me", .5);


  
  yield* beginSlide('about-me');


  // label below the title
  const nameLabel = createRef<Txt>();
  const workLabel = createRef<Txt>();
  const passionLabel = createRef<Txt>();
  const notAnExpertLabel = createRef<Txt>();
  const notAnExpertLabel2 = createRef<Txt>();
  view.add(
    <Txt
      ref={nameLabel}
      {...textStyles.h2}
      position={[0, -view.height()/2 + 250]}
      opacity={0}
      zIndex={1}
      scale={1}
    >   
      Giacomo Pantalone
    </Txt>
  );

  view.add(
    <Txt
      ref={workLabel}
      {...textStyles.h2}
      position={[-400, 0]}
      opacity={0}
      zIndex={1}
      scale={1}
    >   
      WORK - Software Engineer
    </Txt>
  );  

  view.add(
    <Txt
      ref={passionLabel}
      {...textStyles.h2}
      position={[400, 0]}
      opacity={0}
      zIndex={1}
      scale={1}
      fill={'#d1d1d1'}
    >   
      HOBBY - Game Designer
    </Txt>
  );  
  
  view.add(
    <Txt
      ref={notAnExpertLabel}
      {...textStyles.h2}
      position={[0, -view.height()/2 + 850]}
      opacity={0}
      zIndex={1}
      scale={1.5}
      fill={Colors.FUNCTION}
    >   
      Not an expert
    </Txt>
  );
  view.add(
    <Txt
      ref={notAnExpertLabel2}
      {...textStyles.h2}
      position={[0, -view.height()/2 + 940]}
      opacity={0}
      zIndex={1}
      scale={.8}
      fill={Colors.FUNCTION}
    >   
      (we are at "Papers we Love", afterall!)
    </Txt>
  );

  yield* nameLabel().opacity(1, .5);
  yield* workLabel().opacity(1, .5);
  yield* passionLabel().opacity(1, .5);



  yield* beginSlide('career-switch');

  yield* all(
    workLabel().text("HOBBY - Software Engineer", 1),
    passionLabel().text("WORK - Game Designer", 1),
    workLabel().fill('#d1d1d1', 1),
    passionLabel().fill(Colors.FUNCTION, 1),
  )
  

  yield* beginSlide('not-an-expert');

  yield* notAnExpertLabel().opacity(1, .5);

  yield* beginSlide('papers-we-love-plug');
  yield* notAnExpertLabel2().opacity(1, .5);


  yield* beginSlide('links');

  const paperLink = createRef<Txt>();
  view.add(
    <Txt
      ref={paperLink}
      {...textStyles.h2}
      position={[0, -view.height()/2 + 650]}
      opacity={0}
      fill={'#d1d1d1'}
    >
      https://arxiv.org/abs/1111.1567
    </Txt>
  );

  yield* all(
    title().text("Links", 1),

    nameLabel().text("The Presentation", 1),
    workLabel().text("https://github.com/thelazyone/pwl_lenia_presentation", 1),
    workLabel().position([0, -view.height()/2 + 350], 1),

    passionLabel().text("The Paper", 1),
    passionLabel().position([0, -view.height()/2 + 550], 1),
    paperLink().opacity(1, 1),

    notAnExpertLabel().scale(1, 1),
    notAnExpertLabel2().scale(1, 1),
    notAnExpertLabel().text("Written with Motion Canvas", 1),
    notAnExpertLabel2().text("https://motioncanvas.io/", 1),
    notAnExpertLabel2().fill('#d1d1d1', 1)

  )



  
  yield* beginSlide('transition-to_introduction');

  // Fade it all out
  yield* all(
    nameLabel().opacity(0, .5),
    workLabel().opacity(0, .5),
    passionLabel().opacity(0, .5),
    notAnExpertLabel().opacity(0, .5),
    notAnExpertLabel2().opacity(0, .5),
    paperLink().opacity(0, .5),
    title().opacity(0, .5),
  ) 

}); 