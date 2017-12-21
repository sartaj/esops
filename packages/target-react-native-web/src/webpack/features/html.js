import HtmlWebpackPlugin from 'html-webpack-plugin'

export const plugins = ({ indexHtmlPath }) => [
  new HtmlWebpackPlugin({
    inject: true,
    template: indexHtmlPath,
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
]
