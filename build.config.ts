import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  entries: [
    // Vue support
    './src/unplugin',
    './src/vite',
    // UnoCSS support
    './src/unocss-preset',
  ],
  rollup: {
    emitCJS: true,
  },
  replace: {
    'process.env.DEV': 'false',
  },
  hooks: {
    'mkdist:entry:options': function (ctx, entry, options) {
      options.addRelativeDeclarationExtensions = false;
    },
  },
  externals: ['#build/pohon', 'vite'],
});
