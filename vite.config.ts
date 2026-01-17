import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, '.', '');

  return {
    plugins: [react()],
    // Explicit base for GitHub Pages
    base: '/Ares/',
    define: {
      // Safely stringify the API key, default to empty string to prevent ReferenceError
      'process.env.API_KEY': JSON.stringify(env.API_KEY || ''),
    },
  };
});