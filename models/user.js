var mongoose = require('mongoose')
var Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

var User = new Schema({
  email: String,
  name: String,
  avatar: String,
  _roomId: ObjectId
});

module.exports = User