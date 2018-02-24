import FChatLib from "./FChatLib";
import {CommandHandlerHelper} from "./CommandHandlerHelper";
import {IPlugin} from "./Interfaces/IPlugin";

export default class CommandHandler{

    channelName:string = "";
    fChatLibInstance:FChatLib;
    pluginsLoaded:Array<IPlugin>;
    commandHandlerHelper:CommandHandlerHelper;

    constructor(parent:FChatLib, channel:string) {

        this.channelName = channel;
        this.fChatLibInstance = parent;
        this.commandHandlerHelper = new CommandHandlerHelper(this);

        if(this.fChatLibInstance.channels.get(channel) != null && this.fChatLibInstance.channels.get(channel) != null){
            this.pluginsLoaded = this.fChatLibInstance.channels.get(channel);
            if(this.pluginsLoaded.length > 0){
                this.commandHandlerHelper.internalLoadPluginOnStart(this.pluginsLoaded);
            }
        }
    }

    processCommand(data){
        if (data && data.message && data.message.length > 2 && data.message[0] == '!') {

            let opts = {
                command: String(data.message.split(' ')[0]).replace('!', '').trim(),
                argument: data.message.substring(String(data.message.split(' ')[0]).length).trim()
            };

            if (opts.command != "processCommand") {

                let found = false;

                for(let plugin of this.pluginsLoaded){
                    for (let command of this.commandHandlerHelper.internalGetAllFuncs(plugin.instanciatedPlugin)) {
                        if(command === opts.command){
                            plugin.instanciatedPlugin[opts.command](opts.argument, data);
                            found = true;
                        }
                    }
                }

                if(!found && typeof this[opts.command] === "function"){
                    this[opts.command](opts.argument, data);
                }

            }
        }
    }



    help(args, data) {
        let commandsHelp = "";
        let cmdArrSorted = [];
        for(let method of this.commandHandlerHelper.internalGetAllFuncs(this)){
            if(method != "processCommand" && cmdArrSorted.indexOf(method) == -1){
                cmdArrSorted.push(method);
            }
        }
        for(let plugin of this.pluginsLoaded){
            for(let method of this.commandHandlerHelper.internalGetAllFuncs(plugin.instanciatedPlugin)){
                if(method != "processCommand" && cmdArrSorted.indexOf(method) == -1){
                    cmdArrSorted.push(method);
                }
            }
        }
        cmdArrSorted.sort();
        for(let i in cmdArrSorted){
            commandsHelp += ", !"+cmdArrSorted[i];
        }
        commandsHelp = commandsHelp.substr(1);
        this.fChatLibInstance.sendMessage('Here are the available commands:'+commandsHelp, data.channel);
    }

    flood(args, data) {
        if(this.fChatLibInstance.isUserChatOP(data.character, data.channel)){
            this.fChatLibInstance.sendMessage('Current flood limit set: '+this.fChatLibInstance.floodLimit, data.channel);
        }
        else{
            this.fChatLibInstance.sendMessage('You don\'t have sufficient rights.', data.channel);
        }
    }

    reloadplugins(args, data) {
        if(this.fChatLibInstance.isUserChatOP(data.character, data.channel)){
            this.fChatLibInstance.softRestart(data.channel);
            this.fChatLibInstance.sendMessage('All plugins have been reloaded!', data.channel);
        }
        else{
            this.fChatLibInstance.sendMessage('You don\'t have sufficient rights.', data.channel);
        }
    }

    greload(args, data) {
        if(data.character == this.fChatLibInstance.config.master){
            for(let i = 0; i < this.fChatLibInstance.channels.size; i++){
                this.fChatLibInstance.softRestart(this.fChatLibInstance.channels.keys()[i]);
            }
            this.fChatLibInstance.sendMessage('All plugins have been reloaded!', data.channel);
        }
        else{
            this.fChatLibInstance.sendMessage('You don\'t have sufficient rights.', data.channel);
        }
    }

    grestart(args, data) {
        if(data.character == this.fChatLibInstance.config.master){
            this.fChatLibInstance.restart();
        }
        else{
            this.fChatLibInstance.sendMessage('You don\'t have sufficient rights.', data.channel);
        }
    }

    gdisableinvites(args, data) {
        if(data.character == this.fChatLibInstance.config.master){
            this.fChatLibInstance.removeInviteListener(this.fChatLibInstance.joinChannelsWhereInvited);
        }
        else{
            this.fChatLibInstance.sendMessage('You don\'t have sufficient rights.', data.channel);
        }
    }

    genableinvites(args, data) {
        if(data.character == this.fChatLibInstance.config.master){
            this.fChatLibInstance.removeInviteListener(this.fChatLibInstance.joinChannelsWhereInvited);
            this.fChatLibInstance.addInviteListener(this.fChatLibInstance.joinChannelsWhereInvited);
        }
        else{
            this.fChatLibInstance.sendMessage('You don\'t have sufficient rights.', data.channel);
        }
    }

    gjoinchannel(args, data) {
        if(data.character == this.fChatLibInstance.config.master){
            this.fChatLibInstance.joinNewChannel(args);
        }
        else{
            this.fChatLibInstance.sendMessage('You don\'t have sufficient rights.', data.channel);
        }
    }

    gstatus(args, data) {
        if(data.character == this.fChatLibInstance.config.master){
            var splittedArgs = args.split(" ");
            this.fChatLibInstance.setStatus(splittedArgs.shift(), splittedArgs.join(" ")); //need validation
        }
        else{
            this.fChatLibInstance.sendMessage('You don\'t have sufficient rights.', data.channel);
        }
    }

    list(args, data) {
        var userList = this.fChatLibInstance.getUserList(data.channel);
        var str="";
        for(var i in userList){
            str += ", "+userList[i];
        }
        str = str.substr(1);
        this.fChatLibInstance.sendMessage('Here are the current characters in the room:'+str, data.channel);
    }

    listops(args, data) {
        let chatOPList = this.fChatLibInstance.getChatOPList(data.channel);
        let str="";
        for(let i in chatOPList){
            str += ", "+chatOPList[i];
        }
        str = str.substr(1);
        this.fChatLibInstance.sendMessage('Here are the current operators in the room:'+str, data.channel);
    }

    loadplugin(args, data) {
        if(data.character == this.fChatLibInstance.config.master){
            if(args == undefined || args == ""){
                this.fChatLibInstance.sendMessage("Wrong parameter. Example: !loadplugin pluginname", data.channel);
            }
            else{
                this.commandHandlerHelper.internalLoadPlugin(args, this);
            }
        }
        else{
            this.fChatLibInstance.sendMessage('You don\'t have sufficient rights.', data.channel);
        }
    }

    loadedplugins(args, data) {
        if(this.fChatLibInstance.isUserChatOP(data.character, data.channel)){
            this.fChatLibInstance.sendMessage('The following plugins are loaded: '+this.pluginsLoaded.map((x) => {return x.name;}).join(", "), data.channel);
        }
        else{
            this.fChatLibInstance.sendMessage('You don\'t have sufficient rights.', data.channel);
        }
    }

    unloadplugin(args, data) {
        if(data.character == this.fChatLibInstance.config.master){
            this.commandHandlerHelper.internalUnloadPlugin(args);
        }
        else{
            this.fChatLibInstance.sendMessage('You don\'t have sufficient rights.', data.channel);
        }
    }

    updateplugins(args, data) {
        if(this.fChatLibInstance.isUserChatOP(data.character, data.channel)){
            this.commandHandlerHelper.internalUpdatePlugins();
        }
        else{
            this.fChatLibInstance.sendMessage('You don\'t have sufficient rights.', data.channel);
        }
    }

    uptime(args, data) {
        this.fChatLibInstance.sendMessage("The bot has been running for "+this.commandHandlerHelper.internalGetUptime(), data.channel);
    }

    flushpluginslist(args, data) {
        if(this.fChatLibInstance.isUserChatOP(data.character, data.channel)){
            this.fChatLibInstance.channels.set(data.channel, []);
            this.fChatLibInstance.sendMessage("Removed all plugins, the bot will restart.", data.channel);
            this.fChatLibInstance.softRestart(data.channel);
        }
        else{
            this.fChatLibInstance.sendMessage('You don\'t have sufficient rights.', data.channel);
        }
    }

}