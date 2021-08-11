var mongoose  = require("mongoose");

var noticeSchema = new mongoose.Schema({
	notice: String,
	user: {
		id: String,
       name: String
	},
	notice_type: String,
	class: String,
	section: String
});

var Notice = mongoose.model("Notice",noticeSchema);

module.exports = Notice;



