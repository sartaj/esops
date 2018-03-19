import HtmlWebpackPlugin from 'html-webpack-plugin'

export const plugins = ({ indexHtmlPath, htmlOpts }) => [
  new HtmlWebpackPlugin({
    inject: true,
    template: indexHtmlPath, // require('html-webpack-template')
    ...htmlOpts
    // minify: {
    //   removeComments: true,
    //   collapseWhitespace: true,
    //   removeRedundantAttributes: true,
    //   useShortDoctype: true,
    //   removeEmptyAttributes: true,
    //   removeStyleLinkTypeAttributes: true,
    //   keepClosingSlash: true,
    //   minifyJS: true,
    //   minifyCSS: true,
    //   minifyURLs: true
    // }
  })
]
