const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const expressValidator = require("express-validator");
const cryptoController = require("./controllers/cryptoController");
const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(expressValidator());
app.use(cookieParser());
app.use(session({ secret: "d3b29dbu93hdu2hdesid", resave: false, saveUninitialized: true }))
app.use(express.static("client/build"));
app.use(cryptoController);

mongoose.Promise = global.Promise;

mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost/CryptoTracker",
  {
    useMongoClient: true
  }
);

app.listen(PORT, function() {
  console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});
