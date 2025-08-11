import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser'; // Use default export
import typescript from 'rollup-plugin-typescript2';
import html from '@rollup/plugin-html';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { preprocess } from '@aurelia/plugin-conventions';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function aureliaPreprocessPlugin() {
  return {
    name: 'aurelia-preprocess',
    transform(code, id) {
      const ext = path.extname(id);
      if (ext === '.html') {
        const result = preprocess({ path: id, contents: code }, {});
        return {
          code: result.code,
          map: result.map
        };
      }
      return null;
    }
  };
}

export default async () => {
  const pkgPath = path.resolve(__dirname, './package.json');
  const pkgContent = await fs.readFile(pkgPath, 'utf-8');
  const pkg = JSON.parse(pkgContent);

  const commonPlugins = [
    json(),
    aureliaPreprocessPlugin(),
    typescript(),
    terser({
      compress: {
        defaults: false,
      },
      mangle: false,
      keep_classnames: true,
    })
  ];

  const createConfig = (output) => ({
    input: 'src/aurelia-table.ts',
    output,
    external: Object.keys(pkg.dependencies),
    plugins: [
      ...commonPlugins,
      html({ include: '**/*.html' })
    ]
  });

  return [
    createConfig({
      file: pkg.module,
      format: 'esm'
    }),
    createConfig({
        file: pkg.main,
        format: 'es'
    })
  ];
};