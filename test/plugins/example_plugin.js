var uuid = require('uuid');
var _this;

var CommandHandler = (function () {
    function CommandHandler(fChatLib, chan) {
        this.fChatLibInstance = fChatLib;
        this.fChatLibInstance.addRollListener(rollListener);
        this.channel = chan;
        this.randomId = uuid.v4();
        _this = this;
    }

    CommandHandler.prototype.hello = function (args, data) {
        var word = args || "everyone";
        _this.fChatLibInstance.sendMessage(data.character +" wishes Bonjour! to "+word+ " in " + data.channel, data.channel);
    };

    CommandHandler.prototype.random = function(args, data){
        _this.fChatLibInstance.sendMessage("Random seedu: "+_this.randomId.toString(), data.channel);
    };

    var rollListener = function(parent, args){
        _this.fChatLibInstance.sendMessage("Wow! "+args.character+" just rolled a "+args.endresult+" !", args.channel);
    };

    var msgListen = function(parent, args, channel){
        _this.fChatLibInstance.sendMessage("This guy sent a message "+args.character, args.channel);
    };



    //disabled in order to stop the spam, but the implementation's there.
    //fChatLibInstance.addMessageListener(msgListen);

    return CommandHandler;
}());

module.exports = function (parent, channel) {
    var cmdHandler = new CommandHandler(parent, channel);
    return cmdHandler;
};