import axios from "axios";

export default {
  loadCryptos: function() {
    return axios.get("/api/coins");
  },
  saveCrypto: function (data) {
    return axios.post("/api/saveCoins/", data);
  },
  getWatched: function (uid){
    return axios.get("/api/saveCoins/" + uid);
  },
  deleteWatch: function (uid){
    return axios.delete("/api/saveCoins/delete/" + uid);
  },
  getNews: function() {
    return axios.get("/api/news");
  }
};
