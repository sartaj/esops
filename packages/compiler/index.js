/* eslint-disable immutable/no-mutation */

import log from '../logger';

import createWebpackConfig from './webpack-config-generator';
import * as webpackUtils from './webpack-utils';
import generateBaseConfig from './config';

const showInitialLog = ({ cwd, devMode }) => {
  const logMessage = devMode ? 'starting dev environment...' : 'building package...';
  log.info(logMessage);
};

/**
 * type UserConfig = {
 *   cwd?: string, // current working directory path
 *   entryFile?: string, // entry relative directory/file name 
 *   buildDir?: string, // build folder relative directory 
 *   templatePath?: string, // template folder directory
 *   devMode?: boolean // if developer mode is set,
 * }
*/
export default function buildWithWebpack(userConfig) {
  const opts = generateBaseConfig(userConfig);
  const { devMode } = opts;

  // Logging to user
  showInitialLog(opts);

  // Create webpack compiler
  const webpackConfig = createWebpackConfig(opts);

  // Create Compiler
  const compiler = webpackUtils.createCompiler(webpackConfig);

  // Run webpack
  if (devMode) webpackUtils.startWebpackDevServer(compiler);
  else webpackUtils.createWebpackBuild(compiler);
}
