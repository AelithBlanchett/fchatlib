import FChatLib from "../src/FChatLib";
import Config from "./config/Config";

let options = require(__dirname+'/config/config.js');
let myFchatBot = new FChatLib(new Config());
myFchatBot.connect();
console.log("ok");