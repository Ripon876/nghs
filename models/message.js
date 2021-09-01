var mongoose = require("mongoose");

var answerSchema = new mongoose.Schema({
    from: {
        author: {
            name: String,
            id: String
        }
    },
    to: {
        user: {
            name: String,
            id: String,
            class: String,
            section: String,
            roll: String
        }
    },
    message: String
});
var Message = mongoose.model("Message", answerSchema);
module.exports = Message;