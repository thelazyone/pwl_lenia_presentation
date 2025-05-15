import {makeScene2D, Txt, Rect, Circle, Img, Code} from '@motion-canvas/2d';
import {all, createRef, beginSlide, waitFor, Reference} from '@motion-canvas/core';
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
      Implementation
    </Txt>
  );

  yield* beginSlide('title');

  // Move up as usual
  yield* title().position([0, -view.height()/2 + 150], 1);
  yield* beginSlide('title-top');

  // add a label saying "Discrete Convolution" as h2
  const discreteConvolutionLabel = createRef<Txt>();
  view.add(
    <Txt
      ref={discreteConvolutionLabel}
      {...textStyles.h2}
      position={[0, -30]}
      opacity={0}
      zIndex={1}
    >
      Discrete Convolution
    </Txt>
  );

  yield* all(
    discreteConvolutionLabel().opacity(1, 1),
  );

  yield* beginSlide('discrete-convolution');
  
    // add a label saying "Discrete Convolution" as h2
    const commentOnBefore = createRef<Txt>();
    view.add(
      <Txt
        ref={commentOnBefore}
        {...textStyles.h2}
        position={[0, 40]}
        opacity={0}
        zIndex={1}
      >
        (Same of Game of Life)
      </Txt>
    );
  
  yield* commentOnBefore().opacity(1, .5);
  yield* waitFor(1);

  yield* commentOnBefore().text("(Same of Game of Life, but bigger)", .5);

  yield* beginSlide('discrete-convolution-but-bigger');

  // Add three labels, to appear and get barred just lik in the previous chapter.
  const bruteForceLabel = createRef<Txt>();
  const fftLabel = createRef<Txt>();
  const gpuLabel = createRef<Txt>();

  view.add(
    <Txt
      ref={bruteForceLabel}
      {...textStyles.h2}
      position={[0, 0]}
      opacity={0}
      zIndex={1}
    >
      Brute Force
    </Txt>
  );

  view.add(
    <Txt
      ref={fftLabel}
      {...textStyles.h2}
      position={[0, 0]}
      opacity={0}
      zIndex={1}
    >
      FFT Convolution
    </Txt>
  );    

  view.add(
    <Txt
      ref={gpuLabel}
      {...textStyles.h2}    
      position={[0, 0]}
      opacity={0}
      zIndex={1}
    >
      Shaders
    </Txt>
  );

  // Given the five labels that are to be barred, creating five bars that 
  // will be animated to fade in on top of the labels.
  // The bars are created with the coordinates of the labels and the width each text label is.
  function createBarFromLabel(labelRef: Reference<Txt>) {
    const barRect = createRef<Rect>();
    view.add(
      <Rect
        ref={barRect}
        width={labelRef().width()}
        height={4}
        fill="#ff6b6b"
        position={[labelRef().position.x(), labelRef().position.y() - labelRef().height()/2 - 10]}
        opacity={0}
        zIndex={2}
        radius={2}  
      />
    );
    return barRect;
  }

  const barred_color = '#cbcbcb';

  bruteForceLabel().position([-view.width()/2 + 80 + bruteForceLabel().width()/2, -view.height()/2 + 300])
  fftLabel().position([-view.width()/2 + 80 + fftLabel().width()/2, -view.height()/2 + 380])
  gpuLabel().position([-view.width()/2 + 80 + gpuLabel().width()/2, -view.height()/2 + 460])
  const bruteForceBar = createBarFromLabel(bruteForceLabel);
  bruteForceBar().position([bruteForceLabel().position.x(), -view.height()/2 + 300])
  bruteForceBar().fill(barred_color)
  const fftBar = createBarFromLabel(fftLabel);
  fftBar().position([fftLabel().position.x(), -view.height()/2 + 380])
  fftBar().fill(barred_color)
  const gpuBar = createBarFromLabel(gpuLabel);
  gpuBar().position([gpuLabel().position.x(), -view.height()/2 + 460])
  gpuBar().fill(barred_color)

  // BRUTE FORCE:
  yield* all(
    // Fading away the previous text
    commentOnBefore().opacity(0, .5),
    discreteConvolutionLabel().opacity(0, .5),

  );
  yield* bruteForceLabel().opacity(1, .5);

  // Create a code block
  const codeTerminal = createRef<Code>();
  view.add(
    <Code
      ref={codeTerminal}
      code={`
  // Repeat this for each cell in (r, c)
  for (int i = r - R; i <= r + R; i++) {
    for (int j = c - R; j <= c + R; j++) {
      if cell[r1][j]{
        distance = sqrt((r - i)^2 + (c - j)^2)
        if  distance < inner_radius {
          state[r][c] += inner_weight(distance);
        }
        else if (distance < outer_radius) {
          state[r][c] += outer_weight(distance);
        }
      }
    } 
  }
`}
      position={[200, 100]}
      opacity={0}
      zIndex={1}
    />
  );

  yield* codeTerminal().opacity(1, .5);

  yield* beginSlide('brute-force-explanation');

  yield* all(
    bruteForceLabel().fill(barred_color, .5),
    bruteForceBar().opacity(1, .5),
    fftLabel().opacity(1, .5),
    codeTerminal().code(`
// Compute FFT along rows and columns
fft_row(state, state_intermediate);
fft_col(state_intermediate, freq_domain);

// Multiply the state by the kernel
for (int r = 0; r < N; r++) {
  for (int c = 0; c < M; c++) {
    freq_domain[r][c] *= kernel_fft[r][c];
  }
}

// Inverse FFT to get the convolution
ifft_col(freq_domain, state_intermediate);
ifft_row(state_intermediate, state);
    `, .5)
  );




  bruteForceLabel().opacity(1, 1),
  fftLabel().opacity(1, 1),
  gpuLabel().opacity(1, 1),
  bruteForceBar().opacity(1, 1),
  fftBar().opacity(1, 1),
  gpuBar().opacity(1, 1),

  yield* waitFor(1);

  yield* beginSlide('gpu-explanation');
  yield* all(
    fftLabel().fill(barred_color, .5),
    fftBar().opacity(1, .5),
    fftLabel().opacity(1, .5),
    gpuLabel().opacity(1, .5),
    codeTerminal().code(`
      // Repeat this for each cell in (r, c)
      for (int i = r - R; i <= r + R; i++) {
        for (int j = c - R; j <= c + R; j++) {
          if cell[r1][j]{
            distance = sqrt((r - i)^2 + (c - j)^2)
            if  distance < inner_radius {
              state[r][c] += inner_weight(distance);
            }
            else if (distance < outer_radius) {
              state[r][c] += outer_weight(distance);
            }
          }
        } 
      }
    `, .5)
  );

  yield* beginSlide('before-transition');


  
  yield* all(
    bruteForceLabel().opacity(0, .5),
    fftLabel().opacity(0, .5),
    fftBar().opacity(0, .5),
    gpuLabel().opacity(0, .5),
    codeTerminal().opacity(0, .5),
    bruteForceBar().opacity(0, .5),
  )
  
  yield* all(
    title().position.y(0, 1),
    title().text("Shaders", 1)
  );

  yield* beginSlide('transition-to-shaders');


}); 
