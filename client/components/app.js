import React, {Component} from 'react';
import TruckList from '../containers/TruckList';

export default class App extends Component {
  render() {
    return (
      <div className="container theme-light">
        <div className="jumbotron">
          <h1>Food Trucks Near You</h1>
          <p>...assuming you live in San Francisco </p>
        </div>
        <TruckList />
      </div>
    );
  }
};
