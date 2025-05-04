import {makeProject} from '@motion-canvas/core';

import intro from './scenes/intro?scene';
import oneDimension from './scenes/one-dimension?scene';

export default makeProject({
  scenes: [intro, oneDimension],
});
