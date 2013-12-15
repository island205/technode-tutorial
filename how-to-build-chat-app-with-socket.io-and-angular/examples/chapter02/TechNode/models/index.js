var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/technodechapter02')
exports.User = mongoose.model('User', require('./user'))