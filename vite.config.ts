import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    include: ['@endo/init'],
    esbuildOptions: { target: 'es2020', supported: { bigint: true } },
  },
  plugins: [react(), tsconfigPaths()],
  build: {
    target: 'es2020',
  },
});
