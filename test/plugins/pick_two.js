var _this;

var CommandHandler = (function () {
    function CommandHandler(fChatLib, chan) {
        this.fChatLibInstance = fChatLib;
        this.channel = chan;
        _this = this;
    }

    CommandHandler.prototype.wrestle = function (args, data) {
        if(_this.fChatLibInstance.getUserList(data.channel).length < 3){_this.fChatLibInstance.sendMessage('There aren\'t enough wrestlers here!', data.channel); return; }
        var idFirstWrestler;
        do{
            idFirstWrestler = getRandomInt(0,_this.fChatLibInstance.getUserList(data.channel).length);
        }while(_this.fChatLibInstance.getUserList(data.channel)[idFirstWrestler] == _this.fChatLibInstance.config.character)
        var idSecondWrestler;
        do{
           idSecondWrestler = getRandomInt(0,_this.fChatLibInstance.getUserList(data.channel).length);
        }while(idSecondWrestler == idFirstWrestler || _this.fChatLibInstance.getUserList(data.channel)[idSecondWrestler] == parent.config.character)

        _this.fChatLibInstance.sendMessage('I think that... '+_this.fChatLibInstance.getUserList(data.channel)[idFirstWrestler]+' should fight '+_this.fChatLibInstance.getUserList(data.channel)[idSecondWrestler]+'!', data.channel);
    };

    return CommandHandler;
}());

module.exports = function (parent, channel) {
    var cmdHandler = new CommandHandler(parent, channel);
    return cmdHandler;
};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}