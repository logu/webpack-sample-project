var $ = require('jquery');
require('jquery-ui/ui/widgets/dialog');
var ko = require('knockout');
console.log($, ko);
document.body.innerText = require('./dependency.js');
jQuery(function(){
  jQuery('<div title="Test">message</div>').dialog();
});
