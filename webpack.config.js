var webpack = require('webpack');
var PROD = JSON.parse(process.env.PROD || '0');
var fs = require('fs');
var AssetsPlugin = require('assets-webpack-plugin');
var plugins = [ new AssetsPlugin() ];
if (PROD) plugins.push(new webpack.optimize.UglifyJsPlugin({minimize: true}));
plugins.push(function(){
  this.plugin('done', function(stats){
    var data = fs.readFileSync('index.html.tmpl', 'utf8');
    var appPath = PROD ? 'dist/main-' + stats.hash + '.min.js' : 'dist/app.js';
    var rendered = data.replace('APP_RESOURCE_JS_PATH', appPath);
    ['a', 'b'].forEach(function(theme){
      var cssPath = PROD ? 'dist/theme-' + theme + '-' + stats.hash + '.css' :
        'dist/theme-' + theme + '.css';
      themedIndex = rendered.replace('APP_RESOURCE_CSS_PATH', cssPath);
      fs.writeFileSync('index-' + theme + '.html', themedIndex);
    });
  });
});

var ExtractTextPlugin = require('extract-text-webpack-plugin');
suffix = PROD ? '-[hash]' : ''
plugins.push(new ExtractTextPlugin('[name]' + suffix + '.css'));
//plugins.push(new ExtractTextPlugin('app.css'));


module.exports = {
    entry:
    { main: './src/js/main'
      ,'theme-a': './src/css/theme-a.js'
      ,'theme-b': './src/css/theme-b.js'
    }
    ,output: {
        publicPath: 'assets/',
        path: './dist',
        filename: PROD ? '[name]-[hash].min.js' : '[name].js'
        //filename: '[name].js'
    }
    ,module: {
        loaders: [
            { test: /\.css$/,
              loader: ExtractTextPlugin.extract("style-loader", "css-loader")
              //loader: 'style!css'
            }
          , { test: /\.coffee$/, loader: 'coffee-loader' }
        ]
    }
    , devtool: 'source-map'
    , plugins: plugins
};
