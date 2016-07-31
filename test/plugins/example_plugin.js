var uuid = require('uuid');

module.exports = function (parent, channel) {
    var fChatLibInstance = parent;

    var cmdHandler = {};

    cmdHandler.channel = channel;

    cmdHandler.randomId = uuid.v4();

    cmdHandler.hello = function (args, data) {
        var word = args || "everyone";
        fChatLibInstance.sendMessage(data.character +" wishes Bonjour! to "+word+ " in "+cmdHandler.channel, data.channel);
    };

    cmdHandler.random = function(args, data){
        fChatLibInstance.sendMessage("Random seed: "+this.randomId.toString(), data.channel);
    }

    function rollListener(parent, args){
        fChatLibInstance.sendMessage("Wow! "+args.character+" just rolled a "+args.endresult+" !", args.channel);
    }

    function msgListen(parent, args, channel){
        fChatLibInstance.sendMessage("This guy sent a message "+args.character, args.channel);
    }

    fChatLibInstance.addRollListener(rollListener);

    //disabled in order to stop the spam, but the implementation's there.
    //fChatLibInstance.addMessageListener(msgListen);

    return cmdHandler;
};