var d3 = require('d3');

var urlPrefix = 'http://api.tiles.mapbox.com/v4/directions/mapbox.driving/';
var urlSuffix = '.json?access_token=pk.eyJ1IjoiYmVydHNwYWFuIiwiYSI6ImFFZEZaUUkifQ.OlDUkg5ymQC1LOUEyg9B5w';

var computedRoutes = {};

function getOriginDestinationHash(origin, destination) {
  return origin.concat(destination).map(function(f) {
    return f.toFixed(4);
  }).join(',');
}

function getRandomRoute(json) {
  var route = json.routes[Math.floor(Math.random() * json.routes.length)];
  return route.geometry;
}

exports.route = function(origin, destination, callback) {
  var hash = getOriginDestinationHash(origin, destination);
  if (computedRoutes[hash]) {
    callback(getRandomRoute(computedRoutes[hash]));
  } else {
    d3.json(urlPrefix + origin.join(',') + ';' + destination.join(',') + urlSuffix, function(json) {
      if (json.routes.length > 0) {
        computedRoutes[hash] = json;
        callback(getRandomRoute(computedRoutes[hash]));
      } else {
        callback(null);
      }
    });
  }
}
