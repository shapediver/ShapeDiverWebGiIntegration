import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000, // Change this to your desired port
    open: true, // Automatically open the app in the browser
  },
  build: {
    outDir: 'dist', // Directory to output the build files
    sourcemap: true, // Generate source maps for debugging
  }
});