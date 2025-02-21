import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  entries: [
    // Include devtools runtime files
    { input: './src/devtools/runtime', builder: 'mkdist', outDir: 'dist/devtools/runtime' },
    // Vue support
    './src/unplugin',
    './src/vite',
  ],
  rollup: {
    emitCJS: true,
  },
  replace: {
    'process.env.DEV': 'false',
    'process.env.NUXT_POHON_UI_DEVTOOLS_LOCAL': 'false',
  },
  hooks: {
    'mkdist:entry:options': function (_ctx, _entry, options) {
      options.addRelativeDeclarationExtensions = false;
    },
  },
  externals: ['#build/pohon', 'vite'],
});
