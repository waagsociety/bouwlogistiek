var d3 = require('d3');

var urlPrefix = 'http://api.tiles.mapbox.com/v4/directions/mapbox.driving/';
var urlSuffix = '.json?access_token=pk.eyJ1IjoiYmVydHNwYWFuIiwiYSI6ImFFZEZaUUkifQ.OlDUkg5ymQC1LOUEyg9B5w';

var computedRoutes = {};

function getOriginDestinationHash(origin, destination) {
  return origin.concat(destination).map(function(f) {
    return f.toFixed(4);
  }).join(',');
}

exports.route = function(origin, destination, callback) {
  var hash = getOriginDestinationHash(origin, destination);
  if (computedRoutes[hash]) {
    callback(computedRoutes[hash]);
  } else {
    d3.json(urlPrefix + origin.join(',') + ';' + destination.join(',') + urlSuffix, function(json) {
      if (json.routes.length > 0) {
        var geometry = json.routes[0].geometry;
        computedRoutes[hash] = geometry;
        callback(geometry);
      } else {
        callback(null);
      }
    });
  }
}
