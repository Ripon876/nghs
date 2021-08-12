var mongoose = require("mongoose");

var answerSchema = new mongoose.Schema({
	user: {
        id: String,
        username: String,
        name: String
    }, 
    test_id: String,
    answer: String,
    marks: {type: Number, default: 0},
    passed: { type: Boolean, default: false }
}); 
var Answer = mongoose.model("Answer",answerSchema);
module.exports = Answer;