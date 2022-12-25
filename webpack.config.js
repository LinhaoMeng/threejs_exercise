const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  mode: 'development',
  entry: {
    'start': './src/start.js',
    'modelloader': './src/modelloader.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'index',
      filename: 'index.html',
      template: path.resolve(__dirname, 'src/index.html'),
      chunks: [], // or else it will add all chunks
    }),
    new HtmlWebpackPlugin({
      title: 'modelloader',
      filename: 'modelloader.html',
      chunks: ['modelloader'],
    }),
    new HtmlWebpackPlugin({
      title: 'start',
      filename: 'start.html',
      template: path.resolve(__dirname, 'src/start.html'),
      chunks: ['start'],
    }),
  ],
  devtool: 'inline-source-map', // map compiled code back to original code
  devServer: {
    static: './dist',
    hot: true, //this is default setting since webpack-dev-server 4.0 for hot module replacement(HRM)
    // devMiddleware: {
    //   index: true,
    //   mimeTypes: {
    //     phtml: 'text/html'
    //   },
    //   publicPath: '/publicPathForDevServe',
    //   serverSideRender: true,
    //   writeToDisk: true,
    // },
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true, // clean dist folder each time before the new bundle is created
    //publicPath: '/assets/'
  },
  module: {
    rules: [{
      test: /\.css$/i,
      use: ['style-loader', 'css-loader'],
    }]
  }
};