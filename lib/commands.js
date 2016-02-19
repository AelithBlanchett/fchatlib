var glob = require("glob");
var pluginsLoaded = false;
var commandHandler = {};
var fChatLibInstance = {};

/*
 * Default commands
 * ---------------------------------------------------------------------------
 */

commandHandler.help = function () {
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
    fChatLibInstance.sendMessage('Here are the available commands:'+commandsHelp);
};

commandHandler.flood = function (args, data) {
    if(fChatLibInstance.isUserChatOP(data.channel, data.character)){
        fChatLibInstance.sendMessage('Current flood limit set: '+fChatLibInstance.floodLimit);
    }
    else{
        fChatLibInstance.sendMessage('You don\'t have sufficient rights.');
    }
};

commandHandler.reloadplugins = function (args, data) {
    if(fChatLibInstance.isUserChatOP(data.channel, data.character)){
        loadPlugins();
        fChatLibInstance.sendMessage('All plugins have been reloaded!');
    }
    else{
        fChatLibInstance.sendMessage('You don\'t have sufficient rights.');
    }
};

//commandHandler.kill = function (args, data) {
//    if(fChatLibInstance.isUserChatOP(data.channel, data.character)){
//        fChatLibInstance.disconnect();
//    }
//};

commandHandler.restart = function () {
    if(fChatLibInstance.isUserChatOP(data.channel, data.character)){
        fChatLibInstance.restart();
    }
    else{
        fChatLibInstance.sendMessage('You don\'t have sufficient rights.');
    }
};

commandHandler.list = function () {
    var userList = fChatLibInstance.userList;
    var str="";
    for(var i in userList){
        str += ", "+userList[i];
    }
    str = str.substr(1);
    fChatLibInstance.sendMessage('Here are the current characters in the room:'+str);
};

commandHandler.listops = function () {
    var chatOPList = fChatLibInstance.chatOPList;
    var str="";
    for(var i in chatOPList){
        str += ", "+chatOPList[i];
    }
    str = str.substr(1);
    fChatLibInstance.sendMessage('Here are the current operators in the room:'+str);
};


/*
 * Load external plugins
 * ---------------------------------------------------------------------------
 */
function loadPlugins(pluginsDir){
    var files =  glob.sync(process.cwd()+pluginsDir+"/*.js");
    for (var i = 0; i < files.length; i++) {
        var newHandler = require(files[i])(fChatLibInstance);
        commandHandler = Object.assign(commandHandler,newHandler);
    };
}



module.exports = function (parent, data) {

    var opts = {
        command: String(data.message.split(' ')[0]).replace('!', '').trim(),
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