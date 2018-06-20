/* eslint-disable import/prefer-default-export */

import webpack from 'webpack'
import CleanWebpackPlugin from 'clean-webpack-plugin'

export const paths = ({ buildPath, buildDir, entryPath, publicPath }) => ({
  entry: {
    runner: ['@esops/language-babel/polyfill', entryPath].map(require.resolve)
  },

  output: {
    filename: 'static/js/[name].[hash].js',
    library: ['[name]'],
    libraryTarget: 'umd',
    path: buildPath,
    publicPath: '/'
  },

  devServer: {
    contentBase: buildDir
  },

  // Paths that can resolve in the require/import statements
  resolve: {
    extensions: ['.js', '.json', '.jsx', '.ts', '.tsx']
  },

  // The context in which webpack runs. In this case,
  // it runs within the context of this package, ntux.
  context: __dirname
})

export const plugins = ({ buildPath }) => [
  new CleanWebpackPlugin([buildPath], { allowExternal: true, verbose: false })
]

export const resolve = (packages, devMode) => {
  const hotReload = devMode ? 'webpack-hot-middleware/client?reload=true' : null
  const packagePaths = packages.map(require.resolve)
  if (hotReload) return [hotReload, ...packagePaths]
  return packagePaths
}
