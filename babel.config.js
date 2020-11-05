// @ts-nocheck
module.exports = function (api) {
  const isTest = api.env('test');

  api.cache(true);

  const isDevelopment = process.env.BABEL_ENV === 'development' ? true : false;

  const presets = [
    [
      // Allows smart transpilation according to target environments
      '@babel/preset-env',
      {
        // Specifying which browser versions you want to transpile down to
        targets: {
          browsers: ['last 2 versions'],
        },
        /**
         * Specifying what module type should the output be in.
         * For test cases, we transpile all the way down to commonjs since jest does not understand TypeScript.
         * For all other cases, we don't transform since we want Webpack to do that in order for it to do
         * dead code elimination (tree shaking) and intelligently select what all to add to the bundle.
         */
        modules: isTest ? 'commonjs' : false,
      },
    ],
    '@babel/preset-typescript',
    [
      '@babel/preset-react',
      {
        runtime: 'automatic',
      },
    ],
  ];

  const plugins = [
    '@babel/plugin-proposal-nullish-coalescing-operator',
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-transform-runtime',
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-object-rest-spread',
    !isDevelopment && '@babel/plugin-transform-react-inline-elements',
    !isDevelopment && '@babel/plugin-transform-react-constant-elements',
    !isDevelopment && 'transform-react-remove-prop-types',
    isDevelopment && [
      'i18next-extract',
      {
        outputPath: 'src/locales/{{locale}}/{{ns}}.json',
      },
    ],
    [
      'transform-imports',
      {
        '@material-ui/core': {
          transform: function (importName) {
            return `@material-ui/core/${importName}`;
          },
          preventFullImport: true,
        },
        '@material-ui/lab': {
          transform: function (importName) {
            return `@material-ui/lab/${importName}`;
          },
          preventFullImport: true,
        },
        '@material-ui/styles': {
          transform: function (importName) {
            return `@material-ui/styles/${importName}`;
          },
          preventFullImport: true,
        },
        '@material-ui/icons': {
          transform: function (importName) {
            return `@material-ui/icons/${importName}`;
          },
          preventFullImport: true,
        },
      },
    ],
    isDevelopment && 'react-hot-loader/babel',
  ].filter(Boolean);

  return {
    presets,
    plugins,
  };
};
