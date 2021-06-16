var mongoose = require("mongoose");

var testSchema = new mongoose.Schema({
	subject: String,
	class: String,
	section: String,
	author: {
        id: String,
        username: String
    },
    question_title: String,
    question_img_url: String,
    question_description: String
}); 
var Exam = mongoose.model("Exam",testSchema);
module.exports = Exam;