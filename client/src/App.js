import React, { Component } from "react";
import { Route, BrowserRouter, Link, Redirect, Switch } from "react-router-dom";
import { RingLoader } from 'react-spinners';
import Login from "../src/components/Login/Login";
import Register from "../src/components/Login/Register";
import Dashboard from "../src/components/Login/protected/Dashboard";
import { logout } from "../src/components/helpers/auth";
import { firebaseAuth } from "../src/components/config/constants";
import "../src/components/Login/Login.css";
import API from "./utils/API";
import "./style.css";
function PrivateRoute({ component: Component, authed, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        authed === true ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: "/login", state: { from: props.location } }}
          />
        )
      }
    />
  );
}
function PublicRoute({ component: Component, authed, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        authed === false ? (
          <Component {...props} />
        ) : (
          <Redirect to="/dashboard" />
        )
      }
    />
  );
}
export default class App extends Component {
  state = {
    authed: false,
    loading: true,
    loadCryptos: [],
    news: [],
    headline: ""
  };

  componentDidMount() {
    this.removeListener = firebaseAuth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          authed: true,
          loading: false
        });
      } else {
        this.setState({
          authed: false,
          loading: false
        });
      }
    });
    API.loadCryptos().then(res => this.setState({ loadCryptos: res.data }));
    API.getNews("Cryptocurrencies").then(res =>
      this.setState({ news: res.data })
    );
  }
  componentWillUnmount() {
    this.removeListener();
    if (this.state.authed) {
      window.location.href = "/dashboard";
    }
  }

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  callChart = (coinName, market) => {
    console.log("coinName");
    new window.TradingView.widget({
      width: 980,
      height: 610,
      symbol: market + ":" + coinName + "usd",
      interval: "D",
      timezone: "Etc/UTC",
      theme: "Light",
      style: "1",
      locale: "en",
      toolbar_bg: "#f1f3f6",
      enable_publishing: false,
      allow_symbol_change: true,
      hideideas: true
    });
    var a = document.createElement("a");
    var linkText = document.createTextNode("Dashboard");
    a.appendChild(linkText);
    a.title = "Go Back";
    a.href = "/dashboard";
    document.body.appendChild(a);
  };

  callNews = () => {
    API.getNews(this.state.headline).then(res =>
      this.setState({ news: res.data })
    );
  };

  render() {
    return this.state.loading === true ? (
      <div className='sweet-loading'>
      <RingLoader
        color={'#123abc'} 
        loading={this.state.loading} 
      />
    </div>
    ) : (
      <BrowserRouter>
        <div>
          <nav>
            <div className="nav-wrapper black col s12">
              <a href="" className="brand-logo">
                CryptoTracker
              </a>
              <ul id="nav-mobile" className="right">
                <li>
                  {this.state.authed ? (
                    <a
                      style={{ border: "none", background: "transparent" }}
                      onClick={() => {
                        logout();
                      }}
                      className="wave-effect wave-light btn grey"
                    >
                      Logout
                    </a>
                  ) : (
                    <ul className="nav navbar-nav">
                      <li>
                        <Link to="/login" className="wave-effect wave-light btn grey">
                          {" "}
                          Login
                        </Link>
                      </li>
                      <li>
                        <Link to="/register" className="wave-effect wave-light btn grey">
                          {" "}
                          Register
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>
              </ul>
            </div>
          </nav>
          <div className="row">
            <div className="container-fluid col m8">
              <table className="striped">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Change (24h)</th>
                    <th>Choose market to view chart</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.loadCryptos.map(coin => (
                    <tr>
                      <td onClick={() => this.callChart(coin.abv)}>
                        {coin.name}
                      </td>
                      <td>{coin.price}</td>
                      <td>{coin.percent}</td>
                      <td>
                        <div className="market chip">
                          <a
                            className="market"
                            onClick={() => this.callChart(coin.abv, "Bitstamp")}
                          >
                            Bitstamp
                          </a>
                        </div>
                        <div className="chip">
                          <a
                            className="market"
                            onClick={() => this.callChart(coin.abv, "Binance")}
                          >
                            Binance
                          </a>
                        </div>
                        <div className="chip">
                          <a
                            className="market"
                            onClick={() => this.callChart(coin.abv, "Bittrex")}
                          >
                            Bittrex
                          </a>
                        </div>
                        <div className="chip">
                          <a
                            className="market"
                            onClick={() => this.callChart(coin.abv, "Bitfinex")}
                          >
                            Bitfinex
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="container-fluid col m4">
              <Switch>
                <PublicRoute
                  authed={this.state.authed}
                  path="/login"
                  component={Login}
                />
                <PublicRoute
                  authed={this.state.authed}
                  path="/register"
                  component={Register}
                />
                <PrivateRoute
                  authed={this.state.authed}
                  path="/dashboard"
                  component={Dashboard}
                />
              </Switch>
              <div>
                <ul className="collection with-header">
                  <div className="collection-header">
                    <div className="row">
                      <div className="col m12">
                        <h4>News</h4>
                      </div>
                      <div className="row">
                      <div className="col m8">
                        <input
                          value={this.state.headline}
                          onChange={this.handleInputChange}
                          name="headline"
                        />
                      </div>
                      <div className="col m4">
                        <a
                          onClick={() => this.callNews()}
                          className="wave-effect wave-light btn black"
                        >
                          search
                        </a>
                      </div>
                      </div>
                    </div>
                  </div>
                  {this.state.news.map(article => (
                    <li key={article.url} className="row">
                      <h6 className="col m12 center">
                        <a href={article.url} target="blank">
                          {article.title}
                        </a>
                      </h6>
                      <div className="row">
                        {article.urlToImage ? (
                          <div>
                            <img
                              className="col m6"
                              src={article.urlToImage}
                              width={150}
                              height={150}
                              mode="fit"
                            />
                            <p className="col m6">{article.description}</p>
                          </div>
                        ) : (
                          <div>
                            <p className="col m1" />
                            <p className="col m10 center">
                              {article.description}
                            </p>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <footer className="page-footer black">
            <div className="container">
              <div className="row">
                <div className="col l6 s12">
                  <h5 className="white-text">CryptoTracker</h5>
                  <p className="grey-text text-lighten-4">
                    Rutgers Coding Bootcamp
                  </p>
                </div>
                <div className="col l4 offset-l2 s12">
                  <h5 className="white-text">Team</h5>
                  <ul>
                    <li>
                      <a className="grey-text text-lighten-3" href="#!">
                        Adam Kojak
                      </a>
                    </li>
                    <li>
                      <a className="grey-text text-lighten-3" href="#!">
                        Mohammed Wardeh
                      </a>
                    </li>
                    <li>
                      <a className="grey-text text-lighten-3" href="#!">
                        Raymundo Little Bitch
                      </a>
                    </li>
                    <li>
                      <a className="grey-text text-lighten-3" href="#!">
                        Scot Renz
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="footer-copyright">
              <div className="container center">
                © 2018 Copyright CryptoTracker
              </div>
            </div>
          </footer>
        </div>
      </BrowserRouter>
    );
  }
}
