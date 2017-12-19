import ManifestPlugin from 'webpack-manifest-plugin'

export const urls = {
  test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
  loader: require.resolve('url-loader'),
  options: {
    limit: 10000,
    name: 'static/media/[name].[hash:8].[ext]'
  }
}

export const files = {
  // Exclude `js` files to keep "css" loader working as it injects
  // it's runtime that would otherwise processed through "file" loader.
  // Also exclude `html` and `json` extensions so they get processed
  // by webpacks internal loaders.
  exclude: [/\.js$/, /\.html$/, /\.json$/, /\.css$/],
  loader: require.resolve('file-loader'),
  options: {
    name: 'static/media/[name].[hash:8].[ext]'
  }
}

export const plugins = () => [
  new ManifestPlugin({
    fileName: 'asset-manifest.json'
  })
]
