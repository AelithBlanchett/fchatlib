module.exports = function (parent) {
    var fChatLibInstance = parent;

    var cmdHandler = {};

    cmdHandler.wrestle = function (args, data) {
        if(fChatLibInstance.getUserList(data.channel).length < 3){fChatLibInstance.sendMessage('There aren\'t enough wrestlers here!', data.channel); return; }
        var idFirstWrestler;
        do{
            idFirstWrestler = getRandomInt(0,fChatLibInstance.getUserList(data.channel).length);
        }while(fChatLibInstance.getUserList(data.channel)[idFirstWrestler] == parent.config.character)
        var idSecondWrestler;
        do{
           idSecondWrestler = getRandomInt(0,fChatLibInstance.getUserList(data.channel).length);
        }while(idSecondWrestler == idFirstWrestler || fChatLibInstance.getUserList(data.channel)[idSecondWrestler] == parent.config.character)

        fChatLibInstance.sendMessage('I think that... '+fChatLibInstance.getUserList(data.channel)[idFirstWrestler]+' should fight '+fChatLibInstance.getUserList(data.channel)[idSecondWrestler]+'!', data.channel);
    };

    return cmdHandler;
};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}