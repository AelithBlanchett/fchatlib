'use strict';
var WebSocket = require('ws');
var request = require("request");
var requireNew = require('require-new');
var jsonfile = require('jsonfile');
var fs = require('fs');
var throttle = require('throttle-function');
var parent;
var pingInterval;
var configDir = process.cwd() + "/config";
var fileRoomsJs = "/config.rooms.js";
var FChatLib = (function () {
    function FChatLib(options) {
        this.config = {};
        this.config.username = "";
        this.config.password = "";
        this.config.character = "";
        this.config.master = "";
        this.config.cname = "";
        this.config.cversion = "";
        if (typeof options !== 'object') {
            console.log('Wrong parameters passed. The username, password, character and master fields are required. Example: {username: "MyAcc", password: "secret", character: "MyNewBot", master: "MyCharacter"}');
            process.exit();
        }
        else {
            this.config = options;
            if (this.config.username == undefined || this.config.username == "" || this.config.password == undefined || this.config.password == "" || this.config.character == undefined || this.config.character == "" || this.config.master == undefined || this.config.master == "") {
                console.log('Wrong parameters passed. The username, password, character and master fields are required. Example: {username: "MyAcc", password: "secret", character: "MyNewBot", master: "MyCharacter"}');
                process.exit();
            }
        }
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
        this.commandHandlers = [];
        this.channels = {};
        try {
            if (fs.statSync(configDir + fileRoomsJs)) {
                this.channels = jsonfile.readFileSync(configDir + fileRoomsJs);
            }
        }
        catch (err) { }
        if (this.config.room !== undefined && Object.keys(this.channels).indexOf(this.config.room) == -1) {
            this.channels[this.config.room] = { plugins: [] };
            this.updateRoomsConfig(this.channels);
        }
        this.ws = "";
        this.setFloodLimit(2);
        parent = this;
        this.generateCommandHandlers();
        this.addMessageListener(this.commandListener); //basic commands + plugins loader, one instance for one bot
        this.addConnectionListener(this.joinChannelOnConnect);
        if (this.config.autoJoinOnInvite) {
            this.addInviteListener(this.joinChannelsWhereInvited);
        }
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
        this.connect();
    }
    FChatLib.prototype.addConnectionListener = function (fn) {
        parent.removeConnectionListener(fn);
        parent.connectionListeners.push(fn);
    };
    FChatLib.prototype.removeConnectionListener = function (fn) {
        var id = parent.connectionListeners.indexOf(fn);
        if (id != -1) {
            parent.connectionListeners.splice(id, 1);
        }
    };
    FChatLib.prototype.addJoinListener = function (fn) {
        parent.removeJoinListener(fn);
        parent.joinListeners.push(fn);
    };
    FChatLib.prototype.removeJoinListener = function (fn) {
        var id = parent.joinListeners.indexOf(fn);
        if (id != -1) {
            parent.joinListeners.splice(id, 1);
        }
    };
    FChatLib.prototype.addLeaveListener = function (fn) {
        parent.removeLeaveListener(fn);
        parent.leaveListeners.push(fn);
    };
    FChatLib.prototype.removeLeaveListener = function (fn) {
        var id = parent.leaveListeners.indexOf(fn);
        if (id != -1) {
            parent.leaveListeners.splice(id, 1);
        }
    };
    FChatLib.prototype.addOnlineListener = function (fn) {
        parent.removeOnlineListener(fn);
        parent.onlineListeners.push(fn);
    };
    FChatLib.prototype.removeOnlineListener = function (fn) {
        var id = parent.onlineListeners.indexOf(fn);
        if (id != -1) {
            parent.onlineListeners.splice(id, 1);
        }
    };
    FChatLib.prototype.addOfflineListener = function (fn) {
        parent.removeOfflineListener(fn);
        parent.offlineListeners.push(fn);
    };
    FChatLib.prototype.removeOfflineListener = function (fn) {
        var id = parent.offlineListeners.indexOf(fn);
        if (id != -1) {
            parent.offlineListeners.splice(id, 1);
        }
    };
    FChatLib.prototype.addStatusListener = function (fn) {
        parent.removeStatusListener(fn);
        parent.statusListeners.push(fn);
    };
    FChatLib.prototype.removeStatusListener = function (fn) {
        var id = parent.statusListeners.indexOf(fn);
        if (id != -1) {
            parent.statusListeners.splice(id, 1);
        }
    };
    FChatLib.prototype.addChatOPListListener = function (fn) {
        parent.removeChatOPListListener(fn);
        parent.chatOPListListeners.push(fn);
    };
    FChatLib.prototype.removeChatOPListListener = function (fn) {
        var id = parent.chatOPListListeners.indexOf(fn);
        if (id != -1) {
            parent.chatOPListListeners.splice(id, 1);
        }
    };
    FChatLib.prototype.addChatOPAddedListener = function (fn) {
        parent.removeChatOPAddedListener(fn);
        parent.chatOPAddedListeners.push(fn);
    };
    FChatLib.prototype.removeChatOPAddedListener = function (fn) {
        var id = parent.chatOPAddedListeners.indexOf(fn);
        if (id != -1) {
            parent.chatOPAddedListeners.splice(id, 1);
        }
    };
    FChatLib.prototype.addChatOPRemovedListener = function (fn) {
        parent.removeChatOPRemovedListener(fn);
        parent.chatOPRemovedListeners.push(fn);
    };
    FChatLib.prototype.removeChatOPRemovedListener = function (fn) {
        var id = parent.chatOPRemovedListeners.indexOf(fn);
        if (id != -1) {
            parent.chatOPRemovedListeners.splice(id, 1);
        }
    };
    FChatLib.prototype.addInviteListener = function (fn) {
        parent.removeInviteListener(fn);
        parent.inviteListeners.push(fn);
    };
    FChatLib.prototype.removeInviteListener = function (fn) {
        var id = parent.inviteListeners.indexOf(fn);
        if (id != -1) {
            parent.inviteListeners.splice(id, 1);
        }
    };
    FChatLib.prototype.addKickListener = function (fn) {
        parent.removeKickListener(fn);
        parent.kickListeners.push(fn);
    };
    FChatLib.prototype.removeKickListener = function (fn) {
        var id = parent.kickListeners.indexOf(fn);
        if (id != -1) {
            parent.kickListeners.splice(id, 1);
        }
    };
    FChatLib.prototype.addBanListener = function (fn) {
        parent.removeBanListener(fn);
        parent.banListeners.push(fn);
    };
    FChatLib.prototype.removeBanListener = function (fn) {
        var id = parent.banListeners.indexOf(fn);
        if (id != -1) {
            parent.banListeners.splice(id, 1);
        }
    };
    FChatLib.prototype.addDescriptionChangeListener = function (fn) {
        parent.removeDescriptionChangeListener(fn);
        parent.descriptionChangeListeners.push(fn);
    };
    FChatLib.prototype.removeDescriptionChangeListener = function (fn) {
        var id = parent.descriptionChangeListeners.indexOf(fn);
        if (id != -1) {
            parent.descriptionChangeListeners.splice(id, 1);
        }
    };
    FChatLib.prototype.addPingListener = function (fn) {
        parent.removePingListener(fn);
        parent.pingListeners.push(fn);
    };
    FChatLib.prototype.removePingListener = function (fn) {
        var id = parent.pingListeners.indexOf(fn);
        if (id != -1) {
            parent.pingListeners.splice(id, 1);
        }
    };
    FChatLib.prototype.addInitialChannelDataListener = function (fn) {
        parent.removeInitialChannelDataListener(fn);
        parent.initialChannelDataListeners.push(fn);
    };
    FChatLib.prototype.removeInitialChannelDataListener = function (fn) {
        var id = parent.initialChannelDataListeners.indexOf(fn);
        if (id != -1) {
            parent.initialChannelDataListeners.splice(id, 1);
        }
    };
    FChatLib.prototype.addMessageListener = function (fn) {
        parent.removeMessageListener(fn);
        parent.messageListeners.push(fn);
    };
    FChatLib.prototype.removeMessageListener = function (fn) {
        var id = parent.messageListeners.indexOf(fn);
        if (id != -1) {
            parent.messageListeners.splice(id, 1);
        }
    };
    FChatLib.prototype.addPrivateMessageListener = function (fn) {
        parent.removePrivateMessageListener(fn);
        parent.privateMessageListeners.push(fn);
    };
    FChatLib.prototype.removePrivateMessageListener = function (fn) {
        var id = parent.privateMessageListeners.indexOf(fn);
        if (id != -1) {
            parent.privateMessageListeners.splice(id, 1);
        }
    };
    FChatLib.prototype.addRollListener = function (fn) {
        parent.removeRollListener(fn);
        parent.rollListeners.push(fn);
    };
    FChatLib.prototype.removeRollListener = function (fn) {
        var id = parent.rollListeners.indexOf(fn);
        if (id != -1) {
            parent.rollListeners.splice(id, 1);
        }
    };
    FChatLib.prototype.addVariableListener = function (fn) {
        parent.removeVariableListener(fn);
        parent.variableListeners.push(fn);
    };
    FChatLib.prototype.removeVariableListener = function (fn) {
        var id = parent.variableListeners.indexOf(fn);
        if (id != -1) {
            parent.variableListeners.splice(id, 1);
        }
    };
    FChatLib.prototype.generateCommandHandlers = function () {
        //create one commandHandler per room
        Object.keys(parent.channels).forEach(function (room) {
            var commandHandler = requireNew('./commands.ts');
            commandHandler(parent, undefined, room);
            parent.commandHandlers[room] = commandHandler;
        });
    };
    FChatLib.prototype.setFloodLimit = function (delay) {
        this.floodLimit = delay;
        this.sendData = throttle(this.sendWS, {
            window: this.floodLimit,
            limit: 1
        });
    };
    FChatLib.prototype.connect = function () {
        parent.getTicket();
    };
    FChatLib.prototype.joinChannelsWhereInvited = function (parent, args) {
        parent.joinNewChannel(args.name);
    };
    FChatLib.prototype.joinChannelOnConnect = function () {
        Object.keys(parent.channels).forEach(function (room) {
            parent.sendWS('JCH', { channel: room });
        });
    };
    FChatLib.prototype.joinNewChannel = function (channel) {
        if (Object.keys(parent.channels).indexOf(channel) == -1) {
            parent.channels[channel] = { plugins: [] };
        }
        parent.sendWS('JCH', { channel: channel });
        var commandHandler = requireNew('./commands.ts');
        commandHandler(parent, undefined, channel);
        parent.commandHandlers[channel] = commandHandler;
        //save file for rooms
        parent.updateRoomsConfig(parent.channels);
    };
    FChatLib.prototype.commandListener = function (parent, args, chanName) {
        if (typeof parent.commandHandlers[args.channel] !== "undefined") {
            try {
                parent.commandHandlers[args.channel](parent, args, chanName);
            }
            catch (ex) {
                console.log(ex);
                parent.throwError(args, ex.toString());
            }
        }
    };
    FChatLib.prototype.throwError = function (args, error, chan) {
        console.log("Error: Please message " + parent.config.master + " with the following content:\n Error at " + new Date().toLocaleString() + " on command " + JSON.stringify(args) + " in channel " + args.channel + " with error: " + JSON.stringify(error));
        parent.sendMessage("Error: Please message " + parent.config.master + " with the following content:\n Error at " + new Date().toLocaleString() + " on command " + JSON.stringify(args) + " in channel " + chan + " with error: " + JSON.stringify(error), chan);
    };
    //user management
    FChatLib.prototype.addUsersToList = function (parent, args) {
        if (typeof parent.usersInChannel[args.channel] !== "object") {
            parent.usersInChannel[args.channel] = [];
        }
        for (var i in args.users) {
            if (parent.usersInChannel[args.channel].indexOf(args.users[i].identity) == -1) {
                parent.usersInChannel[args.channel].push(args.users[i].identity);
            }
        }
    };
    FChatLib.prototype.addUserToList = function (parent, args) {
        if (typeof parent.usersInChannel[args.channel] !== "object") {
            parent.usersInChannel[args.channel] = [];
        }
        if (parent.usersInChannel[args.channel].indexOf(args.character.identity) == -1) {
            parent.usersInChannel[args.channel].push(args.character.identity);
        }
    };
    FChatLib.prototype.removeUserFromList = function (parent, args) {
        if (typeof parent.usersInChannel[args.channel] !== "object") {
            return;
        }
        if (parent.usersInChannel[args.channel].indexOf(args.character) != -1) {
            parent.usersInChannel[args.channel].splice(parent.usersInChannel[args.channel].indexOf(args.character), 1);
        }
    };
    FChatLib.prototype.removeUserFromChannels = function (parent, args) {
        for (var i in parent.usersInChannel) {
            if (typeof parent.usersInChannel[i] !== "object") {
                continue;
            }
            if (parent.usersInChannel[i].indexOf(args.character) != -1) {
                parent.usersInChannel[i].splice(parent.usersInChannel[i].indexOf(args.character), 1);
            }
        }
    };
    //permissions
    FChatLib.prototype.addChatOPsToList = function (parent, args) {
        if (typeof parent.chatOPsInChannel[args.channel] !== "object") {
            parent.chatOPsInChannel[args.channel] = [];
        }
        for (var i in args.oplist) {
            if (parent.chatOPsInChannel[args.channel].indexOf(args.oplist[i]) == -1) {
                parent.chatOPsInChannel[args.channel].push(args.oplist[i]);
            }
        }
    };
    FChatLib.prototype.addChatOPToList = function (parent, args) {
        if (typeof parent.chatOPsInChannel[args.channel] !== "object") {
            parent.chatOPsInChannel[args.channel] = [];
        }
        if (parent.chatOPsInChannel[args.channel].indexOf(args.character) == -1) {
            parent.chatOPsInChannel[args.channel].push(args.character);
        }
    };
    FChatLib.prototype.removeChatOPFromList = function (parent, args) {
        if (typeof parent.chatOPsInChannel[args.channel] !== "object") {
            return;
        }
        if (parent.chatOPsInChannel[args.channel].indexOf(args.character) != -1) {
            parent.chatOPsInChannel[args.channel].splice(parent.chatOPsInChannel[args.channel].indexOf(args.character), 1);
        }
    };
    FChatLib.prototype.variableChangeHandler = function (parent, args) {
        switch (args.variable) {
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
    };
    FChatLib.prototype.getTicket = function () {
        request.post({ url: 'https://www.f-list.net/json/getApiTicket.php', form: { account: parent.config.username, password: parent.config.password } }, function (err, httpResponse, body) {
            var response = JSON.parse(body);
            var ticket = response.ticket;
            var json = { "method": "ticket", "account": parent.config.username, "ticket": ticket, "character": parent.config.character, "cname": parent.config.cname, "cversion": parent.config.cversion };
            parent.startWebsockets(json);
        });
    };
    FChatLib.prototype.sendWS = function (command, object) {
        if (parent.ws.readyState)
            parent.ws.send(command + ' ' + JSON.stringify(object));
    };
    FChatLib.prototype.sendMessage = function (message, channel) {
        var json = {};
        json.channel = channel;
        json.message = message;
        parent.sendData('MSG', json);
    };
    FChatLib.prototype.sendPrivMessage = function (character, message) {
        var json = {};
        json.message = message;
        json.recipient = character;
        parent.sendData('PRI', json);
    };
    FChatLib.prototype.getUserList = function (channel) {
        if (this.usersInChannel[channel] == undefined) {
            return [];
        }
        return this.usersInChannel[channel];
    };
    FChatLib.prototype.getAllUsersList = function () {
        return this.usersInChannel;
    };
    FChatLib.prototype.getChatOPList = function (channel) {
        if (typeof parent.chatOPsInChannel[channel] !== "object") {
            return [];
        }
        else {
            return parent.chatOPsInChannel[channel];
        }
    };
    FChatLib.prototype.isUserChatOP = function (username, channel) {
        return (parent.getChatOPList(channel).indexOf(username) != -1 || username == parent.config.master);
    };
    FChatLib.prototype.disconnect = function () {
        this.ws.close();
    };
    FChatLib.prototype.restart = function () {
        parent.disconnect();
        setTimeout(parent.connect, 2000);
    };
    FChatLib.prototype.softRestart = function (channel) {
        var commandHandler = requireNew('./commands.ts');
        commandHandler(parent, undefined, channel);
        parent.commandHandlers[channel] = commandHandler;
    };
    FChatLib.prototype.roll = function (customDice, channel) {
        var json = {};
        json.dice = customDice || "1d10";
        json.channel = channel;
        parent.sendData("RLL", json);
    };
    FChatLib.prototype.updateRoomsConfig = function (channels) {
        if (!fs.existsSync(configDir)) {
            fs.mkdirSync(configDir);
        }
        jsonfile.writeFile(configDir + fileRoomsJs, channels);
    };
    FChatLib.prototype.startWebsockets = function (json) {
        if (!!this.config.debug && this.config.debug == "true") {
            this.ws = new WebSocket('ws://chat.f-list.net:8722');
        }
        else {
            this.ws = new WebSocket('ws://chat.f-list.net:9722');
        }
        this.ws.on('open', function (test) {
            console.log("Started WS");
            parent.sendWS('IDN', json);
            clearInterval(pingInterval);
            this.pingInterval = setInterval(function () { parent.ws.send('PIN'); }, 25000);
        });
        this.ws.on('close', function (test) {
            console.log("Closed WS");
            process.exit();
        });
        this.ws.on('error', function (test) {
            console.log("Disconnected WS");
            setTimeout(function () { parent.connect(); }, 4000);
        });
        this.ws.on('message', function (data, flags) {
            //console.log(data);
            if (data != null) {
                this.command = this.argument = "";
                this.command = splitOnce(data, " ")[0].trim();
                try {
                    if(data.substring(this.command.length).trim() != ""){
                        this.argument = JSON.parse(data.substring(this.command.length).trim());
                    }
                }
                catch (e) {
                }
                switch (this.command) {
                    case "CON":
                        for (var i = 0; i < parent.connectionListeners.length; i++) {
                            parent.connectionListeners[i](parent, this.argument);
                        }
                        break;
                    case "COL":
                        for (var i = 0; i < parent.chatOPListListeners.length; i++) {
                            parent.chatOPListListeners[i](parent, this.argument);
                        }
                        break;
                    case "COA":
                        for (var i = 0; i < parent.chatOPAddedListeners.length; i++) {
                            parent.chatOPAddedListeners[i](parent, this.argument);
                        }
                        break;
                    case "COR":
                        for (var i = 0; i < parent.chatOPRemovedListeners.length; i++) {
                            parent.chatOPRemovedListeners[i](parent, this.argument);
                        }
                        break;
                    case "FLN":
                        for (var i = 0; i < parent.offlineListeners.length; i++) {
                            parent.offlineListeners[i](parent, this.argument);
                        }
                        break;
                    case "ICH":
                        for (var i = 0; i < parent.initialChannelDataListeners.length; i++) {
                            parent.initialChannelDataListeners[i](parent, this.argument);
                        }
                        break;
                    case "JCH":
                        for (var i = 0; i < parent.joinListeners.length; i++) {
                            parent.joinListeners[i](parent, this.argument);
                        }
                        break;
                    case "LCH":
                        for (var i = 0; i < parent.leaveListeners.length; i++) {
                            parent.leaveListeners[i](parent, this.argument);
                        }
                        break;
                    case "NLN":
                        for (var i = 0; i < parent.onlineListeners.length; i++) {
                            parent.onlineListeners[i](parent, this.argument);
                        }
                        break;
                    case "PIN":
                        for (var i = 0; i < parent.pingListeners.length; i++) {
                            parent.pingListeners[i](parent, this.argument);
                        }
                        break;
                    case "RLL":
                        for (var i = 0; i < parent.rollListeners.length; i++) {
                            parent.rollListeners[i](parent, this.argument);
                        }
                        break;
                    case "STA":
                        for (var i = 0; i < parent.statusListeners.length; i++) {
                            parent.statusListeners[i](parent, this.argument);
                        }
                        break;
                    case "CBU":
                        for (var i = 0; i < parent.kickListeners.length; i++) {
                            parent.kickListeners[i](parent, this.argument);
                        }
                        break;
                    case "CKU":
                        for (var i = 0; i < parent.banListeners.length; i++) {
                            parent.banListeners[i](parent, this.argument);
                        }
                        break;
                    case "CDS":
                        for (var i = 0; i < parent.descriptionChangeListeners.length; i++) {
                            parent.descriptionChangeListeners[i](parent, this.argument);
                        }
                        break;
                    case "CIU":
                        for (var i = 0; i < parent.inviteListeners.length; i++) {
                            parent.inviteListeners[i](parent, this.argument);
                        }
                        break;
                    case "PRI":
                        for (var i = 0; i < parent.privateMessageListeners.length; i++) {
                            parent.privateMessageListeners[i](parent, this.argument);
                        }
                        break;
                    case "MSG":
                        for (var i = 0; i < parent.messageListeners.length; i++) {
                            parent.messageListeners[i](parent, this.argument, this.argument.channel);
                        }
                        break;
                    case "VAR":
                        for (var i = 0; i < parent.variableListeners.length; i++) {
                            parent.variableListeners[i](parent, this.argument);
                        }
                        break;
                }
            }
        });
    };
    return FChatLib;
})();
function splitOnce(str, delim) {
    var components = str.split(delim);
    var result = [components.shift()];
    if (components.length) {
        result.push(components.join(delim));
    }
    return result;
}
module.exports = FChatLib;
