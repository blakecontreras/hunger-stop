import React, { Component } from 'react';
import { connect } from 'react-redux';
import { GoogleMapLoader, GoogleMap, Marker } from 'react-google-maps';
import { PassCurrTruck } from '../actions/PassCurrTruck';
import { bindActionCreators } from 'redux';
import GeolocationMarker from 'geolocation-marker';

var userLat;
var userLng;
let center = {lat: 37.7678011, lng: -122.4443519};  // default
let zoom = 12;  // default
let icon;

// Marker position needs to be broken up to the individual lat, lng props
// use new Date.now().getDay() for day of week index
class Map extends Component {

  componentWillMount(){
    this.renderUserLocation();
  };

  handleClick(truck){
    if(truck._id==="user"){
      console.log("That ain't no truck.  That's YOU breh...");
    } else {
      console.log("you've selected ", truck.name);
      this.props.PassCurrTruck(truck);
    }
  };

  renderUserLocation(){

    return new Promise((resolve, reject) => {
      var options = {
        enableHighAccuracy: true,
        // timeout: 5000,
        maximumAge: 0
      };

      function success(pos) {
        var crd = pos.coords;
        userLat = crd.latitude;
        userLng = crd.longitude;
        resolve(pos);
      };

      function error(err) {
        console.warn('ERROR(' + err.code + '): ' + err.message);
        reject(err);
      };

      navigator.geolocation.getCurrentPosition(success, error, options);
    })
    .then( (userPosition) => {
      if (userPosition) {
        let user = {};
        user._id = 'user';
        user.timeStamp = JSON.stringify(new Date);
        user.location = {lat: userPosition.coords.latitude, lng: userPosition.coords.longitude};
        this.props.trucks.push(user);
        this.setState({userLocationFound: true, userLocation: user.location});
      };
    })
    .catch( err => {
      console.log("GoogleMap renderUserLocation error", err);
    })
  };

  renderMarkers(truck) {
    // this.renderUserLocation(); 
    // GRAB CURRENT DAY OF WEEK
    const date = new Date;
    let index = date.getDay();
    const dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const tweetDay = truck.timeStamp.slice(0, 3);

    // GRAB DAY OF TWEET TIMESTAMP FROM DB
    let tweetIndex = dayOfWeek.indexOf(tweetDay);
    icon = 'http://maps.google.com/mapfiles/ms/micons/red-dot.png';

    if(truck._id==="user"){
      tweetIndex = 1;
      index = 1;
      icon = 'http://www.google.com/mapfiles/arrow.png';
    }

    // IF TWEET IS FROM TODAY, USE LOCATION OBJECT PULLED FROM TWEET,
    // OTHERWISE USE SCHEDULE FOUND IN DATABASE FOR LOCATION,
    // UNLESS THE TRUCK IS CLOSED TODAY. THEN PASS NULL TO MARKER SO IT DOESN'T RENDER
    const position = tweetIndex === index ? truck.location : truck.schedule[index].closed ? {lat: null, lng: null} : truck.schedule[index];
    if (position.lat) {
      return (
        <Marker
          key={ truck._id } position={{ lat: position.lat, lng: position.lng }} 
          onClick={ this.handleClick.bind(this, truck) }
          icon= { icon }
        />
      );
    };
  };
    renderEventMarkers(event) {
      //we need the current weekday in order to iterate over the schedules array and determine if the event is open today
      const today = new Date;
      // idx is the index of the array, in which 0 corresponds to Sunday, and so on
      const idx = today.getDay();

      //TODO: when we render the trucks list for the event, we need to make sure idx is the same as the date of the last tweet's timestamp

      // if the event is open today, we render it to the map
      // if it's closed, it's lat and lng are set to null so that the marker does not render
      const position = (event.schedule[idx].closed ? { lat: null, lng: null } : event.location);

    if (position.lat !== null) {
      return <Marker
        key={ event._id } position={ position }
        icon= 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
      />
    };
  };

  render() {
    console.log("GoogleMap rendered this.state", this.state);
    if(this.state){
      zoom = 15;
      center = { lat: this.state.userLocation.lat, lng: this.state.userLocation.lng };
    }
    return (
      <GoogleMapLoader
        containerElement={ <div style={{height: '100%', width: '100%'}} /> }
        googleMapElement={
          <GoogleMap zoom={ zoom } center={{ lat: center.lat, lng: center.lng }}>
            { this.props.events.map(event => this.renderEventMarkers(event)) }
            { this.props.trucks.map(truck => this.renderMarkers(truck)) }
          </GoogleMap>
        }
      />
    );
  }
};

function mapStateToProps(state) {
  return {
    trucks: state.trucks,
    events: state.events,
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ PassCurrTruck }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Map);
