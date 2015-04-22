var React = require('react');
var moment = require('moment');

var calendar = require('../utils/calendar');

module.exports = React.createClass({
  getInitialState: function() {
    return {
    };
  },

  render: function() {
    if (this.props.project) {
      var feature = this.props.project.feature;
      var dateStart = moment(feature.properties.dateStart).format('MMMM Do YYYY');
      var dateEnd = moment(feature.properties.dateEnd).format('MMMM Do YYYY');

      var diffDays = calendar.diffDays(feature.properties.dateStart, feature.properties.dateEnd);
      var duration = Math.round(diffDays / 7) + ' weken';

      return (
        <div className='sidebar-container'>
          <div className='sidebar-container-padding'>
            <div id='project' className='sidebar padding'>
              <h1>{feature.properties.title}</h1>
              {feature.properties.img ? <img src={'images/' + feature.properties.img} /> : ''}
              <table>
                <tbody>
                  <tr><td>Startdatum</td><td>{dateStart}</td></tr>
                  <tr><td>Einddatum</td><td>{dateEnd}</td></tr>
                  <tr><td>Duur</td><td>{duration}</td></tr>
                  <tr><td>Omvang</td><td>{feature.properties.size + ' m³'}</td></tr>
                </tbody>
              </table>
              <p>
                <button onClick={this.startAnimation}>Start animatie!</button>
              </p>
            </div>
          </div>
        </div>
      )
    } else {
      return null;
    }
  },

  startAnimation: function() {
    this.props.startAnimation(this.props.project);
  }

});
