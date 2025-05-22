import {makeScene2D, Txt, Rect, Circle, Img, Layout} from '@motion-canvas/2d';
import {all, createRef, beginSlide, waitFor, loop} from '@motion-canvas/core';
import {Colors, textStyles} from './shared';

import big_eyes from '../images/big_eyes.jpg';
import small_eyes from '../images/small_eyes.jpg';
import double_gliders from '../images/double_gliders.jpg';
import gliders from '../images/gliders.jpg';
import bridges from '../images/bridges.jpg';
import rotating from '../images/rotating.jpg';

// Adding smoothlife at the end again.
import {Three} from '../components/Three';
import {threeScene, camera, setup, render, reset, cleanup, smoothLife} from '../three/smoothlife';



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


  // label below the title
  const speciesLabel = createRef<Txt>();
  view.add(
    <Txt
      ref={speciesLabel}
      {...textStyles.h2}
      position={[0, -view.height()/2 + 250]}
      opacity={0}
      zIndex={1}
    >   
      Recurring Patterns (Species!)
    </Txt>
  );

  // Create a container for all species images and labels
  const speciesContainer = createRef<Layout>();

  // adding a bunch of images
  const big_eyes_img = createRef<Img>();
  const small_eyes_img = createRef<Img>();
  const double_gliders_img = createRef<Img>();
  const gliders_img = createRef<Img>();
  const bridges_img = createRef<Img>();
  const rotating_img = createRef<Img>();

  // And descriptions
  const stable_label = createRef<Txt>();
  const glider_label = createRef<Txt>();
  const bridges_label = createRef<Txt>();
  const mix_label = createRef<Txt>();

  // Add all items to a single container layout
  view.add(
    <Layout ref={speciesContainer} opacity={0}>
      {/* Stable species */}
      <Txt
        ref={stable_label}
        {...textStyles.h2}
        position={[-500, -view.height()/2 + 610]}
      >
        Stable
      </Txt>

      <Img
        ref={big_eyes_img}
        src={big_eyes}
        position={[-500, -view.height()/2 + 750]}
        scale={1}    
      />

      <Img
        ref={small_eyes_img}
        src={small_eyes}
        position={[-500, -view.height()/2 + 450]}
        scale={1}
      />

      {/* Gliders species */}
      <Txt
        ref={glider_label}
        {...textStyles.h2}
        position={[500, -view.height()/2 + 610]}
      >
        Gliders
      </Txt>

      <Img
        ref={double_gliders_img}
        src={double_gliders}
        position={[430, -view.height()/2 + 750]}
        scale={1}
      />

      <Img
        ref={gliders_img}
        src={gliders}
        position={[500, -view.height()/2 + 450]}
        scale={1}
      />

      <Img
        ref={rotating_img}
        src={rotating}
        position={[630, -view.height()/2 + 750]}
        scale={1}
      />

      {/* Bridges species */}
      <Txt
        ref={bridges_label}
        {...textStyles.h2}
        position={[0, -view.height()/2 + 420]}
      >
        Bridges
      </Txt>

      <Img
        ref={bridges_img}
        src={bridges}
        position={[0, -view.height()/2 + 720]}
        scale={1}
      />

      {/* Mix label */}
      <Txt
        ref={mix_label}
        {...textStyles.h2}
        position={[0, -view.height()/2 + 1010]}
      >
        (It's a mix!)
      </Txt>
    </Layout>
  );

  yield* speciesLabel().opacity(1, .5);
  yield* speciesContainer().opacity(1, .5);

  yield* beginSlide('Points-about-universes');

  yield* all(
    speciesLabel().opacity(0, .5),
    speciesContainer().opacity(0, .5),
  )

  // Adding 3 strings
  const string1 = createRef<Txt>();
  const string2 = createRef<Txt>();
  const string3 = createRef<Txt>();
  const string4 = createRef<Txt>();
  const string5 = createRef<Txt>();
  const further_notes = createRef<Layout>();

  view.add(
    <Layout ref={further_notes} opacity={0} alignItems={'start'}>
    <Txt
      ref={string1}
      {...textStyles.h2}
      position={[-400, 100]}
      textWrap={true}
      textAlign="center"
      size={[800, 200]}
      opacity={1}
    >
      It's not Game of Life, But...
    </Txt>
    <Txt
      ref={string2}
      {...textStyles.h2}
      position={[500, -150]}
      opacity={1}
      textAlign={'start'}
    >
      Is a universe
    </Txt>
    <Txt
      ref={string3}
      {...textStyles.h2}
      position={[500, 0]}
      opacity={1}
    >
      Depends on the parameters
    </Txt>
    <Txt
      ref={string4}
      {...textStyles.h2}
      position={[500, 150]}
      opacity={1}
    >
      Creates Species / Patterns
    </Txt>
  </Layout>
  );

  view.add(
    <Txt
      ref={string5}
      {...textStyles.h2}
      position={[500, 300]}
      opacity={0}
    >
      Looks cool
    </Txt> 
  );

  yield* all(
    string5().opacity(1, .5),
    further_notes().opacity(1, .5),
  )

  yield* beginSlide('looks-cool');

  yield* further_notes().opacity(0, .5);
  yield* all(
    string5().position([0, 50], 1),
    string5().scale(2.5, 1),
  )

  yield* beginSlide('recommended books');

  yield* all(
    further_notes().opacity(0, .5),
    string5().opacity(0, .5),
  )

  // Resetting old strings
  const recommended_books = createRef<Layout>();
  const recommended_books_label = createRef<Txt>();
  const recommended_books_label2 = createRef<Txt>();
  const recommended_books_label3 = createRef<Txt>();
  const recommended_books_label4 = createRef<Txt>();
  const recommended_books_label5 = createRef<Txt>();

  view.add(
    <Layout ref={recommended_books} opacity={0} alignItems={'start'}>
      <Txt
        ref={recommended_books_label}
        {...textStyles.h2}
        position={[0, -view.height()/2 + 350]}  
        textWrap={true}
        size={[690, 200]}
        textAlign={'center'}
        opacity={1}
      >
        Recommended Books (Novels, not Textbooks)
      </Txt>
      <Txt
        ref={recommended_books_label2}
        {...textStyles.h2}
        position={[0, -50]}
        opacity={1}
      >
        Permutation City (Greg Egan)
      </Txt>
      <Txt
        ref={recommended_books_label3}
        {...textStyles.h2}
        position={[0, 50]}
        opacity={1}
        fill={'#d1d1d1'}
      >
        https://www.gregegan.net/PERMUTATION/Permutation.html
      </Txt>
      <Txt
        ref={recommended_books_label4}
        {...textStyles.h2}
        position={[0, 250]}
        opacity={1}
      >
        Schild's Ladder (Greg Egan)
      </Txt>
      <Txt
        ref={recommended_books_label5}
        {...textStyles.h2}
        position={[0, 350]}
        opacity={1}
        fill={'#d1d1d1'}
      >
        https://www.gregegan.net/SCHILD/SCHILD.html
      </Txt>
    </Layout>
  );    
  

  
  
  
  
  yield* all(
    recommended_books().opacity(1, .5),
  )
  
    yield* beginSlide('closing-before-transition');


  yield* all(
    // Closing stuff
    string5().opacity(0, .5),
    recommended_books().opacity(0, .5),
  )


  
  yield* all(
    title().position.y(0, 1),
    title().text("The End", 1)
  );

  yield* waitFor(3);

  // Adding the smoothlife thingy again.
  const threeContainer = createRef<Layout>();
  const three = createRef<Three>();
  
  // Add Three.js container
  var full_screen_square = 1920;
  view.add(
    <Layout
      ref={threeContainer}
      width={full_screen_square}
      height={full_screen_square}
      opacity={0} // Start hidden
    >
      <Three
        ref={three}
        width={full_screen_square}
        height={full_screen_square}
        quality={1}
        scene={threeScene}
        camera={camera}
        onRender={(renderer, scene, camera) => {
          // The update is handled by the computed signal in createSmoothLife
          // that's subscribed to onBeginRender
          render(renderer, scene, camera);
        }}
        zIndex={2}
      />
    </Layout>
  );

  // Reset SmoothLife with clean state BEFORE showing it
  // This ensures proper initialization
  reset();
  
  // Wait a moment to ensure everything is initialized
  yield* waitFor(0.3);

  // Show SmoothLife
  yield* all(
    threeContainer().opacity(1, 1),
    title().opacity(0, 1),
  );

  // Run the simulation in a loop until the next slide
  yield loop(function* () {
    // Advance the simulation (automatically sets shouldAdvance)
    smoothLife.advanceFrame();
    
    // Wait a bit between frames for a good animation speed
    yield* waitFor(0.01);
  });

  yield* beginSlide('smoothlife_end');

}); 