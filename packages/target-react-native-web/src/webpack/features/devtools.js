/* eslint-disable import/prefer-default-export */

import webpack from 'webpack'

export const plugins = () => [
  new webpack.HotModuleReplacementPlugin(),
  new webpack.SourceMapDevToolPlugin()
]
