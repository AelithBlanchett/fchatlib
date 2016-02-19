module.exports = function (parent, args) {
    var fChatLibInstance = parent;

    var cmdHandler = {};

    cmdHandler.myString = "";


    cmdHandler.hello = function (args, data) {
        var word = args || "everyone";
        fChatLibInstance.sendMessage(data.character +" wishes Bonjour! to "+word);
    };

    function rollListener(parent, args){
        fChatLibInstance.sendMessage("Wow! "+args.character+" just rolled a "+args.endresult+" !");
    }

    fChatLibInstance.addRollListener(rollListener);

    return cmdHandler;
};