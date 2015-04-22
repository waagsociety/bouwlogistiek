var React = require('react');
var d3 = require('d3');
var async = require('async');

var Map = require('./map');
var Project = require('./project');

var logistics = require('../utils/logistics');
var routing = require('../utils/routing');
var calendar = require('../utils/calendar');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      project: null,
      routes: {}
    };
  },

  componentDidMount: function() {
    d3.json('data/suppliers.json', function(geojson) {
      this.setState({
        suppliers: geojson
      });
    }.bind(this));
  },

  render: function() {
    return (
      <div>
        <Map setProject={this.setProject} ref='map' />
        <Project project={this.state.project} startAnimation={this.startAnimation} />
      </div>
    )
  },

  setProject: function(feature, layer) {
    this.setState({
      project: {
        feature: feature,
        layer: layer
      }
    });
  },

  startAnimation: function() {
    var dateStart = this.state.project.feature.properties.dateStart;
    var dateEnd = this.state.project.feature.properties.dateEnd;
    var diffDays = calendar.diffDays(dateStart, dateEnd);

    var calculation = logistics.calculate(this.state.project.feature.properties.size, diffDays);
    var suppliers = logistics.getSuppliers(calculation, this.state.suppliers);

    async.map(suppliers.features, function(supplier, callback) {
        var origin = supplier.geometry.coordinates;
        var projectCenter = this.state.project.layer.getBounds().getCenter();
        var destination = [projectCenter.lng, projectCenter.lat];

        routing.route(origin, destination, function(geometry) {
          callback(null, {
            type: 'Feature',
            properties: supplier.properties,
            geometry: geometry
          });
        });

      }.bind(this)
      , function(err, routes) {
        this.refs.map.animate({
          type: 'FeatureCollection',
          features: routes
        });
      }.bind(this));
  }

});
