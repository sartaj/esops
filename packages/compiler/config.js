import path from 'path';

/**
 * Base Configuration
 */

const { cwd, entryFile, buildDir, templatePath, devMode } = {
  cwd: process.cwd(),
  entryFile: 'index.js',
  buildDir: '/dist',
  templatePath: path.join(__dirname, '../', 'templates'),
  devMode: false,
};

export default userConfigs => ({
  ...{
    cwd,
    devMode,
    entryFile,
    entryPath: path.join(cwd, entryFile),
    buildDir,
    buildPath: path.join(cwd, buildDir),
    templatePath,
    indexHtmlPath: path.join(templatePath, 'index.html'),
  },
  ...userConfigs,
});
