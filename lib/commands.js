var glob = require("glob");
var pluginsLoaded = false;
var commandHandler = {};
var fChatLibInstance = {};
var globalAdmin = "Lustful Aelith"; //yeah. deal with it.

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
    if(data.character == globalAdmin){
        loadPlugins();
        fChatLibInstance.sendMessage('All plugins have been reloaded!', data.channel);
    }
    else{
        fChatLibInstance.sendMessage('You don\'t have sufficient rights.', data.channel);
    }
};

//commandHandler.kill = function (args, data) {
//    if(fChatLibInstance.isUserChatOP(data.channel, data.character)){
//        fChatLibInstance.disconnect();
//    }
//};

commandHandler.restart = function (args, data) {
    if(data.character == globalAdmin){
        fChatLibInstance.restart();
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


/*
 * Load external plugins
 * ---------------------------------------------------------------------------
 */
function loadPlugins(pluginsDir){
    var files =  glob.sync(process.cwd()+pluginsDir+"/*.js");
    for (var i = 0; i < files.length; i++) {
        var newHandler = require(files[i])(fChatLibInstance);
        for(var i = 0; i < Object.keys(newHandler).length; i++){
            if(Object.keys(newHandler)[i].toLowerCase() != Object.keys(newHandler)[i]){
                newHandler[Object.keys(newHandler)[i].toLowerCase()] = newHandler[Object.keys(newHandler)[i]];
            }
        }
        commandHandler = Object.assign(commandHandler,newHandler);
    };
}



module.exports = function (parent, data) {

    var opts = {
        command: String(data.message.split(' ')[0]).replace('!', '').trim().toLowerCase(),
        argument: data.message.substring(String(data.message.split(' ')[0]).length).trim()
    }

    fChatLibInstance = parent;

    if(!pluginsLoaded){
        pluginsLoaded = true;
        loadPlugins(fChatLibInstance.config.pluginsDir);
    }

    if (data && data.message && data.message.length > 2 && data.message[0] == '!') {
        if (typeof commandHandler[opts.command] === 'function') {
            commandHandler[opts.command](opts.argument, data);
        } else {
            //not found
        }
    }
};