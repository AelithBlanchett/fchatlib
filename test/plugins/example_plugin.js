module.exports = function (parent, args) {
    var fChatLibInstance = parent;

    var cmdHandler = {};

    cmdHandler.myString = "";


    cmdHandler.hello = function (args, data) {
        var word = args || "everyone";
        fChatLibInstance.sendMessage(data.character +" wishes Bonjour! to "+word, data.channel);
    };

    function rollListener(parent, args){
        fChatLibInstance.sendMessage("Wow! "+args.character+" just rolled a "+args.endresult+" !", data.channel);
    }

    fChatLibInstance.addRollListener(rollListener);

    return cmdHandler;
};