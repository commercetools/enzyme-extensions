import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import cleanup from 'rollup-plugin-cleanup';
import pkg from './package.json';

const plugins = [
  // To use the nodejs `resolve` algorithm
  resolve(),
  babel({
    exclude: ['node_modules/**'],
    runtimeHelpers: true,
  }),
  // To convert CJS modules to ES6
  commonjs({
    include: 'node_modules/**',
  }),
  // To remove comments, trim trailing spaces, compact empty lines,
  // and normalize line endings
  cleanup(),
];

module.exports = {
  input: 'src/index.js',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
    },
    {
      file: pkg.module,
      format: 'esm',
    },
  ],
  plugins,
};
