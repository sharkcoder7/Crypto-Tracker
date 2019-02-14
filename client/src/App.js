import React, { Component } from "react";
import { Route, BrowserRouter, Link, Redirect, Switch } from "react-router-dom";
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
    location: window.location.href
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
    API.getNews("Cryptocurrencies").then(res => this.setState({ news: res.data }));
  }
  componentWillUnmount() {
    this.removeListener();
  }
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
    a.href = "/";
    document.body.appendChild(a);
  };

  render() {
    return this.state.loading === true ? (
      <h1>Loading</h1>
    ) : (
      <BrowserRouter>
        <div>
          <nav>
            <div className="nav-wrapper teal">
              <a href="" className="brand-logo">
                CryptoTracker
              </a>
              <ul id="nav-mobile" className="right hide-on-med-and-down">
                <li
                  className={window.location.pathname === "/" ? "active" : ""}
                >
                  {/* {this.state.authed ? (
                    <span>
                      <Link to="/" className="nav-link">
                        Home
                      </Link>
                    </span>
                  ) : (
                    <span />
                  )} */}
                </li>
                <li
                  className={
                    window.location.pathname === "/dashboard" ? "active" : ""
                  }
                >
                  {this.state.authed ? (
                    <span>
                      <Link to="/dashboard" className="nav-link">
                        Dashboard
                      </Link>
                    </span>
                  ) : (
                    <span />
                  )}
                </li>
                <li>
                  {this.state.authed ? (
                    <button
                      style={{ border: "none", background: "transparent" }}
                      onClick={() => {
                        logout();
                      }}
                      className="nav-link glyphicon glyphicon-log-out"
                    >
                      Logout
                    </button>
                  ) : (
                    <ul className="nav navbar-nav">
                      <li>
                        <Link to="/login" className="nav-link">
                          {" "}
                          Login
                        </Link>
                      </li>
                      <li>
                        <Link to="/register" className="nav-link">
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
                          <a className="market"
                            onClick={() => this.callChart(coin.abv, "Bitstamp")}
                          >
                            Bitstamp
                          </a>
                        </div>
                        <div className="chip">
                          <a className="market"
                            onClick={() => this.callChart(coin.abv, "Binance")}
                          >
                            Binance
                          </a>
                        </div>
                        <div className="chip">
                          <a  className="market"
                            onClick={() => this.callChart(coin.abv, "Bittrex")}
                          >
                            Bittrex
                          </a>
                        </div>
                        <div className="chip">
                          <a  className="market"
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
                <h4 className="collection-header">News</h4>
                  {this.state.news.map(article => (
                    <li key={article.url} className="row">
                      <h6 className="col m12 center">
                        <a href={article.url} target="blank">
                          {article.title}
                        </a>
                      </h6>
                      <div className="row">
                      {article.urlToImage
                      ?<div><img
                      className="col m6"
                      src={article.urlToImage}
                      width={150}
                      height={150}
                      mode="fit"
                    />
                    <p className="col m6">{article.description}</p></div>
                    :<div><p className="col m1"></p><p className="col m10 center">{article.description}</p></div>
                    }

                      
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
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
      </BrowserRouter>
    );
  }
}
