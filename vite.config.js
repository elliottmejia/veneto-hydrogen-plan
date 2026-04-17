import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  plugins: [
    {
      name: 'md-raw',
      transform(src, id) {
        if (id.endsWith('.md')) {
          return `export default ${JSON.stringify(src)};`;
        }
      },
    },
  ],
});
