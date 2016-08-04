console.log("Starting...");
var fs = require("fs");
var cors = require("cors");
var express = require("express");
var app = express();
app.use(cors());
var gcm = require('node-gcm');
var message = new gcm.Message();


app.get("/", function (request, response) {
	response.send("Hello!");
});

app.get("/hello/:text", function (request, response) {
	response.send("Hello! " + request.params.text);
});

app.get("/gcm/new/:text", function (request, response) {
	var id = request.params.text;
	fs.appendFile("./userList.txt", id + "\n");
	response.send("OK, I got a new id: " + id);
});

app.get("/gcm/boardcast", function (request, response) {
	var fileContent = fs.readFileSync("./userList.txt");
	var userList = fileContent.toString().split("\n");

	// API Server Key
	var sender = new gcm.Sender('AIzaSyCudCIpeZDCZQ_qhC7Kjc_pJMsULs7rSw4');
	var registrationIds = [];
	// Value the payload data to send...
	message.addData('message',"\u270C Peace, Love \u2764 and PhoneGap \u2706!");
	message.addData('title','Push Notification Sample' );
	message.addData('msgcnt','3'); // Shows up in the notification in the status bar
	message.timeToLive = 3000;// Duration in seconds to hold in GCM and retry before timing out. Default 4 weeks (2,419,200 seconds) if not specified.

	for (var iLine = 0; iLine < userList.length; iLine++) {
		registrationIds.push(userList[iLine]);
	}

	sender.send(message, registrationIds, 4, function (result) {
		console.log("Messages sent.");
	});

	response.send("Messages sent.");
});

app.listen(process.env.PORT, process.env.IP);
