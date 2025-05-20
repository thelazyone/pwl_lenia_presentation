import {makeProject} from '@motion-canvas/core';
import {Code, LezerHighlighter} from '@motion-canvas/2d';
import {parser} from '@lezer/javascript';

import testScene from './scenes/test-scene?scene';

import about from './scenes/about?scene';

import intro from './scenes/intro?scene';
import oneDimension from './scenes/one-dimension?scene'; 
import gameOfLife from './scenes/game-of-life?scene';
import continuousSpace from './scenes/continuous-space?scene';
import papers from './scenes/papers?scene';
import implementation from './scenes/implementation?scene';
import shaders from './scenes/shaders?scene';
import conclusions from './scenes/conclusions?scene';


Code.defaultHighlighter = new LezerHighlighter(parser);

export default makeProject({
  scenes: [about, intro, oneDimension, gameOfLife, continuousSpace, papers, implementation, shaders, conclusions],
  // scenes: [conclusions,],
  // scenes: [testScene],
});
