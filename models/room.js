var mongoose = require('mongoose')
var Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

var Room = new Schema({
  name: String
});

module.exports = Room