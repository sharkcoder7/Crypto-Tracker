const path = require("path");
const router = require("express").Router();
const db = require("../models");
const axios = require("axios");
const cheerio = require("cheerio");
const api_key = "5ae60d2d5dcf4b75a51d27c9f94f5c35";

router.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

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

router.get("/api/news/:headline", function(req, res) {
  axios.get(`https://newsapi.org/v2/everything?q=${req.params.headline}&sortBy=publishedAt&apiKey=5ae60d2d5dcf4b75a51d27c9f94f5c35`).then(data => {
    res.json(data.data.articles)
  })
});

// retriveCoins();
function retriveCoins() {
    var coinsToBeCompared = [];
    var scrapedCoinInfo = [];
    var results = [];
    var names = [];
    var prices = [];
    var percentages = [];
    var rating = [];
    axios.get("https://coinmarketcap.com/").then(function (response) {

        var $ = cheerio.load(response.data);

        $("a.currency-name-container").each(function (i, element) {
            var name = $(element).text();

            names.push(name)
        });
        $("a.price").each(function (i, element) {
            var price = $(element).text();

            prices.push(price)
        });
        for (var i = 0; i < names.length; i++) {
            results.push({
                name: names[i],
                price: prices[i],
            })
        }
        db.User.find({})
            .then(function (allusers) {
                allusers.forEach(value => {
                    value.coins.forEach(coins => {
                        coinsToBeCompared.push({
                            firstName: value.firstname,
                            userEmail: value.email,
                            coinName: coins.coinName,
                            coinPrice: "$" + coins.coinPrice
                        })
                    })
                });
                coinsToBeCompared.forEach(userCoins => {
                    function find(coin) {
                        if (coin.name == userCoins.coinName && coin.price == userCoins.coinPrice) {
                            console.log("email to");
                            const msg = {
                                to: userCoins.userEmail,
                                from: 'CryptoAlert@donotreply.com',
                                subject: 'Your coin has reached the limit',
                                html: '<strong>Hello ' + userCoins.firstName + ", " + userCoins.coinName + " has reached " + userCoins.coinPrice + '!</strong>',
                            };
                            sgMail.send(msg);
                        }
                    }
                    // console.log(results);
                    results.find(find);
                })
            })
    })
}

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
    $("td.percent-change").each(function(i, element) {
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
