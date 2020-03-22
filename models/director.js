const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const director = new Schema({
  name: String,
  age: Number
});

module.exports = mongoose.model("Director", director);