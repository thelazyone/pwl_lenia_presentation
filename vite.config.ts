import {defineConfig} from 'vite';
import motionCanvas from '@motion-canvas/vite-plugin';
import ffmpeg from '@motion-canvas/ffmpeg';

export default defineConfig({
  plugins: [
    motionCanvas(),
    ffmpeg(),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/styles.css";`,
      },
    },
  },
});
