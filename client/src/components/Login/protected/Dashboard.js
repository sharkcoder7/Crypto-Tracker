import React, { Component } from "react";
import API from "../../../utils/API";
import firebase from "../../config/constants";

export default class Dashboard extends Component {
  state = {
    cName: "",
    cPrice: "",
    watched: [],
    uid: firebase.auth().currentUser.uid
  };

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  componentDidMount() {
    this.getWatched(this.state.uid);
  }

  saveCrypto = (name, price, uid) => {
    API.saveCrypto({ coinName: name, coinPrice: price, uid })
    .then(res => {
       this.getWatched(this.state.uid)
       
      })
      // () => this.getWatched(this.state.uid)));
  };

  getWatched = uid => {
    console.log(uid);
    API.getWatched(uid)
      .then(res => this.setState({cName:"", cPrice:"", watched: res.data }))
      .catch(err => console.log(err + "failed to get watched"));
  };

  deleteWatch = watchId => {
    API.deleteWatch(watchId).then(res => this.getWatched(this.state.uid));
  };

  render() {
    const uid = firebase.auth().currentUser.uid;

    return (
      <div className="col m3">
        <label>Crypto Name</label>
        <input
          value={this.state.cName}
          onChange={this.handleInputChange}
          name="cName"
        />
        <label>Crypto Price</label>
        <input
          value={this.state.cPrice}
          onChange={this.handleInputChange}
          name="cPrice"
        />
        <a
          className="wave-effect wave-light btn"
          onClick={() =>
            this.saveCrypto(this.state.cName, this.state.cPrice, uid)
          }
        >
          Submit
        </a>
        <div className="watched">
          {this.state.watched.map(watched => (
            <div key = {watched._id} className="container">
            <div className="row">
              <div className="watched__name">{watched.coinName} <span>${watched.coinPrice}</span><a className="wave-effect wave-light btn" onClick={() => this.deleteWatch(watched._id)}>Delete</a></div>
            </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
