"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _webpack = _interopRequireDefault(require("webpack"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-console */
var _default = async config => {
  const compiler = (0, _webpack.default)(config);
  return new Promise((resolve, reject) => {
    compiler.run(err => {
      if (err) reject(err);
      resolve();
    });
  });
};

exports.default = _default;