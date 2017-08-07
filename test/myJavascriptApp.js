let FChatLib = require('../dist/src/FChatLib');
var options = require(__dirname+'/config/config.js');
var myFchatBot = new FChatLib(options);
myFchatBot.connect();
console.log("ok");