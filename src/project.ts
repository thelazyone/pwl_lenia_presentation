import {makeProject} from '@motion-canvas/core';
import {Code, LezerHighlighter} from '@motion-canvas/2d';
import {parser} from '@lezer/javascript';

import intro from './scenes/intro?scene';
import oneDimension from './scenes/one-dimension?scene';
import gameOfLife from './scenes/game-of-life?scene';
import continuousSpace from './scenes/continuous-space?scene';
import papers from './scenes/papers?scene';

import testScene from './scenes/test-scene?scene';


Code.defaultHighlighter = new LezerHighlighter(parser);

export default makeProject({
  scenes: [intro, oneDimension, gameOfLife, continuousSpace, papers],
  // scenes: [continuousSpace ],
  // scenes: [testScene],
});
