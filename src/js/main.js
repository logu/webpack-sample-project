console.log('main loaded');
require('./vendors-loaded.coffee')();
var $ = require('jquery');
require('jquery-ui/ui/widgets/dialog');
var ko = require('knockout');
console.log($, ko);
var view = require('../views/main.eco')
document.body.innerHTML = require('./dependency.js') + view({label: 'M & M'});
$(function(){
  $('<div title="Test">message</div>').dialog();
});
