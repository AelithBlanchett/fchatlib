var glob = require("glob");
var requireNew = require('require-new');
var jsonfile = require('jsonfile');
var fs = require('fs');
var path = require('path');
var firstStart = true;
var pluginsLoaded = [];
var commandHandler = {};
var fChatLibInstance = {};
var channelName = "";
var fileDir;
var fileName;
/*
 * Default commands
 * ---------------------------------------------------------------------------
 */
commandHandler.help = function (args, data) {
    var commandsHelp = "";
    var cmdArrSorted = [];
    for (var i in commandHandler) {
        if (typeof commandHandler[i] == "function") {
            //commandsHelp += ", !"+i;
            cmdArrSorted.push(i);
        }
    }
    cmdArrSorted.sort();
    for (var i in cmdArrSorted) {
        commandsHelp += ", !" + cmdArrSorted[i];
    }
    commandsHelp = commandsHelp.substr(1);
    fChatLibInstance.sendMessage('Here are the available commands:' + commandsHelp, data.channel);
};
commandHandler.flood = function (args, data) {
    if (fChatLibInstance.isUserChatOP(data.character, data.channel)) {
        fChatLibInstance.sendMessage('Current flood limit set: ' + fChatLibInstance.floodLimit, data.channel);
    }
    else {
        fChatLibInstance.sendMessage('You don\'t have sufficient rights.', data.channel);
    }
};
commandHandler.reloadplugins = function (args, data) {
    if (fChatLibInstance.isUserChatOP(data.character, data.channel)) {
        fChatLibInstance.softRestart(data.channel);
        fChatLibInstance.sendMessage('All plugins have been reloaded!', data.channel);
    }
    else {
        fChatLibInstance.sendMessage('You don\'t have sufficient rights.', data.channel);
    }
};
commandHandler.greload = function (args, data) {
    if (data.character == fChatLibInstance.config.master) {
        for (var i = 0; i < fChatLibInstance.channels.length; i++) {
            fChatLibInstance.softRestart(fChatLibInstance.channels[i]);
        }
        fChatLibInstance.sendMessage('All plugins have been reloaded!', data.channel);
    }
    else {
        fChatLibInstance.sendMessage('You don\'t have sufficient rights.', data.channel);
    }
};
commandHandler.grestart = function (args, data) {
    if (data.character == fChatLibInstance.config.master) {
        fChatLibInstance.restart();
    }
    else {
        fChatLibInstance.sendMessage('You don\'t have sufficient rights.', data.channel);
    }
};
commandHandler.gdisableinvites = function (args, data) {
    if (data.character == fChatLibInstance.config.master) {
        fChatLibInstance.removeInviteListener(fChatLibInstance.joinChannelsWhereInvited);
    }
    else {
        fChatLibInstance.sendMessage('You don\'t have sufficient rights.', data.channel);
    }
};
commandHandler.genableinvites = function (args, data) {
    if (data.character == fChatLibInstance.config.master) {
        fChatLibInstance.removeInviteListener(fChatLibInstance.joinChannelsWhereInvited);
        fChatLibInstance.addInviteListener(fChatLibInstance.joinChannelsWhereInvited);
    }
    else {
        fChatLibInstance.sendMessage('You don\'t have sufficient rights.', data.channel);
    }
};
commandHandler.gjoinchannel = function (args, data) {
    if (data.character == fChatLibInstance.config.master) {
        fChatLibInstance.joinNewChannel(args);
    }
    else {
        fChatLibInstance.sendMessage('You don\'t have sufficient rights.', data.channel);
    }
};
commandHandler.gstatus = function (args, data) {
    if (data.character == fChatLibInstance.config.master) {
        var splittedArgs = args.split(" ");
        fChatLibInstance.setStatus(splittedArgs[0], splittedArgs[1]); //need validation
    }
    else {
        fChatLibInstance.sendMessage('You don\'t have sufficient rights.', data.channel);
    }
};
commandHandler.list = function (args, data) {
    var userList = fChatLibInstance.getUserList(data.channel);
    var str = "";
    for (var i in userList) {
        str += ", " + userList[i];
    }
    str = str.substr(1);
    fChatLibInstance.sendMessage('Here are the current characters in the room:' + str, data.channel);
};
commandHandler.listops = function (args, data) {
    var chatOPList = fChatLibInstance.getChatOPList(data.channel);
    var str = "";
    for (var i in chatOPList) {
        str += ", " + chatOPList[i];
    }
    str = str.substr(1);
    fChatLibInstance.sendMessage('Here are the current operators in the room:' + str, data.channel);
};
commandHandler.loadplugin = function (args, data) {
    if (fChatLibInstance.isUserChatOP(data.character, data.channel)) {
        if (args == undefined || args == "") {
            fChatLibInstance.sendMessage("Wrong parameter. Example: !loadplugin pluginname", data.channel);
        }
        else {
            loadPlugin(args);
        }
    }
    else {
        fChatLibInstance.sendMessage('You don\'t have sufficient rights.', data.channel);
    }
};
commandHandler.loadedplugins = function (args, data) {
    if (fChatLibInstance.isUserChatOP(data.character, data.channel)) {
        fChatLibInstance.sendMessage('The following plugins are loaded: ' + pluginsLoaded.join(", "), data.channel);
    }
    else {
        fChatLibInstance.sendMessage('You don\'t have sufficient rights.', data.channel);
    }
};
commandHandler.unloadplugin = function (args, data) {
    if (fChatLibInstance.isUserChatOP(data.character, data.channel)) {
        unloadPlugin(args);
    }
    else {
        fChatLibInstance.sendMessage('You don\'t have sufficient rights.', data.channel);
    }
};
commandHandler.updateplugins = function (args, data) {
    if (fChatLibInstance.isUserChatOP(data.character, data.channel)) {
        updatePlugins();
    }
    else {
        fChatLibInstance.sendMessage('You don\'t have sufficient rights.', data.channel);
    }
};
commandHandler.uptime = function (args, data) {
    fChatLibInstance.sendMessage("The bot has been running for " + getUptime(), data.channel);
};
commandHandler.flushpluginslist = function (args, data) {
    if (fChatLibInstance.isUserChatOP(data.character, data.channel)) {
        fChatLibInstance.channels[data.channel].plugins = [];
        fChatLibInstance.sendMessage("Removed all plugins, the bot will restart.");
        fChatLibInstance.softRestart(data.channel);
    }
    else {
        fChatLibInstance.sendMessage('You don\'t have sufficient rights.', data.channel);
    }
};
/*
 * Load external plugins
 * ---------------------------------------------------------------------------
 */
function loadPlugin(pluginName) {
    try {
        var file = require(pluginName);
        var strAddedCommands = "";
        var newHandler = requireNew(file)(fChatLibInstance, channelName);
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
        if (ex && ex.code == "MODULE_NOT_FOUND") {
            fChatLibInstance.sendMessage("Plugin " + pluginName + " couldn't be found", channelName);
        }
        else {
            fChatLibInstance.throwError("!loadplugin", ex, channelName);
        }
    }
}
function updatePlugins() {
    var exec = require('child_process').exec;
    child = exec('npm update', function (error, stdout, stderr) {
        if (error !== null) {
            fChatLibInstance.throwError('Plugins update', error, channelName);
        }
        else {
            fChatLibInstance.sendMessage("Plugins updated.", channelName);
        }
    });
}
function unloadPlugin(pluginName) {
    if (pluginsLoaded.indexOf(pluginName) == -1) {
        pluginsLoaded.splice(pluginsLoaded.indexOf(pluginName), 1);
        updatePluginsFile();
    }
}
function updatePluginsFile() {
    fChatLibInstance.channels[channelName].plugins = pluginsLoaded;
    fChatLibInstance.updateRoomsConfig(fChatLibInstance.channels);
}
function loadPluginOnStart(pluginsArray) {
    var strAddedCommands = "";
    for (var i = 0; i < pluginsArray.length; i++) {
        try {
            var file = require(pluginsArray[i]);
            var newHandler = requireNew(file)(fChatLibInstance, channelName);
            var cmdList = Object.getPrototypeOf(newHandler);
            //lowercase alias
            for (var j = 0; j < Object.getOwnPropertyNames(cmdList).length; j++) {
                strAddedCommands += "!" + Object.getOwnPropertyNames(cmdList)[j].toLowerCase() + ", ";
                if (Object.getOwnPropertyNames(cmdList)[j].toLowerCase() != Object.getOwnPropertyNames(cmdList)[j]) {
                    cmdList[Object.getOwnPropertyNames(cmdList)[j].toLowerCase()] = cmdList[Object.getOwnPropertyNames(cmdList)[j]];
                }
            }
            newHandler = Object.assign(newHandler, cmdList);
            commandHandler = Object.assign(newHandler, commandHandler);
        }
        catch (ex) {
            if (ex && ex.code == "MODULE_NOT_FOUND") {
                fChatLibInstance.sendMessage("Plugin " + pluginsArray[i] + " couldn't be found", channelName);
            }
            else {
                fChatLibInstance.throwError("loadPluginOnStart", ex, channelName);
            }
        }
    }
}
function getUptime() {
    var sec_num = parseInt(process.uptime(), 10); // don't forget the second param
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);
    if (hours < 10) {
        hours = "0" + hours;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    return hours + ':' + minutes + ':' + seconds;
}
module.exports = function (parent, data, chanName) {
    channelName = chanName;
    fChatLibInstance = parent;
    if (firstStart) {
        firstStart = false;
        fileName = process.cwd() + "/config/config.rooms.js";
        jsonfile.readFile(fileName, function (err, rooms) {
            if (!err) {
                if (rooms[chanName] != undefined && rooms[chanName].plugins != undefined) {
                    pluginsLoaded = rooms[chanName].plugins;
                    if (pluginsLoaded.length > 0) {
                        loadPluginOnStart(pluginsLoaded);
                    }
                }
            }
        });
    }
    if (data && data.message && data.message.length > 2 && data.message[0] == '!') {
        var opts = {
            command: String(data.message.split(' ')[0]).replace('!', '').trim().toLowerCase(),
            argument: data.message.substring(String(data.message.split(' ')[0]).length).trim()
        };
        if (typeof commandHandler[opts.command] === 'function') {
            commandHandler[opts.command](opts.argument, data);
        }
    }
};
//# sourceMappingURL=commands.js.map