import * as core from './features/core';
import * as devtools from './features/devtools';
import * as javascript from './features/javascript';
import * as typescript from './features/typescript';
import * as css from './features/css';
import * as assets from './features/assets';

/**
 * Generates webpack config from preferences
*/
export default ({ cwd, buildPath, buildDir, devMode, indexHtmlPath, entryPath }) => ({
  // Entry/output/resolve points
  ...core.paths({ buildPath, buildDir, entryPath }),

  // Rules for different file types
  // module: { rules: utils.convertObjectToArray(rules) },
  module: {
    rules: [{
      oneOf: [
        assets.urls,
        javascript.rules,
        typescript.rules,
        css.rules,
        assets.files, // Defined last to be a catch all for if above files fail
        // WARNING: Don't add rules below assets.files. Add above.
      ],
    }],
  },

  // Plugins to do extra things to the package
  plugins: [
    ...core.plugins({ cwd, buildPath }),
    ...css.plugins(),
    ...assets.plugins({ indexHtmlPath }),
    ...(devMode ? devtools.plugins({ cwd, buildDir }) : []),
  ],
});
