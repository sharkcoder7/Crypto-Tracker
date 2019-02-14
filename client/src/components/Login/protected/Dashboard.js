import React, { Component } from "react";
import API from "../../../utils/API";
import firebase from "../../config/constants";
import "./dashboard.css";

export default class Dashboard extends Component {
  state = {
    cName: "",
    cPrice: "",
    watched: [],
    market: "",
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
    API.saveCrypto({ coinName: name, coinPrice: price, uid }).then(() => {
      this.getWatched(this.state.uid);
    });
  };

  getWatched = uid => {
    console.log(uid);
    API.getWatched(uid)
      .then(res => this.setState({ cName: "", cPrice: "", watched: res.data }))
      .catch(err => console.log(err + "failed to get watched"));
  };

  deleteWatch = watchId => {
    API.deleteWatch(watchId).then(res => this.getWatched(this.state.uid));
  };

  getMarket = name => {
    console.log(name);
    this.setState({ market: name });
  };

  render() {
    return (
      <div>
        <div className="row">
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
            className="wave-effect wave-light btn black"
            onClick={() =>
              this.saveCrypto(
                this.state.cName,
                this.state.cPrice,
                this.state.uid
              )
            }
          >
            Submit
          </a>
        </div>
          <ul className="collection with-header">
            <h4 className="collection-header">Watches</h4>
                {this.state.watched.map(watched => (
                  <li key={watched._id} className="row">
                    <div className="watched__name col m4 center">
                      {watched.coinName}
                    </div>
                    <div className="watched__name col m4">
                      ${watched.coinPrice}
                    </div>
                    <div className="col m4">
                      <a
                        className="wave-effect wave-light btn right pink"
                        onClick={() => this.deleteWatch(watched._id)}
                      >
                        Delete
                      </a>
                    </div>
                   
                  </li>
                  
                ))}
              
            
          </ul>
        
      </div>
    );
  }
}
