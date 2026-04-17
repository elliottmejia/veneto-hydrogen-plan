import { defineConfig } from 'vite';

export default defineConfig({
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
