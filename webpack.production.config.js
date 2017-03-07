var webpack     = require('webpack')
var ExtractText = require('extract-text-webpack-plugin')
var OptimizeCSS = require('optimize-css-assets-webpack-plugin')
var extractCSS  = new ExtractText('build/assets/css/bundle.css')

var config = {
  entry   : [
    'babel-polyfill',
    './src/main.js'
  ],
  output  : {
    filename : 'build/bundle.js'
  },
  module  : {
    loaders : [
      {
        test    : /\.js?$/,
        loaders : [ 'babel-loader?presets[]=react&presets[]=es2015&presets[]=stage-0' ],
        exclude : /node_modules/
      },
      {
        test   : /\.scss$/,
        loader : extractCSS.extract([
          'css-loader',
          'sass-loader'
        ])
      },
      {
        test   : /\.(woff(2)?)(\?[a-z0-9]+)?$/,
        loader : 'file-loader?name=build/fonts/custom/[name].[ext]'
      },
      {
        test   : /\.(png|svg)$/,
        loader : 'file-loader?name=img/[name].[ext]'
      }
    ]
  },
  plugins : [
    new webpack.DefinePlugin({
      'process.env' : {
        NODE_ENV : JSON.stringify('production')
      }
    }),
    extractCSS,
    new OptimizeCSS({
      assetNameRegExp     : /bundle\.css$/g,
      cssProcessor        : require('cssnano'),
      cssProcessorOptions : { discardComments : { removeAll : true } },
      canPrint            : true
    }),
    new webpack.optimize.UglifyJsPlugin({
      minimize : true,
      compress : {
        warnings : false
      }
    })
  ]
}

module.exports = config
