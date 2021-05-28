var mongoose  = require("mongoose");

var noticeSchema = new mongoose.Schema({
	notice: String,
	user: {
		id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
       name: String
	}
});

var Notice = mongoose.model("Notice",noticeSchema);

module.exports = Notice;



