import path from 'path';
import fs from 'fs';
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import dts from "rollup-plugin-dts";
import jsonPlugin from "@rollup/plugin-json";

const packageJson = require("./package.json");

function pngResolverPlugin() {
  return {
    name: 'png-resolver',
    resolveId(source, importer) {
      if (source.endsWith('.png')) {
        return path.resolve(path.dirname(importer), source);
      }
    },
    load(id) {
      if (id.endsWith('.png')) {
        const referenceId = this.emitFile({
          type: 'asset',
          fileName: 'assets/' + path.basename(id),
          source: fs.readFileSync(id)
        });
        return `export default import.meta.ROLLUP_FILE_URL_${referenceId};`;
      }
    }
  };
}

function svgResolverPlugin() {
  return {
    name: 'svg-resolver',
    resolveId(source, importer) {
      if (source.endsWith('.svg')) {
        return path.resolve(path.dirname(importer), source);
      }
    },
    load(id) {
      if (id.endsWith('.svg')) {
        const referenceId = this.emitFile({
          type: 'asset',
          fileName: 'assets/' + path.basename(id),
          source: fs.readFileSync(id)
        });
        return `export default import.meta.ROLLUP_FILE_URL_${referenceId};`;
      }
    }
  };
}

function nodeResolverPlugin() {
  return {
    name: 'node-resolver',
    resolveId(source, importer) {
      if (source.endsWith('.node')) {
        return source;
      }
    },
    load(id) {
      if (id.endsWith('.node')) {
        const referenceId = this.emitFile({
          type: 'asset',
          name: path.basename(id),
          source: fs.readFileSync(id),
        });
        return `export default import.meta.ROLLUP_FILE_URL_${referenceId};`;
      }
    }
  };
}

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
      commonjs(),
      typescript({ tsconfig: "./tsconfig.json" }),
      pngResolverPlugin(),
      svgResolverPlugin(),
      nodeResolverPlugin(),
      jsonPlugin(),
    ],
    external: ["react", "react-dom", "@chakra-ui/react"],
  },
  {
    input: "dist/esm/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "esm" }],
    plugins: [dts()],
  },
];