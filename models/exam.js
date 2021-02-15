var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
	subject: String,
	class: String,
	section: String,
	author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
}); 
var Exam = mongoose.model("Exam",userSchema);
module.exports = Exam;