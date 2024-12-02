import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import postcss from 'rollup-plugin-postcss'
import packageJson from './package.json' assert { type: 'json'};
import json from '@rollup/plugin-json';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: packageJson.main,
        format: "cjs",
        sourcemap: true,
      },
      {
        file: packageJson.module,
        format: "esm",
        sourcemap: true,
      },
    ],
    plugins: [
      peerDepsExternal(),
      resolve({ 
        jsnext: true, 
        preferBuiltins: true, 
        browser: true, 
       }),
      commonjs(),
      typescript({ tsconfig: "./tsconfig.json"}),
      postcss({
        extensions: ['.css'],
        minimize: true,
        sourceMap: true,
        modules: true,
      }),
      json({compact: true}),
    ],
  },
  {
    input: "dist/esm/types/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "esm" }],
    plugins: [dts()],
    external: [/\.css$/],
  },
];