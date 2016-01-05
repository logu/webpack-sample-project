var webpack = require('webpack');
var PROD = JSON.parse(process.env.PROD || '0');
var fs = require('fs');
var AssetsPlugin = require('assets-webpack-plugin');
var plugins = [ new AssetsPlugin() ];
if (PROD) plugins.push(new webpack.optimize.UglifyJsPlugin({minimize: true}));
plugins.push(function(){
  this.plugin('done', function(stats){
    var data = fs.readFileSync('index.html.tmpl', 'utf8');
    var appPath = PROD ? 'dist/app-' + stats.hash + '.min.js' : 'dist/app.js';
    var rendered = data.replace('APP_RESOURCE_PATH', appPath);
    fs.writeFileSync('index.html', rendered);
  });
});

module.exports = {
    entry:
    { main: './src/js/main.js'
    }
    ,output: {
        publicPath: 'assets/',
        path: './dist',
        filename: PROD ? 'app-[hash].min.js' : 'app.js'
    }
    ,module: {
        loaders: [
            { test: /\.css$/, loader: 'style!css' }
          , { test: /\.coffee$/, loader: 'coffee-loader' }
        ]
    }
    , devtool: 'source-map'
    , plugins: plugins
};
