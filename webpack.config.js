var webpack = require('webpack')

var config = {
  entry: [
    'webpack-dev-server/client?http://0.0.0.0:3000',
    './src/main.js'
  ],
  output: {
    filename: 'build/bundle.js'
  },
  module: {
    loaders: [
      { test: /\.js?$/, loaders: ['babel-loader?presets[]=react&presets[]=es2015&presets[]=stage-0'], exclude: /node_modules/ },
      { test: /\.scss$/, loaders: ['style-loader', 'css-loader', 'sass-loader'] },
      { test: /\.(woff(2)?)(\?[a-z0-9]+)?$/, loader: 'file-loader?name=fonts/custom/[name].[ext]' },
      { test: /\.(png|svg)$/, loader: 'file-loader?name=img/[name].[ext]' }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      '__DEV__': true
    })
  ]
}

module.exports = config
