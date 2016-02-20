var FChatLib = require('../lib/libfchat');
var myFchatBot = new FChatLib(__dirname+'/config/config.example.js');
myFchatBot.connect();
console.log("ok");