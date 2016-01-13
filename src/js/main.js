console.log('main loaded');
require('./vendors-loaded.coffee')();
var $ = require('jquery');
require('jquery-ui/ui/widgets/dialog');
var ko = require('knockout');
console.log($, ko);
document.body.innerText = require('./dependency.js');
$(function(){
  $('<div title="Test">message</div>').dialog();
});
