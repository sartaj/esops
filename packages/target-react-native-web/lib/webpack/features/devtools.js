"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.plugins = void 0;

var _webpack = _interopRequireDefault(require("webpack"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable import/prefer-default-export */
// import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
const plugins = () => [new _webpack.default.HotModuleReplacementPlugin(), new _webpack.default.SourceMapDevToolPlugin() // new BundleAnalyzerPlugin({
//   openAnalyzer: false
// })
];

exports.plugins = plugins;