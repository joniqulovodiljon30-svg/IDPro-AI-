import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.AIzaSyBHG-NxqydJL-_Um5LLB62iiI5OEZ5H91Q),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.AIzaSyBHG-NxqydJL-_Um5LLB62iiI5OEZ5H91Q)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
