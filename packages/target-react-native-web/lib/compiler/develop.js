"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = start;
exports.configDeployedMiddleware = exports.configDevMiddleware = void 0;

var _path = _interopRequireDefault(require("path"));

var _express = _interopRequireDefault(require("express"));

var _webpack = _interopRequireDefault(require("webpack"));

var _webpackDevMiddleware = _interopRequireDefault(require("webpack-dev-middleware"));

var _webpackHotMiddleware = _interopRequireDefault(require("webpack-hot-middleware"));

var _logger = _interopRequireDefault(require("@esops/logger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-console */
const configDevMiddleware = (app, config, opts) => {
  const compiler = (0, _webpack.default)(config);
  const middleware = (0, _webpackDevMiddleware.default)(compiler, {
    publicPath: config.output.cwd,
    contentBase: 'src',
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false
    }
  });
  app.use(middleware);
  app.use((0, _webpackHotMiddleware.default)(compiler));
  app.get('*', (req, res) => {
    res.write(middleware.fileSystem.readFileSync(_path.default.join(opts.buildPath, 'index.html')));
    res.end();
  });
};

exports.configDevMiddleware = configDevMiddleware;

const configDeployedMiddleware = (app, opts) => {
  app.use(_express.default.static(opts.buildPath));
  app.get('*', (req, res) => {
    res.sendFile(_path.default.join(opts.buildPath, 'index.html'));
  });
};

exports.configDeployedMiddleware = configDeployedMiddleware;

const serverBox = port => `🌎  Your static web dev environment is live! 🌎
http://localhost:${port}
Please open this link in your browser 
to begin initial build.`;

async function start(opts, webpackConfig) {
  const {
    port
  } = opts;
  const config = webpackConfig;
  const isDeveloping = opts.devMode;
  const app = (0, _express.default)();
  if (isDeveloping) configDevMiddleware(app, config, opts);else configDeployedMiddleware(app, opts);
  app.listen(port, 'localhost', err => {
    if (err) _logger.default.error(err);else {
      // carlton()
      _logger.default.announce(serverBox(port));
    }
  });
  return app;
}