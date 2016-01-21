//console.log('main loaded');
require('./vendors-loaded.coffee')();
var $ = require('jquery');
var ko = require('knockout');
//console.log($, ko);
var view = require('../views/main.eco')
document.body.innerHTML = require('./dependency.js') + view({label: 'M & M'});
  /*
require('jquery-ui/ui/widgets/dialog');
require('jquery-ui/themes/base/dialog.css');
require('jquery-ui/themes/base/button.css');
*/
require(['jquery-ui/ui/widgets/dialog', 'jquery-ui/themes/base/dialog.css',
  'jquery-ui/themes/base/button.css'], function(){
$(function(){
  $('<div title="Test">message</div>').dialog();
});
  });
