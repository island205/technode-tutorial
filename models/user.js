var Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

var User = new Schema({
  email: String
});

module.exports = User