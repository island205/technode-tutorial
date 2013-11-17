var mongoose = require('mongoose')
var Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

var User = new Schema({
  email: String,
  name: String,
  avatar: String,
  _roomId: ObjectId,
	online: Boolean
});

module.exports = User