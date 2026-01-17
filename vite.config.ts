import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, '.', '');
  
  return {
    plugins: [react()],
    // Base "./" is crucial for GitHub Pages to find assets relatively
    base: './',
    define: {
      // This ensures the process.env.API_KEY used in the code is replaced by the actual value during build
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
    },
  };
});