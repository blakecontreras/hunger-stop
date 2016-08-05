require('babel-register')();

function noop() {
  return null;
}
require.extensions['.css'] = noop;

var jsdom = require('jsdom').jsdom;

var exposedProperties = ['window', 'navigator', 'document'];

global.document =
jsdom('<head><script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAdfmmWKgIZlM2Uijsn4w1l0AznzAray8Y"></script></head><body><div id="app"></div></body>');
global.window = document.defaultView;
Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    exposedProperties.push(property);
    global[property] = document.defaultView[property];
  }
});


global.navigator = {
  userAgent: 'node.js'
};

documentRef = document;
