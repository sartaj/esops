"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolve = exports.plugins = exports.paths = void 0;

var _webpack = _interopRequireDefault(require("webpack"));

var _cleanWebpackPlugin = _interopRequireDefault(require("clean-webpack-plugin"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable import/prefer-default-export */
const paths = ({
  buildPath,
  buildDir,
  entryPath
}) => ({
  entry: {
    runner: ['@esops/language-babel/polyfill', entryPath].map(require.resolve)
  },
  output: {
    filename: 'static/js/[name].[hash].js',
    library: ['[name]'],
    libraryTarget: 'umd',
    path: buildPath
  },
  devServer: {
    contentBase: buildDir
  },
  // Paths that can resolve in the require/import statements
  resolve: {
    extensions: ['.js', '.json', '.jsx', '.ts', '.tsx']
  },
  // The context in which webpack runs. In this case,
  // it runs within the context of this package, ntux.
  context: __dirname
});

exports.paths = paths;

const plugins = ({
  buildPath,
  chunk
}) => [new _cleanWebpackPlugin.default([buildPath], {
  allowExternal: true,
  verbose: false
}), chunk ? new _webpack.default.optimize.CommonsChunkPlugin({
  name: 'vendor',
  minChunks: 2
}) : () => {}];

exports.plugins = plugins;

const resolve = (packages, devMode) => {
  const hotReload = devMode ? 'webpack-hot-middleware/client?reload=true' : null;
  const packagePaths = packages.map(require.resolve);
  if (hotReload) return [hotReload, ...packagePaths];
  return packagePaths;
};

exports.resolve = resolve;