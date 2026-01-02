import dts from 'rollup-plugin-dts';
export default {
  input: 'src/aurelia-table.ts',
  output: { file: 'dist/aurelia2-table.es.d.ts', format: 'es' },
  plugins: [dts()],
};