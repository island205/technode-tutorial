var mongoose = require('mongoose')
var Schema = mongoose.Schema

var Room = new Schema({
  name: String,
  createAt:{type: Date, default: Date.now}
});

module.exports = Room