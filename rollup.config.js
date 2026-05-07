import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/house-card.js',
  output: {
    file: 'dist/house-card.js',
    format: 'es',
    sourcemap: false,
  },
  plugins: [
    resolve(),
    terser(),
  ],
};
