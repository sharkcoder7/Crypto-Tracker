import React from "react";
import API from "../../utils/API";

class Home extends React.Component {
  state = {
    loadCryptos: []
  };

  componentDidMount () {
    API.loadCryptos().then(res => this.setState({ loadCryptos: res.data }));      
  }
  render() {
    return (
      <div>
        <div className="container-fluid">
          <table className="striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Change (24h)</th>
              </tr>
            </thead>
            <tbody>
              {this.state.loadCryptos.map(coin => (
                // <div className="row" key={coin.name}>
                <tr>
                  <td onClick={() => this.callChart(coin.abv)}>{coin.name}</td>
                  <td>{coin.price}</td>
                  <td>{coin.percent}</td>
                </tr>
                // </div>
              ))}
            </tbody>
          </table>
        </div>
        <footer className="page-footer teal">
          <div className="container">
            <div className="row">
              <div className="col l6 s12">
                <h5 className="white-text">CryptoTracker</h5>
                <p className="grey-text text-lighten-4">
                  Rutgers Coding Bootcamp
                </p>
              </div>
              <div className="col l4 offset-l2 s12">
                <h5 className="white-text">Our App</h5>
                <ul>
                  <li>
                    <a className="grey-text text-lighten-3" href="#!">
                      About Us
                    </a>
                  </li>
                  <li>
                    <a className="grey-text text-lighten-3" href="#!">
                      Privacy policy
                    </a>
                  </li>
                  <li>
                    <a className="grey-text text-lighten-3" href="#!">
                      Terms Conditions
                    </a>
                  </li>
                  <li>
                    <a className="grey-text text-lighten-3" href="#!">
                      Website disclaimer
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="footer-copyright">
            <div className="container">
              © 2018 Copyright CryptoTracker
              <a className="grey-text text-lighten-4 right" href="#!">
                More Links
              </a>
            </div>
          </div>
        </footer>
      </div>
    );
  }
}

export default Home;