var mongoose = require('mongoose')
var Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId

var Message = new Schema({
  content: String,
  creator: {
    _id: ObjectId,
    email: String,
    name: String,
    avatarUrl: String
  },
  createAt:{type: Date, default: Date.now}
})

module.exports = Message
