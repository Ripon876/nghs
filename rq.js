var request = require("request");
var crypto = require("crypto");
const cron = require('node-cron');
var fs = require('fs');
var id = crypto.randomBytes(1).toString('hex');
var idd = crypto.randomBytes(1).toString('hex');
console.log(id)

console.log("started")

	 var num = 0;
	 var num_img = 1;

 

// fs.unlink('./file.xls', function (err) {
  
//   if (err) throw err;
//   console.log('File deleted!');
// }); 

// var writeStream = fs.createWriteStream("file.xls");

// var header= "Sl No"+"\t"+"Image Url"+"\n";
// writeStream.write(header);
// var arr = [];

//  var timerId =   setInterval(function(){

// (async function(){
	
// if (num_img <= 12) {
// var re = await request("https://reqres.in/api/users/" + num_img,function(err,res,body){
// 	if (err) {console.log(err)}


// var k = JSON.parse(body);
// var row = num +"\t"+ k.data.avatar +"\n";
// console.log(row)
// writeStream.write(row);
// row = ''; 
// console.log(row)


// num++;
// num_img++;


// // console.log(xDid)
// // writeStream.write(global[id]);

// // writeStream.close();
// })

// }else {
// 	writeStream.close();
// 	console.log("done");
// 	clearInterval(timerId);
// }


// }()) 

// },1000);




(async function(){
 var a = await request("https://www.fiverr.com/imranali786/",function(err,res,body){
 	if (!err) {
 		// console.log(body)
fs.appendFile('message.html', body, function (err) {
  if (err) throw err;
  console.log('Saved!');
});

 	}
 })
}())