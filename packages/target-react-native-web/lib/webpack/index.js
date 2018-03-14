"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var core = _interopRequireWildcard(require("./features/core"));

var devtools = _interopRequireWildcard(require("./features/devtools"));

var javascript = _interopRequireWildcard(require("./features/javascript"));

var typescript = _interopRequireWildcard(require("./features/typescript"));

var assets = _interopRequireWildcard(require("./features/assets"));

var html = _interopRequireWildcard(require("./features/html"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

// import * as css from './features/css'

/**
 * Generates webpack config from preferences
 */
var _default = ({
  cwd,
  buildPath,
  buildDir,
  devMode,
  indexHtmlPath,
  entryPath,
  logoPath
}) => {
  /*eslint-disable*/
  process.env.BABEL_ENV = devMode;
  process.env.NODE_ENV = devMode;
  /*eslint-enable*/

  return { // Entry/output/resolve points
    ...core.paths({
      buildPath,
      buildDir,
      entryPath
    }),
    // Rules for different file types
    // module: { rules: utils.convertObjectToArray(rules) },
    module: {
      rules: [{
        oneOf: [assets.urls, javascript.rules, typescript.rules, // css.rules,
        assets.files // Defined last to be a catch all for if above files fail
        // WARNING: Don't add rules below assets.files. Add above.
        ]
      }]
    },
    // Plugins to do extra things to the package
    plugins: [...core.plugins({
      cwd,
      buildPath,
      chunk: true
    }), // ...css.plugins(),
    ...html.plugins({
      indexHtmlPath
    }), // ...assets.plugins({ logoPath }),
    ...(devMode ? devtools.plugins({
      cwd,
      buildDir
    }) : [])]
  };
};

exports.default = _default;