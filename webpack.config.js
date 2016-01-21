var webpack = require('webpack');
//var ConcatSource = require("webpack-sources").ConcatSource;

var PROD = JSON.parse(process.env.PROD || '0');
var fs = require('fs');
var AssetsPlugin = require('assets-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var plugins = [ new AssetsPlugin()
  , new CleanWebpackPlugin(['dist'], {
      root: __dirname, verbose: true, dry: false
  })
];
plugins.push(function(){
  this.plugin('done', function(stats){
    var data = fs.readFileSync('index.html.tmpl', 'utf8');
    var appPath = PROD ? 'dist/main-' + stats.hash + '.min.js' : 'dist/app.js';
    var rendered = data.replace('APP_RESOURCE_JS_PATH', appPath);
    var vendorPath = PROD ? 'dist/vendor-' + stats.hash + '.min.js' :
      'dist/vendor.js';
    var rendered = rendered.replace('VENDOR_RESOURCE_JS_PATH', vendorPath);
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

//var SPLIT_VENDORS = false;
var SPLIT_VENDORS = true;

var UNSAFE_CACHE = false;
//var UNSAFE_CACHE = true;

module.exports = {
  context: __dirname + '/src'
  ,entry: { main: './js/main.js'
    , admin: './js/admin.js'
    , 'theme-a': './css/theme-a.js'
    , 'theme-b': './css/theme-b.js'
  }
  ,output: {
    publicPath: 'assets/'
    , path: __dirname + '/dist'
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
      , { test: /\.eco$/, loader: 'eco-loader' }
    ]
  }
  , devtool: SMAPS ? 'source-map' : ''
  , plugins: plugins
  , cache: true // speed up watch mode (in-memory caching only)
  , noParse: [ 'jquery'
    , 'jquery-ui'
  ]
  , resolve: {}
};

if (USE_MINIFIED_VENDORS) module.exports.resolve.alias = {
  jquery: __dirname + '/node_modules/jquery/dist/jquery.min.js'
  , knockout: __dirname + '/node_modules/knockout/build/output/knockout-latest.js'
};

if (UNSAFE_CACHE) module.exports.resolve.unsafeCache = true // [/\.js/, ...]

if (SPLIT_VENDORS) {
  module.exports.entry.vendor = ['jquery'
    , 'knockout'
    , 'jquery-ui/ui/widgets/dialog'
    , './js/ie8.js'
    , './js/vendors-loaded.coffee'
  ];
  vendorSuffix = suffix;
  if (PROD) vendorSuffix += '.min';
  plugins.push(new webpack.optimize.CommonsChunkPlugin({ name: 'vendor'
    , filename: 'vendor' + vendorSuffix + '.js'
    , minChunks: Infinity
  }));
};

plugins.push(function(){
  /*
  this.plugin('this-compilation', function(compilation) {
    function LoaderTemplate(){ }
    LoaderTemplate.prototype.apply = function(chunkTemplate) {
      chunkTemplate.plugin('render', function(modules, chunk){
        console.log('render', modules, chunk)
        var source = new ConcatSource();
        source.add('//added by me');
        source.add(modules);
        source.add('//finished by me');
        return source;
      });
    }
    compilation.chunkTemplate.apply(new LoaderTemplate());
  });
  */
  this.plugin('after-compile', function(compilation, callback){
    for (var file in compilation.assets) if (/\.js$/.test(file) && !(/^vendor/.test(file))) {
      if (/^(\d+\.)/.test(file)) continue;
      var children = compilation.assets[file].children;
      if (!children) continue;
      console.log('preparing ' + file + ' for async loading.');
      var source = children[0];
      /*
      var loaderPre = ';(function(){var check = function(){if (!window.webpackJsonp) {setTimeout(check, 10); return;}'
      var loaderPost = '}; check();})();'
      source._value = loaderPre + source._value + loaderPost;
      */
      source._value = source._value.replace(/^webpackJsonp/, 'webpackJsonx');
    }
    callback();
  });
});

if (PROD) plugins.push(new webpack.optimize.UglifyJsPlugin({ minimize: true
  , compress: { warnings: false } }));
