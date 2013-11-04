var Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

var Message = new Schema({
  content: String,
  _creatorId: ObjectId,
  _roomId: ObjectId
});

module.exports = Message