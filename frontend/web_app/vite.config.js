import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  server: {
    port: 5173,
    open: true,
    // SPA fallback so sub-routes work on reload
    historyApiFallback: true,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
