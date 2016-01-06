// Allow KO to work with jQuery without requiring jQuery to be exported to window
module.exports = function(source) {
  this.cacheable();
  return source.replace('jQueryInstance = window["jQuery"]', 'jQueryInstance = require("jquery")');
};
