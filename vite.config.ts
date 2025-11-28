import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  server: {
    port: 3003,
    strictPort: true
  },
  preview: {
    port: 3003,
    strictPort: true
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/main.ts'),
      name: 'TblWidget',
      formats: ['es', 'iife'],
      fileName: (format) => `tbl-widget.${format}.js`
    },
    rollupOptions: {
      output: {
        name: 'TblWidget',
        compact: true
      }
    },
    sourcemap: true,
    target: 'es2015'
  }
});
