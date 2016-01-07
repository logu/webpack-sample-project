var webpack = require('webpack');
var PROD = JSON.parse(process.env.PROD || '0');
var fs = require('fs');
var AssetsPlugin = require('assets-webpack-plugin');
var plugins = [ new AssetsPlugin() ];
if (PROD) plugins.push(new webpack.optimize.UglifyJsPlugin({minimize: true }));
//  , exclude: /(\.min|knockout-latest)\.js/
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

//var SMAPS = false;
var SMAPS = true;
var smSuffix = SMAPS ? '?sourceMap' : ''; //'?-minimize&-autoprefixer';

//var USE_MINIFIED_VENDORS = false;
var USE_MINIFIED_VENDORS = true;

module.exports = {
  entry:
  { main: './src/js/main'
    , 'theme-a': './src/css/theme-a.js'
    , 'theme-b': './src/css/theme-b.js'
  }
  ,output: {
    publicPath: 'assets/'
    , path: './dist'
    , filename: PROD ? '[name]-[hash].min.js' : '[name].js'
  }
  ,resolveLoader: {
    alias: { 'ko-loader': __dirname + '/loaders/ko-loader'
    }
  }
  ,module: {
    loaders: [
      { test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style', 'css' + smSuffix + '!sass' + smSuffix) }
        //loader: ['style', 'css' + smSuffix, 'sass' + smSuffix] }
      ,
      { test: /\.css$/, loader: ExtractTextPlugin.extract('style', 'css' + smSuffix) }
        //loader: 'style!css'
      , { test: /\.coffee$/, loader: 'coffee' }
      , { test: /\.png$/, loader: 'url?mimetype=image/png&limit=50000'}
      , { test: /knockout-latest\.debug\.js$/, loader: 'ko-loader'}
    ]
  }
  , devtool: SMAPS ? 'source-map' : ''
  , plugins: plugins
  , cache: true // speed up watch mode (in-memory caching only)
  , noParse: [ 'jquery'
    , 'jquery-ui'
  ]
};

if (USE_MINIFIED_VENDORS) module.exports.resolve = {
  alias: { 'jquery': __dirname + '/node_modules/jquery/dist/jquery.min.js'
    ,'knockout': __dirname + '/node_modules/knockout/build/output/knockout-latest.js'
  }
}
