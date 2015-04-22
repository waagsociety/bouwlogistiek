var React = require('react');
var L = require('leaflet');
var d3 = require('d3');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      tileUrl: 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
      subdomains: 'abcd'
    };
  },

  render: function() {
    return (
      <div id='map'>
      </div>
    );
  },

  componentDidMount: function() {
    this.map = L.map('map', {
      subdomains: this.state.subdomains,
      attribution: this.state.attribution
    });

    L.tileLayer(this.state.tileUrl).addTo(this.map);
    this.projectsLayer = L.geoJson(null, {
      onEachFeature: function (feature, layer) {
        layer.on({
          click: function() {
            // TODO: only if new project
            this.routesLayer.clearLayers();

            this.props.setProject(feature, layer);
          }.bind(this)
        });
      }.bind(this)
    }).addTo(this.map);

    this.routesLayer = L.geoJson(null, {
      stroke: false,
      noClip: true
    }).addTo(this.map);

    this.map.setView([52.3728, 4.9002], 13);
    this.map.zoomControl.setPosition('topright');

    this.map.on('zoomend', function() {
      this.zoomend();
    }.bind(this));

    d3.json('data/projects.json', function(geojson) {
      this.projectsLayer.addData(geojson);
    }.bind(this));
  },

  zoomend: function() {
    var path = d3.selectAll('#map .route');


    setInterval(function () {
      path
        .attr('stroke-dasharray', function() {
          var totalLength = d3.select(this).node().getTotalLength();
          console.log(totalLength)
          return totalLength + " " + totalLength;
        })
        .attr('stroke-dashoffset', function() {
          return 0;//d3.select(this).node().getTotalLength();
        });

    }, 100);

  },

  animate: function(routes) {
    this.routesLayer.clearLayers();
    this.routesLayer.addData(routes);

    var path = d3.selectAll('#map .leaflet-zoom-animated path[stroke="none"]');

    path.classed('route', true);

    var colors = {
      sand: '#e6ab02',
      concrete: '#e7298a',
      a: '#1b9e77',
      b: '#d95f02',
      c: '#7570b3',
      d: '#66a61e'
    };

    path
      .attr('stroke-dasharray', function() {
        var totalLength = d3.select(this).node().getTotalLength();
        return totalLength + " " + totalLength;
      })
      .attr('stroke-dashoffset', function() {
        return d3.select(this).node().getTotalLength();
      })
      .attr('stroke', function(d, i) {
        return colors[routes.features[i].properties.type];
      })
      .attr('stroke-opacity', .4)
      .attr('stroke-width', 6)
      .transition()
        .delay(function(d, i) {
          return 3000 * Math.random();
        })
        .duration(5000)
        .ease('linear')
        .attr('stroke-dashoffset', 0);

  }

});
