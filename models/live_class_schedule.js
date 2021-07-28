var mongoose = require("mongoose");

var live_class_Schema = new mongoose.Schema({
class_date: String,
class_time: String,
class: String,
section: String,
subject: String
}); 
var Live_Class = mongoose.model("Live_Class",live_class_Schema);
module.exports = Live_Class;