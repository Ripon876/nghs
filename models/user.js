var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
	name: String,
	class: String,
	section: String,
	roll: Number,
	username: String,
	password: String,
	googleId: Number,
	picture: String,
	isAdmin: { type: Boolean, default: false },
	isAuthor: { type: Boolean, default: false },
	isUser: { type: Boolean, default: true }
});
userSchema.plugin(passportLocalMongoose);
var User = mongoose.model("User",userSchema);

module.exports = User;