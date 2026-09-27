import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import postcssPrefixSelector from 'postcss-prefix-selector';

export default defineConfig({
  build: {
    outDir: 'ewfwp-example-app/web-component',
    emptyOutDir: true,
    sourcemap: true,

    rolldownOptions: {
      input: 'vite.build.collector.js',

      output: {
        entryFileNames: 'web-component.js',
        format: 'iife',
        inlineDynamicImports: true,
      },
    },
  },
  css: {
    postcss: {
      plugins: [
        postcssPrefixSelector({
          prefix: 'ewfwp-example-app',
        }),
      ],
    },
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'dist/ewfwp-example-app/browser/styles.css',
          dest: 'assets',
          rename: { stripBase: true },
        },
      ],
    }),
  ],
});
