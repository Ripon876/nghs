var mongoose = require("mongoose");

var answerSchema = new mongoose.Schema({
	user: {
        id: String,
        username: String
    },
    test_id: String,
    answer: String,
    marks: Number,
    passed: { type: Boolean, default: false }
}); 
var Answer = mongoose.model("Answer",answerSchema);
module.exports = Answer;