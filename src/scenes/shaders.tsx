import {makeScene2D, Txt, Rect, Circle, Img, Layout, Line} from '@motion-canvas/2d';
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

  // Hiding nvidia image and the shadersText
  yield* all(
    nvidia().opacity(0, .5),
    shadersText().opacity(0, .5)
  );

  // Pipeline approach
  const shaderType = createRef<Txt>();
  view.add(
    <Txt
      ref={shaderType}
      text="Graphic Pipeline"  
      {...textStyles.h2}
      position={[0, -150]}
      textWrap={false}
      textAlign="center"
      opacity={0}
    />  
  );

  // Create the pipeline elements with absolute positioning
  const geometryBox = createRef<Rect>();
  const bufferBox = createRef<Rect>();
  const screenBox = createRef<Rect>();
  const shaderBox = createRef<Rect>(); 
  const geometryText = createRef<Txt>();
  const bufferText = createRef<Txt>();
  const screenText = createRef<Txt>();
  const shaderText = createRef<Txt>();
  const arrowLine1 = createRef<Line>();
  const arrowLine2 = createRef<Line>();
  const arrowLine3 = createRef<Line>();
  const arrowLine4 = createRef<Line>();

  // Geometry box (left side)
  view.add(
    <Rect
      ref={geometryBox}
      width={280}
      height={120}
      fill={'#212121'}
      radius={20}
      position={[-620, 0]}
      opacity={0}
      scale={1.5} 
    />
  );

  // Geometry text
  view.add(
    <Txt
      ref={geometryText}
      text="GEOMETRY"
      {...textStyles.h2}
      position={[-620, 0]}
      textAlign="center"
      opacity={0}
      scale={1.5} 
    />
  );

  // First arrow (from GEOMETRY to SHADER)
  view.add(
    <Line
      ref={arrowLine1}
      points={[[-260, 0], [-150, 0]]}
      stroke={'#a4a4a4'}
      lineWidth={20}
      endArrow={true}
      arrowSize={45}
      opacity={0}
      scale={1.5}
    />
  );

  // Shader box (middle)
  view.add(
    <Rect
      ref={shaderBox}
      width={280}
      height={120}
      fill={'#294228'}
      radius={20}
      position={[0, 0]}
      opacity={0}
      scale={1.5} 
    />
  );

  // Shader text
  view.add(
    <Txt
      ref={shaderText}
      text="SHADER"
      {...textStyles.h2}
      position={[0, 0]}
      textAlign="center"
      opacity={0}
      scale={1.5} 
    />
  );

  // Second arrow (from SHADER to SCREEN)
  view.add(
    <Line
      ref={arrowLine2}
      points={[[150, 0], [260, 0]]}
      stroke={'#a4a4a4'}
      lineWidth={20}
      endArrow={true}
      arrowSize={45}
      opacity={0}
      scale={1.5}
    />
  );

  // Screen box (right side)
  view.add(
    <Rect
      ref={screenBox}
      width={220}
      height={120}
      fill={'#212121'}
      radius={20}
      position={[570, 0]}
      opacity={0}
      scale={1.5} 
    />
  );

  // Screen text
  view.add(
    <Txt
      ref={screenText}
      text="SCREEN"
      {...textStyles.h2}
      position={[570, 0]}
      textAlign="center"
      scale={1.5} 
      opacity={0}
    />
  );

  // Show the pipeline elements
  yield* all(
    shaderType().opacity(1, .5),
    geometryBox().opacity(1, .5),
    geometryText().opacity(1, .5),
    arrowLine1().opacity(1, .5),
    shaderBox().opacity(1, .5),
    shaderText().opacity(1, .5),
    arrowLine2().opacity(1, .5),
    screenBox().opacity(1, .5),
    screenText().opacity(1, .5)
  );

  yield* beginSlide('first-shader');

  
  view.add(
    <Line
      ref={arrowLine3}
      points={[[380, 80], [380, 200], [300, 200]]}
      stroke={'#a4a4a4'}
      lineWidth={20}
      endArrow={true}
      arrowSize={45}
      opacity={0}
      scale={1.5}
    />
  );

  // Changing some stuff
  yield* all(
    shaderType().text("Simulation", 1),
    geometryText().text("NOISE", 1),
  );


  // but then adding the buffer and removing the noise.

  view.add(
    <Line
      ref={arrowLine4}
      points={[[50, 200], [0, 200], [0,70]]}
      stroke={'#a4a4a4'}
      lineWidth={20}
      endArrow={true}
      arrowSize={45}
      opacity={0}
      scale={1.5}
    />
  );

  view.add(
    <Rect
      ref={bufferBox}
      width={240}
      height={120}
      fill={'#212121'}
      radius={20}
      position={[265, 300]}
      opacity={0}
      scale={1.5}
    />
  );

  view.add(
    <Txt
      ref={bufferText}
      text="BUFFER"
      {...textStyles.h2}
      position={[265, 300]}
      textAlign="center"
      opacity={0}
      scale={1.5}
    />
  );
  
  
  yield* beginSlide('second-shader');

  

    // Changing some stuff, getting in the loop
    yield* all( 
      arrowLine3().opacity(1, .5),
      bufferBox().opacity(1, .5),
      bufferText().opacity(1, .5),
      arrowLine4().opacity(1, .5),
      geometryText().opacity(0, .5),
      geometryBox().opacity(0, .5),
      arrowLine1().opacity(0, .5),
    );
    // recentering - move everything left by 200
    var leftShift = 280;
    yield* all(
      shaderText().position.x(shaderText().position.x() - leftShift, 1),
      shaderBox().position.x(shaderBox().position.x() - leftShift, 1), 
      screenText().position.x(screenText().position.x() - leftShift, 1),
      screenBox().position.x(screenBox().position.x() - leftShift, 1),
      bufferText().position.x(bufferText().position.x() - leftShift, 1),
      bufferBox().position.x(bufferBox().position.x() - leftShift, 1),
      arrowLine2().position.x(arrowLine2().position.x() - leftShift, 1),
      arrowLine3().position.x(arrowLine3().position.x() - leftShift, 1), 
      arrowLine4().position.x(arrowLine4().position.x() - leftShift, 1)
    );
 



  yield* beginSlide('second-shader-loop');

  // Hiding everything else
  yield* all(
    shaderType().opacity(0, .5),
    shaderText().opacity(0, .5),
    geometryBox().opacity(0, .5),
    geometryText().opacity(0, .5),
    arrowLine1().opacity(0, .5),
    shaderBox().opacity(0, .5),
    shaderText().opacity(0, .5),
    arrowLine2().opacity(0, .5),
    screenBox().opacity(0, .5),
    screenText().opacity(0, .5),
    arrowLine3().opacity(0, .5),
    bufferBox().opacity(0, .5),
    bufferText().opacity(0, .5),
    arrowLine4().opacity(0, .5)
  );

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
    title().opacity(0, .5),
    shadersText().opacity(0, .5),
    nvidia().opacity(0, .5)
  );

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
    title().opacity(1, .5),
  );
  
  // Clean up only after hidden
  cleanup();

  // End of the slide
  yield* all(
    title().position.y(0, 1),
    title().text("Conclusions", 1)
  );

  yield* beginSlide('transition-to-conclusions');
}); 
