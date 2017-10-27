import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';

import log from '../../logger';

export const createCompiler = config => webpack(config);

export const startWebpackDevServer = (compiler) => {
  new WebpackDevServer(compiler, {
    hot: true,
    stats: { colors: true },
    headers: { 'Access-Control-Allow-Origin': '*' },
    open: true,
    overlay: true,
  }).listen(8080, 'localhost', (err) => {
    if (err) log.error(err);
  });

  compiler.plugin('after-emit', () => {
    log.info('dev server ready... http://localhost:8080');
  });
};

export const createWebpackBuild = (compiler) => {
  compiler.run((err) => {
    if (err) {
      log.error(err);
    } else {
      log.info('Done. 🙌 .');
    }
  });
};

