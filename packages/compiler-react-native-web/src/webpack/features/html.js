/* eslint-disable import/prefer-default-export */

import HtmlWebpackPlugin from 'html-webpack-plugin'
// import PreloadWebpackPlugin from 'preload-webpack-plugin'

export const plugins = ({ indexHtmlPath }) => [
  new HtmlWebpackPlugin({
    inject: true,
    // template: indexHtmlPath || null,
    minify: {
      removeComments: true,
      collapseWhitespace: true,
      removeRedundantAttributes: true,
      useShortDoctype: true,
      removeEmptyAttributes: true,
      removeStyleLinkTypeAttributes: true,
      keepClosingSlash: true,
      minifyJS: true,
      minifyCSS: true,
      minifyURLs: true
    }
  })
  // new PreloadWebpackPlugin(),
]
