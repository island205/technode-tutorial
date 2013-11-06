var mongoose = require('mongoose')
var Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId

var Message = new Schema({
  content: String,
  creator: {
    email: String,
    name: String,
    avatar: String
  },
  create_at:{type: Date, default: Date.now},
  roomId: ObjectId
})

module.exports = Message