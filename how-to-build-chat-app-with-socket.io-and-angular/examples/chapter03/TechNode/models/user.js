var mongoose = require('mongoose')
var Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId

var User = new Schema({
  email: String,
  name: String,
  avatarUrl: String,
  _roomId: ObjectId,
  online: Boolean
});

module.exports = User