/* eslint-disable import/prefer-default-export */

import webpack from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

export const plugins = () => ([
  new webpack.SourceMapDevToolPlugin(),
  new BundleAnalyzerPlugin({
    openAnalyzer: false,
  }),
]);
