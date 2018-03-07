"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.plugins = void 0;

var _htmlWebpackPlugin = _interopRequireDefault(require("html-webpack-plugin"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const plugins = ({
  indexHtmlPath
}) => [new _htmlWebpackPlugin.default({
  inject: true,
  template: indexHtmlPath,
  minify: {
    removeComments: true,
    collapseWhitespace: true,
    removeRedundantAttributes: true,
    useShortDoctype: true,
    removeEmptyAttributes: true,
    removeStyleLinkTypeAttributes: true,
    keepClosingSlash: true,
    minifyJS: true,
    minifyCSS: true,
    minifyURLs: true
  }
})];

exports.plugins = plugins;