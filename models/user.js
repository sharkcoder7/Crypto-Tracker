const mongoose = require("mongoose");
const Schema = mongoose.Schema;



const userSchema = new Schema({
  coinName: { type: String, required: true },
  coinPrice: { type: Number, required: true }, 
  uid: {type: String, required: true}
});

const User = mongoose.model("User", userSchema);

module.exports = User;
