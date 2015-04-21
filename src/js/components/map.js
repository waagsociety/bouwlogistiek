var React = require('react');
var L = require('leaflet');

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
            this.props.setProject(feature, layer);
          }.bind(this)
        });
      }.bind(this)
    }).addTo(this.map);

    // var routesLayer = L.geoJson(null, {
    //   stroke: false,
    //   noClip: true
    // }).addTo(map);

    this.map.setView([52.3728, 4.9002], 13);
    this.map.zoomControl.setPosition('topright');

    d3.json('data/projects.json', function(geojson) {
      this.projectsLayer.addData(geojson);
    }.bind(this));
  },

  animate: function(routes) {
    console.log(routes);

    // setTimeout(function() {
    //   var vivus = new Vivus(geojsonSvg.id, {type: 'oneByOne', duration: 200, start: 'autostart'});
    // }, 3000);
    // routesLayer.setStyle({
    //   stroke: true
    // })
    //
    // var geojsonSvgId = "geojson-svg",
    //     geojsonSvg = document.querySelector("#map svg.leaflet-zoom-animated");
    // geojsonSvg.id = geojsonSvgId;
    //
    // setTimeout(function(){
    //   var vivus = new Vivus(geojsonSvg.id, {type: 'oneByOne', duration: 200, start: 'autostart'});
    // }, 3000);
    //
    // vivus
    //   .stop()
    //   .reset()
    //   .play(2)


  }

});
