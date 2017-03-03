var webpack = require('webpack')
var ExtractTextPlugin = require("extract-text-webpack-plugin")
var extractCSS = new ExtractTextPlugin('build/assets/css/bundle.css')

var config = {
  entry: [
    'babel-polyfill', './src/main.js'
  ],
  output: {
    filename: 'build/bundle.js'
  },
  module: {
    loaders: [
      { test: /\.js?$/, loaders: ['babel-loader?presets[]=react&presets[]=es2015&presets[]=stage-0'], exclude: /node_modules/ },
      { test: /\.scss$/, loader: extractCSS.extract(['css-loader', 'sass-loader']) },
      { test: /\.(woff(2)?)(\?[a-z0-9]+)?$/, loader: 'file-loader?name=build/fonts/custom/[name].[ext]' },
      { test: /\.(png|svg)$/, loader: 'file-loader?name=img/[name].[ext]' }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      '__PROD__': true
    }),
    new webpack.NoErrorsPlugin(),
    extractCSS,
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.optimize.DedupePlugin()
  ]
}

module.exports = config
