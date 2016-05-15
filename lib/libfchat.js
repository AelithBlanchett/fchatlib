'use strict';
var WebSocket = require('ws');
var request = require("request");
const throttle = require('throttle-function');
var commandHandler = require('./commands.js');
var debug = true;
var parent;
var pingInterval;

class FChatLib {

    addConnectionListener(fn){
        parent.removeConnectionListener(fn);
        parent.connectionListeners.push(fn);
    }

    removeConnectionListener(fn){
        let id = parent.connectionListeners.indexOf(fn);
        if(id != 1){
            parent.connectionListeners.splice(id,1);
        }
    }

    addJoinListener(fn){
        parent.removeJoinListener(fn);
        parent.joinListeners.push(fn);
    }

    removeJoinListener(fn){
        let id = parent.joinListeners.indexOf(fn);
        if(id != 1){
            parent.joinListeners.splice(id,1);
        }
    }

    addLeaveListener(fn){
        parent.removeLeaveListener(fn);
        parent.leaveListeners.push(fn);
    }

    removeLeaveListener(fn){
        let id = parent.leaveListeners.indexOf(fn);
        if(id != 1){
            parent.leaveListeners.splice(id,1);
        }
    }

    addOnlineListener(fn){
        parent.removeOnlineListener(fn);
        parent.onlineListeners.push(fn);
    }

    removeOnlineListener(fn){
        let id = parent.onlineListeners.indexOf(fn);
        if(id != 1){
            parent.onlineListeners.splice(id,1);
        }
    }

    addOfflineListener(fn){
        parent.removeOfflineListener(fn);
        parent.offlineListeners.push(fn);
    }

    removeOfflineListener(fn){
        let id = parent.offlineListeners.indexOf(fn);
        if(id != 1){
            parent.offlineListeners.splice(id,1);
        }
    }

    addStatusListener(fn){
        parent.removeStatusListener(fn);
        parent.statusListeners.push(fn);
    }

    removeStatusListener(fn){
        let id = parent.statusListeners.indexOf(fn);
        if(id != 1){
            parent.statusListeners.splice(id,1);
        }
    }

    addChatOPListListener(fn){
        parent.removeChatOPListListener(fn);
        parent.chatOPListListeners.push(fn);
    }

    removeChatOPListListener(fn){
        let id = parent.chatOPListListeners.indexOf(fn);
        if(id != 1){
            parent.chatOPListListeners.splice(id,1);
        }
    }

    addChatOPAddedListener(fn){
        parent.removeChatOPAddedListener(fn);
        parent.chatOPAddedListeners.push(fn);
    }

    removeChatOPAddedListener(fn){
        let id = parent.chatOPAddedListeners.indexOf(fn);
        if(id != 1){
            parent.chatOPAddedListeners.splice(id,1);
        }
    }

    addChatOPRemovedListener(fn){
        parent.removeChatOPRemovedListener(fn);
        parent.chatOPRemovedListeners.push(fn);
    }

    removeChatOPRemovedListener(fn){
        let id = parent.chatOPRemovedListeners.indexOf(fn);
        if(id != 1){
            parent.chatOPRemovedListeners.splice(id,1);
        }
    }

    addInviteListener(fn){
        parent.removeInviteListener(fn);
        parent.inviteListeners.push(fn);
    }

    removeInviteListener(fn){
        let id = parent.inviteListeners.indexOf(fn);
        if(id != 1){
            parent.inviteListeners.splice(id,1);
        }
    }

    addKickListener(fn){
        parent.removeKickListener(fn);
        parent.kickListeners.push(fn);
    }

    removeKickListener(fn){
        let id = parent.kickListeners.indexOf(fn);
        if(id != 1){
            parent.kickListeners.splice(id,1);
        }
    }

    addBanListener(fn){
        parent.removeBanListener(fn);
        parent.banListeners.push(fn);
    }

    removeBanListener(fn){
        let id = parent.banListeners.indexOf(fn);
        if(id != 1){
            parent.banListeners.splice(id,1);
        }
    }

    addDescriptionChangeListener(fn){
        parent.removeDescriptionChangeListener(fn);
        parent.descriptionChangeListeners.push(fn);
    }

    removeDescriptionChangeListener(fn){
        let id = parent.descriptionChangeListeners.indexOf(fn);
        if(id != 1){
            parent.descriptionChangeListeners.splice(id,1);
        }
    }


    addPingListener(fn){
        parent.removePingListener(fn);
        parent.pingListeners.push(fn);
    }

    removePingListener(fn){
        let id = parent.pingListeners.indexOf(fn);
        if(id != 1){
            parent.pingListeners.splice(id,1);
        }
    }

    addInitialChannelDataListener(fn){
        parent.removeInitialChannelDataListener(fn);
        parent.initialChannelDataListeners.push(fn);
    }

    removeInitialChannelDataListener(fn){
        let id = parent.initialChannelDataListeners.indexOf(fn);
        if(id != 1){
            parent.initialChannelDataListeners.splice(id,1);
        }
    }

    addMessageListener(fn){
        parent.removeMessageListener(fn);
        parent.messageListeners.push(fn);
    }

    removeMessageListener(fn){
        let id = parent.messageListeners.indexOf(fn);
        if(id != 1){
            parent.messageListeners.splice(id,1);
        }
    }

    addPrivateMessageListener(fn){
        parent.removePrivateMessageListener(fn);
        parent.privateMessageListeners.push(fn);
    }

    removePrivateMessageListener(fn){
        let id = parent.privateMessageListeners.indexOf(fn);
        if(id != 1){
            parent.privateMessageListeners.splice(id,1);
        }
    }

    addRollListener(fn){
        parent.removeRollListener(fn);
        parent.rollListeners.push(fn);
    }

    removeRollListener(fn){
        let id = parent.rollListeners.indexOf(fn);
        if(id != 1){
            parent.rollListeners.splice(id,1);
        }
    }

    addVariableListener(fn){
        parent.removeVariableListener(fn);
        parent.variableListeners.push(fn);
    }

    removeVariableListener(fn){
        let id = parent.variableListeners.indexOf(fn);
        if(id != 1){
            parent.variableListeners.splice(id,1);
        }
    }

    constructor(configFile){
        this.config = require(configFile);

        this.banListeners = [];
        this.chatOPAddedListeners = [];
        this.chatOPListListeners = [];
        this.chatOPRemovedListeners = [];
        this.connectionListeners = [];
        this.descriptionChangeListeners = [];
        this.initialChannelDataListeners = [];
        this.inviteListeners = [];
        this.joinListeners = [];
        this.kickListeners = [];
        this.leaveListeners = [];
        this.messageListeners = [];
        this.offlineListeners = [];
        this.onlineListeners = [];
        this.pingListeners = [];
        this.privateMessageListeners = [];
        this.rollListeners = [];
        this.statusListeners = [];
        this.variableListeners = [];

        this.usersInChannel = [];
        this.chatOPsInChannel = [];

        this.ws = "";
        this.setFloodLimit(2);
        parent = this;

        this.addConnectionListener(this.joinChannelOnConnect);
        this.addMessageListener(commandHandler); //basic commands + plugins loader
        this.addVariableListener(this.variableChangeHandler);

        //user handling
        this.addInitialChannelDataListener(this.addUsersToList);
        this.addOfflineListener(this.removeUserFromChannels);
        this.addLeaveListener(this.removeUserFromList);
        this.addJoinListener(this.addUserToList);

        //permissions handling
        this.addChatOPListListener(this.addChatOPsToList);
        this.addChatOPAddedListener(this.addChatOPToList);
        this.addChatOPRemovedListener(this.removeChatOPFromList);
    }

    setFloodLimit(delay){
        this.floodLimit = delay;
        this.sendData = throttle(this.sendWS, {
            window: this.floodLimit,
            limit: 1
        });
    }

    connect() {
        parent.getTicket();
    }

    joinChannelOnConnect() {
        if (!!parent.config.debug && parent.config.debug == "true") {
            parent.sendWS('JCH', { channel: parent.config.debugroom });
        }
        else {
            parent.sendWS('JCH', { channel: parent.config.room });
        }
    }
    //user management
    addUsersToList(parent, args) {
        if(typeof parent.usersInChannel[args.channel] !== "object"){parent.usersInChannel[args.channel] = [];}
        for(var i in args.users){
            if(parent.usersInChannel[args.channel].indexOf(args.users[i].identity) == -1){
                parent.usersInChannel[args.channel].push(args.users[i].identity);
            }
        }
    }

    addUserToList(parent, args) {
        if(typeof parent.usersInChannel[args.channel] !== "object"){parent.usersInChannel[args.channel] = [];}
        if(parent.usersInChannel[args.channel].indexOf(args.character.identity) == -1){
            parent.usersInChannel[args.channel].push(args.character.identity);
        }
    }

    removeUserFromList(parent, args) {
        if(typeof parent.usersInChannel[args.channel] !== "object"){ return; }
        if(parent.usersInChannel[args.channel].indexOf(args.character) != -1){
            parent.usersInChannel[args.channel].splice(parent.usersInChannel[args.channel].indexOf(args.character),1);
        }
    }

    removeUserFromChannels(parent, args) { //remove if offline
        for(var i in parent.usersInChannel){
            if(typeof parent.usersInChannel[i] !== "object"){ continue; }
            if(parent.usersInChannel[i].indexOf(args.character) != -1){
                parent.usersInChannel[i].splice(parent.usersInChannel[i].indexOf(args.character),1);
            }
        }
    }

    //permissions
    addChatOPsToList(parent, args) {
        if(typeof parent.chatOPsInChannel[args.channel] !== "object"){parent.chatOPsInChannel[args.channel] = [];}
        for(var i in args.oplist){
            if(parent.chatOPsInChannel[args.channel].indexOf(args.oplist[i]) == -1){
                parent.chatOPsInChannel[args.channel].push(args.oplist[i]);
            }
        }
    }

    addChatOPToList(parent, args) {
        if(typeof parent.chatOPsInChannel[args.channel] !== "object"){parent.chatOPsInChannel[args.channel] = [];}
        if(parent.chatOPsInChannel[args.channel].indexOf(args.character) == -1){
            parent.chatOPsInChannel[args.channel].push(args.character);
        }
    }

    removeChatOPFromList(parent, args) {
        if(typeof parent.chatOPsInChannel[args.channel] !== "object"){ return; }
        if(parent.chatOPsInChannel[args.channel].indexOf(args.character) != -1){
            parent.chatOPsInChannel[args.channel].splice(parent.chatOPsInChannel[args.channel].indexOf(args.character),1);
        }
    }

    variableChangeHandler(parent, args) {
        switch(args.variable){
            case "msg_flood":
                //parent.floodLimit = args.value;
                //parent.sendData = throttle(parent.sendWS, {
                //    window: args.value,
                //    limit: 1
                //});
                break;
            default:
                break;
        }
    }

    getTicket(){
        request.post({ url: 'https://www.f-list.net/json/getApiTicket.php', form: { account: parent.config.user, password: parent.config.password } }, function (err, httpResponse, body) {
            parent.config.response = JSON.parse(body);
            parent.config.ticket = parent.config.response.ticket;
            var json = { "method": "ticket", "account": parent.config.user, "ticket": parent.config.ticket, "character": parent.config.character, "cname": parent.config.cname, "cversion": parent.config.cversion };
            parent.startWebsockets(json);
        });
    }

    sendWS(command, object) {
        if (parent.ws.readyState)
            parent.ws.send(command + ' ' + JSON.stringify(object));
    }

    sendMessage(message){
        let json = {};
        json.message = message;
        json.channel = this.roomName;
        parent.sendData('MSG', json);
    }

    sendPrivMessage(character, message){
        let json = {};
        json.message = message;
        json.recipient = character;
        parent.sendData('PRI', json);
    }

    get roomName(){
        if (!!this.config.debug && this.config.debug == "true") {
            return parent.config.debugroom;
        }
        else {
            return parent.config.room;
        }
    }

    get userList(){
        if(this.usersInChannel[this.roomName] == undefined){ return [];}
        return this.usersInChannel[this.roomName];
    }

    get allUsersList(){
        return this.usersInChannel;
    }

    get chatOPList(){
        if(typeof parent.chatOPsInChannel[parent.roomName] !== "object")
        {
            return [];
        }
        else{
            return parent.chatOPsInChannel[parent.roomName];
        }

    }

    get allChatOPsList(){
        return parent.chatOPList;
    }

    isUserChatOP(channel, username){
        if(parent.chatOPList.indexOf(username) != -1){
            return true;
        }
        return false;
    }

    disconnect(){
        this.ws.close();
    }

    restart(){
        parent.disconnect();
        setTimeout(parent.connect,2000);
    }

    roll(customDice){
        let json = {};
        let dice = customDice || "1d10";
        json.dice = dice;
        json.channel = this.roomName;
        parent.sendData("RLL", json);
    }


    startWebsockets(json) {
        if (!!this.config.debug && this.config.debug == "true") {
            this.ws = new WebSocket('ws://chat.f-list.net:8722');
        }
        else {
            this.ws = new WebSocket('ws://chat.f-list.net:9722');
        }

        this.ws.on('open', function(test) {
            console.log("Started WS");
            parent.sendWS('IDN', json);
            clearInterval(pingInterval);
            this.pingInterval = setInterval(function () { parent.ws.send('PIN'); }, 25000);
        });

        this.ws.on('close', function(test) {
            console.log("Closed WS");
            process.exit();
        });

        this.ws.on('error', function(test) {
            console.log("Disconnected WS");
            setTimeout(function () { parent.connect(); }, 4000);
        });

        this.ws.on('message', function (data, flags) {
            console.log(data);
            if (data != null) {
                this.command = this.argument = "";
                this.command = splitOnce(data, " ")[0].trim();
                try{
                    this.argument = JSON.parse(data.substring(this.command.length).trim());
                }
                catch (e) {
                }
                switch (this.command) {
                    case "CON"://CON { "count": int }
                        for (var i in parent.connectionListeners) {
                            parent.connectionListeners[i](parent, this.argument);
                        }
                        break;
                    case "COL": //COL {"oplist":["Newhalf Wrestling","Nastasya Bates","Rinko Saitou"],"channel":"ADH-d0bde7daca1dbe6c79ba"}
                        for (var i in parent.chatOPListListeners) {
                            parent.chatOPListListeners[i](parent, this.argument);
                        }
                        break;
                    case "COA": //COA { "channel": string, "character": string }
                        for (var i in parent.chatOPAddedListeners) {
                            parent.chatOPAddedListeners[i](parent, this.argument);
                        }
                        break;
                    case "COR": //COR { "channel": string, "character": string }
                        for (var i in parent.chatOPRemovedListeners) {
                            parent.chatOPRemovedListeners[i](parent, this.argument);
                        }
                        break;
                    case "FLN": //FLN {"character":"The Kid"}
                        for (var i in parent.offlineListeners) {
                            parent.offlineListeners[i](parent, this.argument);
                        }
                        break;
                    case "ICH": //ICH {"users": [{"identity": "Shadlor"}, {"identity": "Bunnie Patcher"}, {"identity": "DemonNeko"}, {"identity": "Desbreko"}, {"identity": "Robert Bell"}, {"identity": "Jayson"}, {"identity": "Valoriel Talonheart"}, {"identity": "Jordan Costa"}, {"identity": "Skip Weber"}, {"identity": "Niruka"}, {"identity": "Jake Brian Purplecat"}, {"identity": "Hexxy"}], "channel": "Frontpage", mode: "chat"}
                        for (var i in parent.initialChannelDataListeners) {
                            parent.initialChannelDataListeners[i](parent, this.argument);
                        }
                        break;
                    case "JCH": //JCH {"title":"Newhalf Sexual Federation of Wrestling","channel":"ADH-d0bde7daca1dbe6c79ba","character":{"identity":"Kirijou Mitsuru"}}
                        for (var i in parent.joinListeners) {
                            parent.joinListeners[i](parent, this.argument);
                        }
                        break;
                    case "LCH": //LCH {"character":"Darent","channel":"ADH-d0bde7daca1dbe6c79ba"}
                        for (var i in parent.leaveListeners) {
                            parent.leaveListeners[i](parent, this.argument);
                        }
                        break;
                    case "NLN": //FLN {"character":"The Kid"}
                        for (var i in parent.onlineListeners) {
                            parent.onlineListeners[i](parent, this.argument);
                        }
                        break;
                    case "PIN": //PIN
                        for (var i in parent.pingListeners) {
                            parent.pingListeners[i](parent, this.argument);
                        }
                        break;
                    case "RLL"://RLL {"channel": string, "results": [int], "type": enum, "message": string, "rolls": [string], "character": string, "endresult": int} OR RLL {"target":"string","channel":"string","message":"string","type":"bottle","character":"string"}
                        for (var i in parent.rollListeners) {
                            parent.rollListeners[i](parent, this.argument);
                        }
                        break;
                    case "STA": //STA { status: "status", character: "channel", statusmsg:"statusmsg" }
                        for (var i in parent.statusListeners) {
                            parent.statusListeners[i](parent, this.argument);
                        }
                        break;
                    case "CBU": //CBU {"operator":string,"channel":string,"character":string}
                        for (var i in parent.kickListeners) {
                            parent.kickListeners[i](parent, this.argument);
                        }
                        break;
                    case "CKU": //CKU {"operator":string,"channel":string,"character":string}
                        for (var i in parent.banListeners) {
                            parent.banListeners[i](parent, this.argument);
                        }
                        break;
                    case "CDS": //CDS { "channel": string, "description": string }
                        for (var i in parent.descriptionChangeListeners) {
                            parent.descriptionChangeListeners[i](parent, this.argument);
                        }
                        break;
                    case "CIU": //CIU { "sender":string,"title":string,"name":string }
                        for (var i in parent.inviteListeners) {
                            parent.inviteListeners[i](parent, this.argument);
                        }
                        break;
                    case "PRI": //PRI { "character": string, "message": string }
                        for (var i in parent.privateMessageListeners) {
                            parent.privateMessageListeners[i](parent, this.argument);
                        }
                        break;
                    case "MSG": //MSG { "character": string, "message": string, "channel": string }
                        for (var i in parent.messageListeners) {
                            parent.messageListeners[i](parent, this.argument);
                        }
                        break;
                    case "VAR": //VAR { "variable": string, "value": int/float }
                        for (var i in parent.variableListeners) {
                            parent.variableListeners[i](parent, this.argument);
                        }
                        break;
                }
            }
        });
    }






}

function splitOnce(str, delim) {
    var components = str.split(delim);
    var result = [components.shift()];
    if (components.length) {
        result.push(components.join(delim));
    }
    return result;
}

module.exports = FChatLib;