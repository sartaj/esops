"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _webpackNodeExternals = _interopRequireDefault(require("webpack-node-externals"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = () => ({
  target: 'node',
  // in order to ignore built-in modules like path, fs, etc.
  externals: [(0, _webpackNodeExternals.default)()] // in order to ignore all modules in node_modules folder

});

exports.default = _default;