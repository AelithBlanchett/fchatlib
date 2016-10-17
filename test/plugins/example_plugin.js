"use strict";
var uuid = require('uuid');
var CommandHandler = (function () {
    function CommandHandler(fChatLib, chan) {
        var _this = this;
        this.fChatLibInstance = fChatLib;
        this.fChatLibInstance.addRollListener(function (args, data) {
            _this.fChatLibInstance.sendMessage("Random seed: " + _this.randomId.toString(), data.channel);
        });
        this.channel = chan;
        this.randomId = uuid.v4();
    }
    CommandHandler.prototype.hello = function (args, data) {
        var word = args || "everyone";
        this.fChatLibInstance.sendMessage(data.character + " wishes Bonjour! to " + word + " in " + data.channel, data.channel);
    };
    ;
    CommandHandler.prototype.rng = function (args, data) {
        this.fChatLibInstance.sendMessage("Random seed: " + this.randomId, data.channel);
    };
    ;
    return CommandHandler;
}());
exports.CommandHandler = CommandHandler;
//# sourceMappingURL=example_plugin.js.map