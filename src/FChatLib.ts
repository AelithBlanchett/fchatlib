'use strict';
import CommandHandler from "./CommandHandler";
import {IPlugin} from "./Interfaces/IPlugin";
import {IFChatLib} from "./Interfaces/IFChatLib";
import {IConfig} from "./Interfaces/IConfig";
import {IMsgEvent} from "./Interfaces/IMsgEvent";
let WebSocketClient = require('ws');
let request = require("request");
let jsonfile = require('jsonfile');
let fs = require('fs');
const throttle = require('throttle-function');
let pingInterval;
let configDir = process.cwd()+"/config";
let fileRoomsJs = "/config.rooms.js";


export default class FChatLib implements IFChatLib{

    addConnectionListener(fn:Function):void{
        this.removeConnectionListener(fn);
        this.connectionListeners.push(fn);
    }

    removeConnectionListener(fn):void{
        let id = this.connectionListeners.indexOf(fn);
        if(id != -1){
            this.connectionListeners.splice(id,1);
        }
    }

    addJoinListener(fn):void{
        this.removeJoinListener(fn);
        this.joinListeners.push(fn);
    }

    removeJoinListener(fn):void{
        let id = this.joinListeners.indexOf(fn);
        if(id != -1){
            this.joinListeners.splice(id,1);
        }
    }

    addLeaveListener(fn):void{
        this.removeLeaveListener(fn);
        this.leaveListeners.push(fn);
    }

    removeLeaveListener(fn):void{
        let id = this.leaveListeners.indexOf(fn);
        if(id != -1){
            this.leaveListeners.splice(id,1);
        }
    }

    addOnlineListener(fn):void{
        this.removeOnlineListener(fn);
        this.onlineListeners.push(fn);
    }

    removeOnlineListener(fn):void{
        let id = this.onlineListeners.indexOf(fn);
        if(id != -1){
            this.onlineListeners.splice(id,1);
        }
    }

    addOfflineListener(fn):void{
        this.removeOfflineListener(fn);
        this.offlineListeners.push(fn);
    }

    removeOfflineListener(fn):void{
        let id = this.offlineListeners.indexOf(fn);
        if(id != -1){
            this.offlineListeners.splice(id,1);
        }
    }

    addStatusListener(fn):void{
        this.removeStatusListener(fn);
        this.statusListeners.push(fn);
    }

    removeStatusListener(fn):void{
        let id = this.statusListeners.indexOf(fn);
        if(id != -1){
            this.statusListeners.splice(id,1);
        }
    }

    addChatOPListListener(fn):void{
        this.removeChatOPListListener(fn);
        this.chatOPListListeners.push(fn);
    }

    removeChatOPListListener(fn):void{
        let id = this.chatOPListListeners.indexOf(fn);
        if(id != -1){
            this.chatOPListListeners.splice(id,1);
        }
    }

    addChatOPAddedListener(fn):void{
        this.removeChatOPAddedListener(fn);
        this.chatOPAddedListeners.push(fn);
    }

    removeChatOPAddedListener(fn):void{
        let id = this.chatOPAddedListeners.indexOf(fn);
        if(id != -1){
            this.chatOPAddedListeners.splice(id,1);
        }
    }

    addChatOPRemovedListener(fn):void{
        this.removeChatOPRemovedListener(fn);
        this.chatOPRemovedListeners.push(fn);
    }

    removeChatOPRemovedListener(fn):void{
        let id = this.chatOPRemovedListeners.indexOf(fn);
        if(id != -1){
            this.chatOPRemovedListeners.splice(id,1);
        }
    }

    addInviteListener(fn):void{
        this.removeInviteListener(fn);
        this.inviteListeners.push(fn);
    }

    removeInviteListener(fn):void{
        let id = this.inviteListeners.indexOf(fn);
        if(id != -1){
            this.inviteListeners.splice(id,1);
        }
    }

    addKickListener(fn):void{
        this.removeKickListener(fn);
        this.kickListeners.push(fn);
    }

    removeKickListener(fn):void{
        let id = this.kickListeners.indexOf(fn);
        if(id != -1){
            this.kickListeners.splice(id,1);
        }
    }

    addBanListener(fn):void{
        this.removeBanListener(fn);
        this.banListeners.push(fn);
    }

    removeBanListener(fn):void{
        let id = this.banListeners.indexOf(fn);
        if(id != -1){
            this.banListeners.splice(id,1);
        }
    }

    addDescriptionChangeListener(fn):void{
        this.removeDescriptionChangeListener(fn);
        this.descriptionChangeListeners.push(fn);
    }

    removeDescriptionChangeListener(fn):void{
        let id = this.descriptionChangeListeners.indexOf(fn);
        if(id != -1){
            this.descriptionChangeListeners.splice(id,1);
        }
    }

    addPingListener(fn):void{
        this.removePingListener(fn);
        this.pingListeners.push(fn);
    }

    removePingListener(fn):void{
        let id = this.pingListeners.indexOf(fn);
        if(id != -1){
            this.pingListeners.splice(id,1);
        }
    }

    addInitialChannelDataListener(fn):void{
        this.removeInitialChannelDataListener(fn);
        this.initialChannelDataListeners.push(fn);
    }

    removeInitialChannelDataListener(fn):void{
        let id = this.initialChannelDataListeners.indexOf(fn);
        if(id != -1){
            this.initialChannelDataListeners.splice(id,1);
        }
    }

    addMessageListener(fn):void{
        this.removeMessageListener(fn);
        this.messageListeners.push(fn);
    }

    removeMessageListener(fn):void{
        let id = this.messageListeners.indexOf(fn);
        if(id != -1){
            this.messageListeners.splice(id,1);
        }
    }

    addPrivateMessageListener(fn):void{
        this.removePrivateMessageListener(fn);
        this.privateMessageListeners.push(fn);
    }

    removePrivateMessageListener(fn):void{
        let id = this.privateMessageListeners.indexOf(fn);
        if(id != -1){
            this.privateMessageListeners.splice(id,1);
        }
    }

    addRollListener(fn):void{
        this.removeRollListener(fn);
        this.rollListeners.push(fn);
    }

    removeRollListener(fn):void{
        let id = this.rollListeners.indexOf(fn);
        if(id != -1){
            this.rollListeners.splice(id,1);
        }
    }

    addVariableListener(fn):void{
        this.removeVariableListener(fn);
        this.variableListeners.push(fn);
    }

    removeVariableListener(fn):void{
        let id = this.variableListeners.indexOf(fn);
        if(id != -1){
            this.variableListeners.splice(id,1);
        }
    }

    addGenericEventListener(fn):void{
        this.removeGenericEventListener(fn);
        this.genericEventListeners.push(fn);
    }

    removeGenericEventListener(fn):void{
        let id = this.genericEventListeners.indexOf(fn);
        if(id != -1){
            this.genericEventListeners.splice(id,1);
        }
    }

    addListListener(fn):void{
        this.removeListListener(fn);
        this.listListeners.push(fn);
    }

    removeListListener(fn):void{
        let id = this.listListeners.indexOf(fn);
        if(id != -1){
            this.listListeners.splice(id,1);
        }
    }

    addFriendsAndBookmarksListener(fn):void{
        this.removeGenericEventListener(fn);
        this.friendsAndBookmarksListeners.push(fn);
    }

    removeFriendsAndBookmarksListener(fn):void{
        let id = this.friendsAndBookmarksListeners.indexOf(fn);
        if(id != -1){
            this.friendsAndBookmarksListeners.splice(id,1);
        }
    }

    addIdentityListener(fn):void{
        this.removeIdentityListener(fn);
        this.identityListeners.push(fn);
    }

    removeIdentityListener(fn):void{
        let id = this.identityListeners.indexOf(fn);
        if(id != -1){
            this.identityListeners.splice(id,1);
        }
    }

    addSystemMessagesListener(fn):void{
        this.removeSystemMessagesListener(fn);
        this.systemMessageListeners.push(fn);
    }

    removeSystemMessagesListener(fn):void{
        let id = this.systemMessageListeners.indexOf(fn);
        if(id != -1){
            this.systemMessageListeners.splice(id,1);
        }
    }

    addTypingStatusListener(fn):void{
        this.removeTypingStatusListener(fn);
        this.typingStatusListeners.push(fn);
    }

    removeTypingStatusListener(fn):void{
        let id = this.typingStatusListeners.indexOf(fn);
        if(id != -1){
            this.typingStatusListeners.splice(id,1);
        }
    }

    addProfileDataListener(fn):void{
        this.removeProfileDataListener(fn);
        this.profileDataListeners.push(fn);
    }

    removeProfileDataListener(fn):void{
        let id = this.profileDataListeners.indexOf(fn);
        if(id != -1){
            this.profileDataListeners.splice(id,1);
        }
    }

    config:IConfig = null;

    banListeners = [];
    chatOPAddedListeners = [];
    chatOPListListeners = [];
    chatOPRemovedListeners = [];
    connectionListeners = [];
    descriptionChangeListeners = [];
    initialChannelDataListeners = [];
    inviteListeners = [];
    joinListeners = [];
    kickListeners = [];
    leaveListeners = [];
    messageListeners = [];
    offlineListeners = [];
    onlineListeners = [];
    pingListeners = [];
    privateMessageListeners = [];
    rollListeners = [];
    statusListeners = [];
    variableListeners = [];
    genericEventListeners = [];
    listListeners = [];
    friendsAndBookmarksListeners = [];
    identityListeners = [];
    typingStatusListeners = [];
    systemMessageListeners = [];
    profileDataListeners = [];

    usersInChannel:string[][] = [];
    chatOPsInChannel:string[][] = [];
    commandHandlers = [];
    users:string[][] = [];

    channels:Map<string, Array<IPlugin>> = new Map<string, Array<IPlugin>>();
    channelNames:Map<string, string> = new Map<string, string>();

    ws:any;

    pingInterval:NodeJS.Timer;

    floodLimit:number = 2.0;
    lastTimeCommandReceived:number = Number.MAX_VALUE;
    commandsInQueue:number = 0;

    timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async sendData(messageType: string, content: string):Promise<void>{
        this.commandsInQueue++;
        let currentTime = parseInt(process.uptime().toString(), 10);

        if((currentTime - this.lastTimeCommandReceived) < this.floodLimit){
            let timeElapsedSinceLastCommand = currentTime - this.lastTimeCommandReceived;
            let timeToWait = (this.commandsInQueue * this.floodLimit) - timeElapsedSinceLastCommand;
            await this.timeout(timeToWait * 1000);
        }

        this.lastTimeCommandReceived = parseInt(process.uptime().toString(), 10);
        this.commandsInQueue--;
        this.sendWS(messageType, content);
    }

    constructor(configuration:IConfig){

        if(configuration == null){
            console.log('No configuration passed, cannot start.');
            process.exit();
        }
        else{
            this.config = configuration;
            if(this.config.username == undefined || this.config.username == "" || this.config.password == undefined || this.config.password == "" || this.config.character == "" || this.config.character == "" || this.config.master == "" || this.config.master == ""){
                console.log('Wrong parameters passed. All the fields in the configuration file are required.');
                process.exit();
            }
        }

        try {
            if (fs.statSync(configDir+fileRoomsJs)) {
                this.channels = new Map(JSON.parse(jsonfile.readFileSync(configDir+fileRoomsJs)));
            }
        }
        catch(err){}

        if(this.config.room !== undefined && this.channels.get(this.config.room) == null){
            this.channels.set(this.config.room, []);
            this.updateRoomsConfig();
        }
    }

    //create one commandHandler per room
    generateCommandHandlers():void{
        for(let room of this.channels.keys()){
            this.commandHandlers[room] = new CommandHandler(this, room);
        }
    }

    setFloodLimit(delay):void{
        this.floodLimit = delay;
    }

    async connect():Promise<void>{
        this.ws = null;
        this.setFloodLimit(2);

        this.generateCommandHandlers();
        this.addMessageListener(this.commandListener); //basic commands + plugins loader, one instance for one bot

        this.addConnectionListener(this.joinChannelOnConnect);
        if(this.config.autoJoinOnInvite){
            this.addInviteListener(this.joinChannelsWhereInvited);
        }

        this.addVariableListener(this.variableChangeHandler);

        //user handling
        this.addInitialChannelDataListener(this.addUsersToList);
        this.addOfflineListener(this.removeUserFromChannels);
        this.addLeaveListener(this.removeUserFromList);
        this.addJoinListener(this.addUserToList);
        this.addJoinListener(this.saveChannelNames);

        //global user state management
        this.addListListener(this.addUserListToGlobalState);
        this.addOnlineListener(this.onChangeUpdateUserState);
        this.addOfflineListener(this.onChangeUpdateUserState);
        this.addStatusListener(this.onChangeUpdateUserState);
        

        //permissions handling
        this.addChatOPListListener(this.addChatOPsToList);
        this.addChatOPAddedListener(this.addChatOPToList);
        this.addChatOPRemovedListener(this.removeChatOPFromList);

        let ticket = await this.getTicket();
        await this.startWebsockets(ticket);
    }

    joinChannelsWhereInvited(args){
        this.joinNewChannel(args.name);
    }

    joinChannelOnConnect(args) {
        for(let room of this.channels.keys()) {
            this.sendWS('JCH', { channel: room });
        }
    }

    setStatus(status:string, message:string){
        this.sendWS('STA', { status: status, statusmsg: message });
    }

    joinNewChannel(channel:string){
        if(this.channels.get(channel) == null){
            this.channels.set(channel, []);
        }
        this.sendWS('JCH', { channel: channel });
        this.commandHandlers[channel] = new CommandHandler(this, channel);

        //save file for rooms
        this.updateRoomsConfig();
    }

    commandListener(args:IMsgEvent) {
        if(typeof this.commandHandlers[args.channel] !== "undefined")
        {
            try {
                this.commandHandlers[args.channel].processCommand(args);
            }
            catch(ex){
                console.log(ex);
                this.throwError(args, ex.toString(), args.channel);
            }
        }
    }

    throwError(args, error, chan){
        console.log("Error: Please message "+this.config.master+" with the following content:\n Error at "+new Date().toLocaleString()+" on command "+JSON.stringify(args)+" in channel "+chan+" with error: "+JSON.stringify(error));
        this.sendMessage("Error: Please message "+this.config.master+" with the following content:\n Error at "+new Date().toLocaleString()+" on command "+JSON.stringify(args)+" in channel "+chan+" with error: "+JSON.stringify(error), chan);
    }

    //user management
    addUsersToList(args) {
        if(typeof this.usersInChannel[args.channel] !== "object"){this.usersInChannel[args.channel] = [];}
        for(let i in args.users){
            if(this.usersInChannel[args.channel].indexOf(args.users[i].identity) == -1){
                this.usersInChannel[args.channel].push(args.users[i].identity);
            }
        }
    }

    addUserToList(args) {
        if(typeof this.usersInChannel[args.channel] !== "object"){this.usersInChannel[args.channel] = [];}
        if(this.usersInChannel[args.channel].indexOf(args.character.identity) == -1){
            this.usersInChannel[args.channel].push(args.character.identity);
        }
    }

    removeUserFromList(args) {
        if(typeof this.usersInChannel[args.channel] !== "object"){ return; }
        if(this.usersInChannel[args.channel].indexOf(args.character) != -1){
            this.usersInChannel[args.channel].splice(this.usersInChannel[args.channel].indexOf(args.character),1);
        }
    }

    removeUserFromChannels(args) { //remove if offline
        for(let i in this.usersInChannel){
            if(typeof this.usersInChannel[i] !== "object"){ continue; }
            if(this.usersInChannel[i].indexOf(args.character) != -1){
                this.usersInChannel[i].splice(this.usersInChannel[i].indexOf(args.character),1);
            }
        }
    }

    saveChannelNames(args) {
        this.channelNames[args.channel] = args.title;
    }

    addUserListToGlobalState(args) {
        args.characters.forEach(character => {
            this.users[character[0]] = character;
        });
    }

    onChangeUpdateUserState(args) {
        let character = "";
        let gender = "";
        let status = "";
        let statusmsg = "";

        if(args.identity){
            character = args.identity;
        }
        if(args.character){
            character = args.character;
        }

        if(args.gender){
            gender = args.gender;
        }

        if(args.status){
            status = args.status;
        }

        if(args.statusmsg){
            statusmsg = args.statusmsg;
        }

        if(character != ""){
            if(this.users[character] === undefined){
                this.users[character] = [character, "", "online", ""];
            }
    
            if(gender != ""){
                this.users[character][1] = gender;
            }
            
            if(status != ""){
                this.users[character][2] = status;
            }
    
            if(statusmsg != ""){
                this.users[character][3] = statusmsg;
            }
        }       
    }

    //permissions
    addChatOPsToList(args) {
        if(typeof this.chatOPsInChannel[args.channel] !== "object"){this.chatOPsInChannel[args.channel] = [];}
        for(let i in args.oplist){
            if(this.chatOPsInChannel[args.channel].indexOf(args.oplist[i]) == -1){
                this.chatOPsInChannel[args.channel].push(args.oplist[i]);
            }
        }
    }

    addChatOPToList(args) {
        if(typeof this.chatOPsInChannel[args.channel] !== "object"){this.chatOPsInChannel[args.channel] = [];}
        if(this.chatOPsInChannel[args.channel].indexOf(args.character) == -1){
            this.chatOPsInChannel[args.channel].push(args.character);
        }
    }

    removeChatOPFromList(args) {
        if(typeof this.chatOPsInChannel[args.channel] !== "object"){ return; }
        if(this.chatOPsInChannel[args.channel].indexOf(args.character) != -1){
            this.chatOPsInChannel[args.channel].splice(this.chatOPsInChannel[args.channel].indexOf(args.character),1);
        }
    }

    variableChangeHandler(args) {
        switch(args.variable){
            case "msg_flood":
                    this.floodLimit = args.value;
                break;
            default:
                break;
        }
    }

    async getTicket(){
        return new Promise<object>((resolve, reject) => {
            request.post({ url: 'https://www.f-list.net/json/getApiTicket.php', form: { account: this.config.username, password: this.config.password } }, (err, httpResponse, body) => {
                if(err){
                    reject(err);
                }
                let response = JSON.parse(body);
                let ticket = response.ticket;
                var json = { "method": "ticket", "account": this.config.username, "ticket": ticket, "character": this.config.character, "cname": this.config.cname, "cversion": this.config.cversion };
                resolve(json);
            });
        });
    }

    sendWS(command, object) {
        if (this.ws.readyState)
            this.ws.send(command + ' ' + JSON.stringify(object));
    }

    sendMessage(message, channel){
        let json:any = {};
        json.channel = channel;
        json.message = message;
        this.sendData('MSG', json);
    }

    sendPrivMessage(message, character){
        let json:any = {};
        json.message = message;
        json.recipient = character;
        this.sendData('PRI', json);
    }

    getProfileData(character){
        let json:any = {};
        json.character = character;
        this.sendData('PRO', json);
    }

    setIsTyping(){
        let json:any = {};
        json.character = this.config.character;
        json.status = "typing"
        this.sendData('TPN', json);
    }

    setIsTypingPaused(){
        let json:any = {};
        json.character = this.config.character;
        json.status = "paused"
        this.sendData('TPN', json);
    }

    setIsNotTyping(){
        let json:any = {};
        json.character = this.config.character;
        json.status = "clear"
        this.sendData('TPN', json);
    }

    getUserList(channel){
        if(this.usersInChannel[channel] == undefined){ return [];}
        return this.usersInChannel[channel];
    }

    getAllUsersList():string[]{
        return [].concat(...this.usersInChannel);
    }

    getChatOPList(channel){
        return (this.chatOPsInChannel[channel] != null ? [] : this.chatOPsInChannel[channel]);
    }

    isUserChatOP(username, channel):boolean{
        return (this.getChatOPList(channel).indexOf(username) != -1 || username == this.config.master);
    }

    isUserMaster(username):boolean{
        return (username == this.config.master);
    }

    disconnect():void{
        this.ws.close();
    }

    restart():void{
        this.disconnect();
        setTimeout(this.connect,2000);
    }

    softRestart(channel):void{
        this.commandHandlers[channel] = new CommandHandler(this, channel);
    }

    roll(customDice, channel):void{
        let json:any = {};
        json.dice = customDice || "1d10";
        json.channel = channel;
        this.sendData("RLL", json);
    }

    updateRoomsConfig():void{
        if (!fs.existsSync(configDir)){
            fs.mkdirSync(configDir);
        }

        let ignoredKeys = ["instanciatedPlugin"];
        let cache = [];
        let tempJson = JSON.stringify([...this.channels], function(key, value) {
            if (typeof value === 'object' && value !== null) {
                if (cache.indexOf(value) !== -1 || ignoredKeys.indexOf(key) !== -1) {
                    // Circular reference found, discard key
                    return;
                }
                // Store value in our collection
                cache.push(value);
            }
            return value;
        });

        jsonfile.writeFile(configDir+fileRoomsJs, tempJson);
    }


    startWebsockets(json):void {
        if (this.config.debug == true) {
            this.ws = new WebSocketClient('wss://chat.f-list.net/chat2');
        }
        else {
            this.ws = new WebSocketClient('wss://chat.f-list.net/chat2');
        }

        this.ws.on('open', (data) => {
            console.log("Started WS");
            this.sendWS('IDN', json);
            clearInterval(pingInterval);
            this.pingInterval = setInterval(() => { this.ws.send('PIN'); }, 25000);
        });

        this.ws.on('close', (data) => {
            console.log("Closed WS");
            process.exit();
        });

        this.ws.on('error', (data) => {
            console.log("Disconnected WS");
            setTimeout(() => { this.connect(); }, 4000);
        });

        this.ws.on('message', (data, flags) => {
            let command:string;
            let argument:any;
            if(this.config.debug){
                console.log(data);
            }
            if (data != null) {
                command = argument = "";
                command = this.splitOnce(data, " ")[0].trim();
                try{
                    if(data.substring(command.length).trim() != ""){
                        argument = JSON.parse(data.substring(command.length).trim());
                    }
                }
                catch (e) {
                }
                switch (command) {
                    case "CON"://CON { "count": int }
                        for (let i =0; i< this.connectionListeners.length; i++) {
                            this.connectionListeners[i].call(this, argument);
                        }
                        break;
                    case "COL": //COL {"oplist":["Newhalf Wrestling","Nastasya Bates","Rinko Saitou"],"channel":"ADH-d0bde7daca1dbe6c79ba"}
                        for (let i =0; i< this.chatOPListListeners.length; i++) {
                            this.chatOPListListeners[i].call(this, argument);
                        }
                        break;
                    case "COA": //COA { "channel": string, "character": string }
                        for (let i =0; i< this.chatOPAddedListeners.length; i++) {
                            this.chatOPAddedListeners[i].call(this, argument);
                        }
                        break;
                    case "COR": //COR { "channel": string, "character": string }
                        for (let i =0; i< this.chatOPRemovedListeners.length; i++) {
                            this.chatOPRemovedListeners[i].call(this, argument);
                        }
                        break;
                    case "FLN": //FLN {"character":"The Kid"}
                        for (let i =0; i< this.offlineListeners.length; i++) {
                            this.offlineListeners[i].call(this, argument);
                        }
                        break;
                    case "ICH": //ICH {"users": [{"identity": "Shadlor"}, {"identity": "Bunnie Patcher"}, {"identity": "DemonNeko"}, {"identity": "Desbreko"}, {"identity": "Robert Bell"}, {"identity": "Jayson"}, {"identity": "Valoriel Talonheart"}, {"identity": "Jordan Costa"}, {"identity": "Skip Weber"}, {"identity": "Niruka"}, {"identity": "Jake Brian Purplecat"}, {"identity": "Hexxy"}], "channel": "Frontpage", mode: "chat"}
                        for (let i =0; i< this.initialChannelDataListeners.length; i++) {
                            this.initialChannelDataListeners[i].call(this, argument);
                        }
                        break;
                    case "JCH": //JCH {"title":"Newhalf Sexual Federation of Wrestling","channel":"ADH-d0bde7daca1dbe6c79ba","character":{"identity":"Kirijou Mitsuru"}}
                        for (let i =0; i< this.joinListeners.length; i++) {
                            this.joinListeners[i].call(this, argument);
                        }
                        break;
                    case "LCH": //LCH {"character":"Darent","channel":"ADH-d0bde7daca1dbe6c79ba"}
                        for (let i =0; i< this.leaveListeners.length; i++) {
                            this.leaveListeners[i].call(this, argument);
                        }
                        break;
                    case "NLN": //FLN {"character":"The Kid"}
                        for (let i =0; i< this.onlineListeners.length; i++) {
                            this.onlineListeners[i].call(this, argument);
                        }
                        break;
                    case "PIN": //PIN
                        for (let i =0; i< this.pingListeners.length; i++) {
                            this.pingListeners[i].call(this, argument);
                        }
                        break;
                    case "RLL"://RLL {"channel": string, "results": [int], "type": enum, "message": string, "rolls": [string], "character": string, "endresult": int} OR RLL {"target":"string","channel":"string","message":"string","type":"bottle","character":"string"}
                        for (let i =0; i< this.rollListeners.length; i++) {
                            this.rollListeners[i].call(this, argument);
                        }
                        break;
                    case "STA": //STA { status: "status", character: "channel", statusmsg:"statusmsg" }
                        for (let i =0; i< this.statusListeners.length; i++) {
                            this.statusListeners[i].call(this, argument);
                        }
                        break;
                    case "CBU": //CBU {"operator":string,"channel":string,"character":string}
                        for (let i =0; i< this.kickListeners.length; i++) {
                            this.kickListeners[i].call(this, argument);
                        }
                        break;
                    case "CKU": //CKU {"operator":string,"channel":string,"character":string}
                        for (let i =0; i< this.banListeners.length; i++) {
                            this.banListeners[i].call(this, argument);
                        }
                        break;
                    case "CDS": //CDS { "channel": string, "description": string }
                        for (let i =0; i< this.descriptionChangeListeners.length; i++) {
                            this.descriptionChangeListeners[i].call(this, argument);
                        }
                        break;
                    case "CIU": //CIU { "sender":string,"title":string,"name":string }
                        for (let i =0; i< this.inviteListeners.length; i++) {
                            this.inviteListeners[i].call(this, argument);
                        }
                        break;
                    case "PRI": //PRI { "character": string, "message": string }
                        for (let i =0; i< this.privateMessageListeners.length; i++) {
                            this.privateMessageListeners[i].call(this, argument);
                        }
                        break;
                    case "MSG": //MSG { "character": string, "message": string, "channel": string }
                        for (let i =0; i< this.messageListeners.length; i++) {
                            this.messageListeners[i].call(this, argument);
                        }
                        break;
                    case "VAR": //VAR { "variable": string, "value": int/float }
                        for (let i =0; i< this.variableListeners.length; i++) {
                            this.variableListeners[i].call(this, argument);
                        }
                        break;
                    case "LIS": //LIS {"characters": [["Alexandrea", "Female", "online", ""], ["Fa Mulan", "Female", "busy", "Away, check out my new alt Aya Kinjou!"]]}
                        for (let i =0; i< this.listListeners.length; i++) {
                            this.listListeners[i].call(this, argument);
                        }
                        break;
                    case "FRL": //FRL {"characters":["Aelith Blanchette"]}
                        for (let i =0; i< this.friendsAndBookmarksListeners.length; i++) {
                            this.friendsAndBookmarksListeners[i].call(this, argument);
                        }
                        break;
                    case "IDN": //IDN { "character": string }
                        for (let i =0; i< this.identityListeners.length; i++) {
                            this.identityListeners[i].call(this, argument);
                        }
                        break;
                    case "TPN": //TPN { "character": string, "status": enum }
                        for (let i =0; i< this.typingStatusListeners.length; i++) {
                            this.typingStatusListeners[i].call(this, argument);
                        }
                        break;
                    case "SYS": //SYS { "message": string, "channel": string }
                        for (let i =0; i< this.systemMessageListeners.length; i++) {
                            this.systemMessageListeners[i].call(this, argument);
                        }
                        break;
                    case "PRD": //PRD { "type": enum, "message": string, "key": string, "value": string }
                        for (let i =0; i< this.profileDataListeners.length; i++) {
                            this.profileDataListeners[i].call(this, argument);
                        }
                        break;
                    default:
                        for (let i =0; i< this.genericEventListeners.length; i++) {
                            this.genericEventListeners[i].call(this, argument);
                        }
                        break;
                }
            }
        });
    }

    splitOnce(str, delim) {
        let components = str.split(delim);
        let result = [components.shift()];
        if (components.length) {
            result.push(components.join(delim));
        }
        return result;
    }

}

