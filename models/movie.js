const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const movie = new Schema({
  name: String,
  genre: String,
  directorId: String
});

module.exports = mongoose.model("Movie", movie);