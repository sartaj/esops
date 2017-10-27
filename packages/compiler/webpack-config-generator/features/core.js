/* eslint-disable import/prefer-default-export */

import webpack from 'webpack';
import CleanWebpackPlugin from 'clean-webpack-plugin';

export const paths = ({ buildPath, buildDir, entryPath, libraryName }) => ({
  entry: {
    main: ['babel-polyfill', entryPath].map(require.resolve)
  },

  output: {
    filename: `${libraryName}.[name].[chunkhash].js`,
    library: [libraryName],
    libraryTarget: 'umd',
    path: buildPath,
  },

  devServer: {
    contentBase: buildDir,
  },

  // Paths that can resolve in the require/import statements
  resolve: {
    extensions: ['.js', '.json', '.jsx', '.ts', '.tsx'],
  },

  // Run the webpack that is within this packages context.
  context: __dirname,
});

export const plugins = ({ buildPath }) => ([

  new CleanWebpackPlugin([buildPath], { allowExternal: true }),

  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    minChunks: Infinity,
  }),

]);
