import {CommandHandler} from "./example_plugin";

module.exports = function (parent, channel) {
    let cmdHandler:CommandHandler = new CommandHandler(parent, channel);
    return cmdHandler;
};