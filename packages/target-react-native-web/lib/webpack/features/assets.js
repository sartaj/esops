"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.plugins = exports.files = exports.urls = void 0;

var _webpackManifestPlugin = _interopRequireDefault(require("webpack-manifest-plugin"));

var _faviconsWebpackPlugin = _interopRequireDefault(require("favicons-webpack-plugin"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const urls = {
  test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
  loader: require.resolve('url-loader'),
  options: {
    limit: 10000,
    name: 'static/media/[name].[hash:8].[ext]'
  }
};
exports.urls = urls;
const files = {
  // Exclude `js` files to keep "css" loader working as it injects
  // it's runtime that would otherwise processed through "file" loader.
  // Also exclude `html` and `json` extensions so they get processed
  // by webpacks internal loaders.
  exclude: [/\.js$/, /\.html$/, /\.json$/, /\.css$/],
  loader: require.resolve('file-loader'),
  options: {
    name: 'static/media/[name].[hash:8].[ext]'
  }
};
exports.files = files;

const plugins = ({
  logoPath
}) => [new _webpackManifestPlugin.default({
  fileName: 'asset-manifest.json'
}), logoPath ? new _faviconsWebpackPlugin.default(logoPath) : null];

exports.plugins = plugins;