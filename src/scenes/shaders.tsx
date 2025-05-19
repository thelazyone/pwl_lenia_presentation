import {makeScene2D, Txt, Rect, Circle, Img, Layout} from '@motion-canvas/2d';
import {all, createRef, beginSlide, waitFor, Reference, loop} from '@motion-canvas/core';
import {Colors, textStyles} from './shared';
import {Three} from '../components/Three';
import {threeScene, camera, setup, render, reset, cleanup, smoothLife} from '../three/smoothlife';

import tackyNvidia from '../images/tacky_nvidia.jpg';

const life_width = 1080;
const life_height = life_width;

export default makeScene2D(function* (view) {
  const title = createRef<Txt>();
  const background = createRef<Rect>();
  const threeContainer = createRef<Layout>();
  const three = createRef<Three>();

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
      Shaders
    </Txt>
  );

  // Shaders are cool
  yield* title().text("Shaders (They are cool)", 1);

  yield* beginSlide('title');

  // Move up as usual
  yield* all(
    title().position([0, -view.height()/2 + 150], 1),
    title().text("Shaders", 1),
  );

  // quick explaination of shaders, some text and nothing else.
  const shadersText = createRef<Txt>();
  view.add(
    <Txt
      ref={shadersText}
      text="Compiled by the GPU - highly parallel extremely fast - general purpose" 
      {...textStyles.h2}
      position={[0, -150]}
      textWrap={true}
      textAlign="center"
      size={[1300, 200]}
      opacity={0}
    />
  );

  // adding the tacky nvidia image
  const nvidia = createRef<Img>();
  view.add(
    <Img
      ref={nvidia}
      src={tackyNvidia}
      size={[1200, 469]}
      position={[0, 230]}
      opacity={0}
    />
  );  

  yield* all(
    shadersText().opacity(1, .5),
    nvidia().opacity(1, .5)
  );

  yield* beginSlide('quick-shader-intro');

  // Add Three.js container
  view.add(
    <Layout
      ref={threeContainer}
      width={life_width}
      height={life_height}
      opacity={0} // Start hidden
    >
      <Three
        ref={three}
        width={life_width}
        height={life_height}
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
    shadersText().opacity(0, .5),
    nvidia().opacity(0, .5)
  );

  console.log('Starting SmoothLife simulation loop');

  // Run the simulation in a loop until the next slide
  yield loop(function* () {
    // Advance the simulation (automatically sets shouldAdvance)
    smoothLife.advanceFrame();
    
    // Wait a bit between frames for a good animation speed
    yield* waitFor(0.01);
  });

  yield* beginSlide('smoothlife-demo');

  // HIDE before cleanup to avoid flicker
  yield* all(
    threeContainer().opacity(0, 0.5),
  );
  
  // Clean up only after hidden
  cleanup();

  yield* beginSlide('test');

  // End of the slide
  yield* all(
    title().position.y(0, 1),
    title().text("Shaders", 1)
  );

  yield* beginSlide('transition-to-shaders');
}); 
