var uuid = require('uuid');

module.exports = function (parent, args) {
    var fChatLibInstance = parent;

    var cmdHandler = {};

    cmdHandler.myString = "";

    cmdHandler.randomId = uuid.v4();

    cmdHandler.hello = function (args, data) {
        var word = args || "everyone";
        fChatLibInstance.sendMessage(data.character +" wishes Bonjour! to "+word, data.channel);
    };

    cmdHandler.random = function(args, data){
        fChatLibInstance.sendMessage("Random seed: "+this.randomId.toString(), data.channel);
    }

    function rollListener(parent, args){
        fChatLibInstance.sendMessage("Wow! "+args.character+" just rolled a "+args.endresult+" !", args.channel);
    }

    fChatLibInstance.addRollListener(rollListener);

    return cmdHandler;
};