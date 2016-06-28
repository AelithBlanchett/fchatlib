var glob = require("glob");
var requireNew = require('require-new');
var jsonfile = require('jsonfile');
var fs = require('fs');
var firstStart = true;
var pluginsLoaded = [];
var commandHandler = {};
var fChatLibInstance = {};
var globalAdmin = "Lustful Aelith"; //yeah. deal with it.
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
    for(var i in commandHandler){
        if(typeof commandHandler[i] == "function"){
            //commandsHelp += ", !"+i;
            cmdArrSorted.push(i);
        }
    }
    cmdArrSorted.sort();
    for(var i in cmdArrSorted){
        commandsHelp += ", !"+cmdArrSorted[i];
    }
    commandsHelp = commandsHelp.substr(1);
    fChatLibInstance.sendMessage('Here are the available commands:'+commandsHelp, data.channel);
};

commandHandler.flood = function (args, data) {
    if(fChatLibInstance.isUserChatOP(data.character, data.channel)){
        fChatLibInstance.sendMessage('Current flood limit set: '+fChatLibInstance.floodLimit, data.channel);
    }
    else{
        fChatLibInstance.sendMessage('You don\'t have sufficient rights.', data.channel);
    }
};

commandHandler.reloadplugins = function (args, data) {
    if(fChatLibInstance.isUserChatOP(data.character, data.channel)){
        fChatLibInstance.softRestart(data.channel);
        fChatLibInstance.sendMessage('All plugins have been reloaded!', data.channel);
    }
    else{
        fChatLibInstance.sendMessage('You don\'t have sufficient rights.', data.channel);
    }
};

commandHandler.globalreload = function (args, data) {
    if(data.character == globalAdmin){
        for(var i = 0; i < fChatLibInstance.channels.length; i++){
            fChatLibInstance.softRestart(fChatLibInstance.channels[i]);
        }
        fChatLibInstance.sendMessage('All plugins have been reloaded!', data.channel);
    }
    else{
        fChatLibInstance.sendMessage('You don\'t have sufficient rights.', data.channel);
    }
};

commandHandler.globalrestart = function (args, data) {
    if(data.character == globalAdmin){
        fChatLibInstance.restart();
    }
    else{
        fChatLibInstance.sendMessage('You don\'t have sufficient rights.', data.channel);
    }
};

commandHandler.joinchannel = function (args, data) {
    if(data.character == globalAdmin){
        fChatLibInstance.joinNewChannel(args);
    }
    else{
        fChatLibInstance.sendMessage('You don\'t have sufficient rights.', data.channel);
    }
};

commandHandler.list = function (args, data) {
    var userList = fChatLibInstance.getUserList(data.channel);
    var str="";
    for(var i in userList){
        str += ", "+userList[i];
    }
    str = str.substr(1);
    fChatLibInstance.sendMessage('Here are the current characters in the room:'+str, data.channel);
};

commandHandler.listops = function (args, data) {
    var chatOPList = fChatLibInstance.getChatOPList(data.channel);
    var str="";
    for(var i in chatOPList){
        str += ", "+chatOPList[i];
    }
    str = str.substr(1);
    fChatLibInstance.sendMessage('Here are the current operators in the room:'+str, data.channel);
};

commandHandler.loadplugin = function (args, data) {
    if(fChatLibInstance.isUserChatOP(data.character, data.channel)){
        loadPlugin(args);
    }
    else{
        fChatLibInstance.sendMessage('You don\'t have sufficient rights.', data.channel);
    }
};

commandHandler.flushpluginslist = function (args, data) {
    if(fChatLibInstance.isUserChatOP(data.character, data.channel)){
        fs.unlink(fileName, (err) => {
            if (err) throw err;
            console.log('successfully deleted '+fileName);
            fChatLibInstance.softRestart(data.channel);
        });
    }
    else{
        fChatLibInstance.sendMessage('You don\'t have sufficient rights.', data.channel);
    }
};


/*
 * Load external plugins
 * ---------------------------------------------------------------------------
 */
function loadPlugin(pluginName){
    var files =  glob.sync(process.cwd()+"/plugins/"+pluginName+".js");
    var strAddedCommands = "";

    for (var i = 0; i < files.length; i++) {

        var newHandler = requireNew(files[i])(fChatLibInstance, channelName);

        //lowercase alias
        for(var j = 0; j < Object.keys(newHandler).length; j++){
            strAddedCommands += "!"+Object.keys(newHandler)[j].toLowerCase() + ", ";
            if(Object.keys(newHandler)[j].toLowerCase() != Object.keys(newHandler)[j]){
                newHandler[Object.keys(newHandler)[j].toLowerCase()] = newHandler[Object.keys(newHandler)[j]];
            }
        }
        commandHandler = Object.assign(commandHandler,newHandler);

    };

    strAddedCommands = strAddedCommands.substr(0, strAddedCommands.length - 2);
    if(strAddedCommands == ""){
        fChatLibInstance.sendMessage("There weren't any loaded commands for this plugin. Are you sure it exists?", channelName);
    }
    else{
        fChatLibInstance.sendMessage("The following commands were loaded: "+strAddedCommands, channelName);
        if(pluginsLoaded.indexOf(pluginName) == -1){
            pluginsLoaded.push(pluginName);

            if (!fs.existsSync(fileDir)){
                fs.mkdirSync(fileDir);
            }
            jsonfile.writeFile(fileName, pluginsLoaded);
        }
    }
}

function loadPluginOnStart(pluginsPathArray) {
    var strAddedCommands = "";

    for (var i = 0; i < pluginsPathArray.length; i++) {

        var newHandler = requireNew(pluginsPathArray[i])(fChatLibInstance, channelName);

        //lowercase alias
        for(var j = 0; j < Object.keys(newHandler).length; j++){
            strAddedCommands += "!"+Object.keys(newHandler)[j].toLowerCase() + ", ";
            if(Object.keys(newHandler)[j].toLowerCase() != Object.keys(newHandler)[j]){
                newHandler[Object.keys(newHandler)[j].toLowerCase()] = newHandler[Object.keys(newHandler)[j]];
            }
        }
        commandHandler = Object.assign(commandHandler,newHandler);

    };
}



module.exports = function (parent, data, chanName) {

    channelName = chanName;

    fChatLibInstance = parent;

    if(firstStart){
        firstStart = false;
        fileDir = process.cwd()+"/config/rooms/";
        fileName = process.cwd()+"/config/rooms/"+channelName+".json";
        jsonfile.readFile(fileName, function(err, obj){
            if(!err){
                pluginsLoaded = obj;
                if(pluginsLoaded.length > 0){
                    var pluginsPaths = [];
                    for(var i = 0; i < pluginsLoaded.length; i++){
                        pluginsPaths.push(process.cwd()+"/plugins/"+pluginsLoaded[i]+".js");
                    }
                    loadPluginOnStart(pluginsPaths);
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
        } else {
            //not found
        }
    }
};