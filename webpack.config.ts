import { Configuration, DefinePlugin, HotModuleReplacementPlugin, ProgressPlugin } from 'webpack';
import fs from 'fs';
import glob from 'glob';
import path from 'path';

// Share Plugins
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import PurgecssPlugin from 'purgecss-webpack-plugin';

// Dev plugins
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

// Prod plugins
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import OptimizeCssAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import SafeParser from 'postcss-safe-parser';
import CompressionPlugin from 'compression-webpack-plugin';
import WorkboxPlugin from 'workbox-webpack-plugin';

const paths = {
  root: path.resolve(__dirname, '.'),
  src: path.resolve(__dirname, 'src'),
  dist: path.resolve(__dirname, 'dist'),
  public: path.resolve(__dirname, 'public'),
  publicPath: process.env.PUBLIC_PATH || '/',

  entry: path.resolve(__dirname, 'src', 'main.tsx'),
  htmlTemplate: path.resolve(__dirname, 'public', 'index.html'),

  // dev server
  https: Boolean(process.env.HTTPS) || false,
  host: process.env.HOST || '0.0.0.0',
  port: Number(process.env.PORT) || 3000,
};

const getEnvironmentVariables = (environment: string) => {
  const dotenvFiles = [`.env.${environment}.local`, `.env.${environment}`, '.env'];
  const environmentVariables: { [key: string]: any } = {
    NODE_ENV: environment,
  };

  dotenvFiles.forEach((dotenvFile) => {
    if (fs.existsSync(dotenvFile)) {
      const envConfig = dotenv.config({ path: dotenvFile });

      dotenvExpand(envConfig);

      if (envConfig.parsed) {
        Object.keys(envConfig.parsed).forEach(
          (key) => (environmentVariables[`${key}`] = envConfig.parsed![key])
        );
      }
    }
  });

  environmentVariables['PUBLIC_PATH'] = paths.publicPath;

  const processEnv = {
    'process.env': Object.keys(environmentVariables).reduce((env: { [key: string]: any }, key) => {
      env[key] = JSON.stringify(environmentVariables[key]);

      return env;
    }, {}),
  };

  return {
    environmentVariables,
    processEnv,
  };
};

const getStyleLoaders = (isDevelopment: boolean) => {
  if (isDevelopment) {
    return {
      test: /\.(sa|sc|c)ss$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
    };
  }

  return {
    test: /\.(sa|sc|c)ss$/,
    use: [
      MiniCssExtractPlugin.loader,
      {
        loader: 'css-loader',
        options: {
          importLoaders: 1,
          sourceMap: false,
        },
      },
      {
        loader: 'postcss-loader',
        options: {
          postcssOptions: {
            ident: 'postcss',
            plugins: [
              require('postcss-flexbugs-fixes'),
              // eslint-disable-next-line @typescript-eslint/no-var-requires
              require('postcss-preset-env')({
                autoprefixer: {
                  flexbox: 'no-2009',
                },
                stage: 3,
              }),
            ],
            sourceMap: false,
          },
        },
      },
      {
        loader: 'sass-loader',
        options: {
          sourceMap: false,
        },
      },
    ],
  };
};

module.exports = (_env: { [key: string]: any }, argv: { [key: string]: any }) => {
  process.env.BABEL_ENV = argv.mode;

  const isDevelopment = argv.mode == 'development';
  const isProduction = argv.mode == 'production';

  const { environmentVariables, processEnv } = getEnvironmentVariables(argv.mode);

  const config: Configuration = {
    bail: true,
    cache: true,
    context: paths.root,
    entry: paths.entry,
    mode: argv.mode,
    node: {
      __dirname: false,
      __filename: false,
    },
    module: {
      strictExportPresence: true,
      rules: [
        {
          enforce: 'pre',
          exclude: /node_modules/,
          include: /src/,
          loader: 'eslint-loader',
          test: /\.(j|t)sx?$/,
        },
        {
          oneOf: [
            {
              exclude: /node_modules/,
              include: /src/,
              test: /\.(j|t)sx?$/,
              use: {
                loader: 'babel-loader',
              },
            },
            getStyleLoaders(isDevelopment),
            {
              test: /\.(bmp|gif|jpe?g|png|svg)$/,
              use: {
                loader: 'url-loader',
                options: {
                  limit: 10000,
                  name: 'static/media/[name].[contenthash:8].[ext]',
                },
              },
            },
            {
              exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
              use: {
                loader: 'file-loader',
                options: {
                  name: 'static/media/[name].[contenthash:8].[ext]',
                },
              },
            },
          ],
        },
      ],
    },
    optimization: {
      mergeDuplicateChunks: true,
      minimize: isProduction,
      minimizer: [
        // This is only used in production mode
        new TerserPlugin({
          parallel: true,
          terserOptions: {
            compress: {
              ecma: 5,
              warnings: false,
              comparisons: false,
              inline: 2,
            },
            mangle: {
              safari10: true,
            },
            parse: {
              ecma: 8,
            },
            output: {
              ecma: 5,
              comments: false,
              ascii_only: true,
            },
          },
        }) as any,
        new OptimizeCssAssetsPlugin({
          cssProcessorOptions: {
            parser: SafeParser,
            map: false,
            discardComments: {
              removeAll: true,
            },
          },
        }),
      ],
      nodeEnv: argv.mode,
      removeAvailableModules: true,
      removeEmptyChunks: true,
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        name: false,
      },
    },
    output: {
      chunkFilename: `static/js/[name].[${isDevelopment ? 'hash' : 'contenthash:8'}].js`,
      filename: `static/js/[name].[${isDevelopment ? 'hash' : 'contenthash:8'}].chunk.js`,
      path: paths.dist,
      pathinfo: isDevelopment,
      publicPath: paths.publicPath,
    },
    performance: false,
    plugins: [
      new CleanWebpackPlugin(),
      new ProgressPlugin({
        profile: isDevelopment,
      }),
      new HtmlWebpackPlugin({
        cache: true,
        inject: true,
        minify: !isDevelopment,
        template: paths.htmlTemplate,
        templateParameters: environmentVariables,
      }),
      new DefinePlugin(processEnv),
      new CopyPlugin({
        patterns: [
          {
            from: paths.public,
            to: paths.dist,
          },
        ],
      }),
      new MiniCssExtractPlugin({
        chunkFilename: `static/css/[name].[${isDevelopment ? 'hash' : 'contenthash:8'}].chunk.css`,
        filename: `static/css/[name].[${isDevelopment ? 'hash' : 'contenthash:8'}].css`,
      }),
      new PurgecssPlugin({
        paths: glob.sync(`${paths.src}/**/*`, { nodir: true }),
      }),
      isDevelopment && new HotModuleReplacementPlugin(),
      isDevelopment && new CaseSensitivePathsPlugin(),
      isDevelopment &&
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
        }),
      !isDevelopment &&
        new CompressionPlugin({
          filename: '[path][base].gz',
          algorithm: 'gzip',
          test: /\.js$|\.css$|\.html$/,
          threshold: 10240,
          minRatio: 0.8,
        }),
      !isDevelopment &&
        new CompressionPlugin({
          filename: '[path][base].br',
          algorithm: 'brotliCompress',
          test: /\.(js|css|html|svg)$/,
          compressionOptions: {
            level: 11,
          },
          threshold: 10240,
          minRatio: 0.8,
        }),
      !isDevelopment &&
        new WorkboxPlugin.GenerateSW({
          clientsClaim: true,
          exclude: [/\.map$/, /\.gz$/],
          // importWorkboxFrom: 'cdn',
          navigateFallback: '/index.html',
          navigateFallbackDenylist: [new RegExp('^/_'), new RegExp('/[^/]+\\.[^/]+$')],
          swDest: 'service-worker.js',
          skipWaiting: true,
          // precacheManifestFilename: 'precache-manifest.[manifestHash].js'
        }),
    ].filter(Boolean),
    profile: isDevelopment,
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      modules: ['node_modules', 'src'],
    },
    stats: {
      colors: true,
      errors: true,
      modules: false,
    },
    target: 'web',
  };

  if (isDevelopment) {
    config.devtool = 'cheap-module-source-map';

    config.output!.devtoolModuleFilenameTemplate = (info: any) =>
      path.resolve(info.absoluteResourcePath).replace(/\\/g, '/');

    config.devServer = {
      compress: true,
      contentBase: paths.public,
      // contentBasePublicPath: paths.publicPath,
      disableHostCheck: true,
      historyApiFallback: true,
      host: paths.host,
      hot: true,
      https: paths.https,
      inline: true,
      open: true,
      overlay: true,
      port: paths.port,
      public: `http://localhost:${paths.port}`,
      publicPath: paths.publicPath,
      stats: {
        colors: true,
        errors: true,
        modules: false,
      },
      useLocalIp: true,
      // watchContentBase: true,
    };
  }

  return config;
};
