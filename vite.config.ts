import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, '.', '');

  return {
    plugins: [react()],
    // Explicit base is the most reliable for GitHub Pages Project sites
    base: '/Ares/',
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY || ''),
      // Prevent "process is not defined" errors
      'process.env': {
        NODE_ENV: JSON.stringify(mode),
      },
    },
  };
});