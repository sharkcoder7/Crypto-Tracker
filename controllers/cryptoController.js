const path = require("path");
const router = require("express").Router();
const db = require("../models");
const axios = require("axios");
const cheerio = require("cheerio");

router.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

// router.post("/api/saveCoins", function(req, res) {
//   User.update(
//     { _id: req.session.user._id },
//     {
//       $push: {
//         coins: { coinName: req.body.coinName, coinPrice: req.body.coinPrice }
//       }
//     }
//   );
// });

const cryptoFunctions = {
  delete: function(req, res) {
    db.User.findById({ _id: req.params.uid })
      .then(dbModel => dbModel.remove())
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  }
};

router.post("/api/saveCoins/", function(req, res) {
  db.User.create(req.body)
    .then(dbModel => res.json(dbModel))
    .catch(err => res.json(err));
});

router.get("/api/saveCoins/:uid", function(req, res) {
  db.User.find({ uid: req.params.uid })
    .sort({ saveNow: -1 })
    .then(dbModel => res.json(dbModel))
    .catch(err => res.status(422).json(err));
});

router.delete("/api/saveCoins/delete/:uid", cryptoFunctions.delete);

router.get("/api/coins", function(req, res) {
  var results = [];
  var names = [];
  var abv = [];
  var prices = [];
  var percentages = [];
  var rating = [];
  axios.get("https://coinmarketcap.com/").then(function(response) {
    var $ = cheerio.load(response.data);

    $("a.currency-name-container").each(function(i, element) {
      var name = $(element).text();

      names.push(name);
    });
    $("a.price").each(function(i, element) {
      var price = $(element).text();

      prices.push(price);
    });
    $("span.hidden-xs").each(function(i, element) {
      var abvName = $(element).text();

      abv.push(abvName);
    });
    $("td.percent-24h").each(function(i, element) {
      var percent = $(element).text();

      percentages.push(percent);
    });
    for (var i = 0; i < names.length; i++) {
      results.push({
        abv: abv[i],
        name: names[i],
        price: prices[i],
        percent: percentages[i]
      });
    }
    res.json(results);
  });
});

module.exports = router;
