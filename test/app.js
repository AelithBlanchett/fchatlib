//var FChatLib = require('../lib/libfchat');
//var options = require(__dirname+'/config/config.js');
//var myFchatBot = new FChatLib(options);
//console.log("ok");
fChatLibInstance = {};
channelName = "";

var pluginName = "./plugins/pick_two.js";
try {
    console.log(__dirname);
    console.log(__dirname+pluginName)
    var file = require(pluginName);
    var strAddedCommands = "";
    var newHandler = new file(fChatLibInstance, channelName);
    var cmdList = Object.getPrototypeOf(newHandler);
    //lowercase alias
    for (var j = 0; j < Object.getOwnPropertyNames(cmdList).length; j++) {
        if (Object.getOwnPropertyNames(cmdList)[j].toLowerCase() == "constructor") {
            cmdList.constructor = null;
        }
        else {
            strAddedCommands += "!" + Object.getOwnPropertyNames(cmdList)[j].toLowerCase() + ", ";
            if (Object.getOwnPropertyNames(cmdList)[j].toLowerCase() != Object.getOwnPropertyNames(cmdList)[j]) {
                cmdList[Object.getOwnPropertyNames(cmdList)[j].toLowerCase()] = cmdList[Object.getOwnPropertyNames(cmdList)[j]];
            }
        }
    }
    newHandler = Object.assign(newHandler, cmdList);
    commandHandler = Object.assign(newHandler, commandHandler);
    strAddedCommands = strAddedCommands.substr(0, strAddedCommands.length - 2);
    if (strAddedCommands == "") {
        fChatLibInstance.sendMessage("There weren't any loaded commands for this plugin. Are you sure it exists?", channelName);
    }
    else {
        fChatLibInstance.sendMessage("The following commands were loaded: " + strAddedCommands, channelName);
        if (pluginsLoaded.indexOf(pluginName) == -1) {
            pluginsLoaded.push(pluginName);
            updatePluginsFile();
        }
    }
}
catch (ex) {
    console.log("NOT from TS");
    if (ex && ex.code == "MODULE_NOT_FOUND") {
        console.log(__dirname);
        console.log(__dirname+pluginName)
        fChatLibInstance.sendMessage("Plugin " + pluginName + " couldn't be found", channelName);
    }
    else {
        console.log(ex);
        fChatLibInstance.throwError("!loadplugin", ex, channelName);
    }
}