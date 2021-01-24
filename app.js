var express = require("express");
var app = express();
var port = process.env.PORT || 8080;
app.get("/",function(req,res){
	res.send("this is the home route");
});

app.listen(port,function(){
	console.log("Server started at port " + port);
});
