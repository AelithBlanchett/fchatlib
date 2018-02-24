import {IPlugin} from "./IPlugin";
import {IConfig} from "./IConfig";

export interface IFChatLib {

    addConnectionListener(fn:Function):void;
    removeConnectionListener(fn):void;
    addJoinListener(fn):void;
    removeJoinListener(fn):void;
    addLeaveListener(fn):void;
    removeLeaveListener(fn):void;
    addOnlineListener(fn):void;
    removeOnlineListener(fn):void;
    addOfflineListener(fn):void;
    removeOfflineListener(fn):void;
    addStatusListener(fn):void;
    removeStatusListener(fn):void;
    addChatOPListListener(fn):void;
    removeChatOPListListener(fn):void;
    addChatOPAddedListener(fn):void;
    removeChatOPAddedListener(fn):void;
    addChatOPRemovedListener(fn):void;
    removeChatOPRemovedListener(fn):void;
    addInviteListener(fn):void;
    removeInviteListener(fn):void;
    addKickListener(fn):void;
    removeKickListener(fn):void;
    addBanListener(fn):void;
    removeBanListener(fn):void;
    addDescriptionChangeListener(fn):void;
    removeDescriptionChangeListener(fn):void;
    addPingListener(fn):void;
    removePingListener(fn):void;
    addInitialChannelDataListener(fn):void;
    removeInitialChannelDataListener(fn):void;
    addMessageListener(fn):void;
    removeMessageListener(fn):void;
    addPrivateMessageListener(fn):void;
    removePrivateMessageListener(fn):void;
    addRollListener(fn):void;
    removeRollListener(fn):void;
    addVariableListener(fn):void;
    removeVariableListener(fn):void;

    config:IConfig;

    banListeners:any;
    chatOPAddedListeners:any;
    chatOPListListeners:any;
    chatOPRemovedListeners:any;
    connectionListeners:any;
    descriptionChangeListeners:any;
    initialChannelDataListeners:any;
    inviteListeners:any;
    joinListeners:any;
    kickListeners:any;
    leaveListeners:any;
    messageListeners:any;
    offlineListeners:any;
    onlineListeners:any;
    pingListeners:any;
    privateMessageListeners:any;
    rollListeners:any;
    statusListeners:any;
    variableListeners:any;

    usersInChannel:any;
    chatOPsInChannel:any;
    commandHandlers:any;

    channels:Map<string, Array<IPlugin>>;

    ws:any;

    pingInterval:NodeJS.Timer;

    floodLimit:number;
    lastTimeCommandReceived:number;
    commandsInQueue:number;

    sendData(messageType: string, content: string):Promise<void>;
    generateCommandHandlers():void;
    setFloodLimit(delay):void;
    connect():Promise<void>;
    joinChannelsWhereInvited(args):void;
    joinChannelOnConnect(args):void;
    setStatus(status:string, message:string):void;
    joinNewChannel(channel:string):void;
    commandListener(args:any, chanName:string):void;
    throwError(args, error, chan):void;
    addUsersToList(args):void;
    addUserToList(args):void;
    removeUserFromList(args):void;
    removeUserFromChannels(args):void;
    addChatOPsToList(args):void;
    addChatOPToList(args):void;
    removeChatOPFromList(args):void;
    variableChangeHandler(args):void;
    getTicket():Promise<object>;
    sendWS(command, object):void;
    sendMessage(message, channel):void;
    sendPrivMessage(message, character):void;
    getUserList(channel):string[];
    getAllUsersList():string[];
    getChatOPList(channel):string[];
    isUserChatOP(username, channel):boolean;
    isUserMaster(username):boolean;
    disconnect():void;
    restart():void;
    softRestart(channel):void;
    roll(customDice, channel):void;
    updateRoomsConfig():void;
    startWebsockets(json):void;
    splitOnce(str, delim):string[];

}

