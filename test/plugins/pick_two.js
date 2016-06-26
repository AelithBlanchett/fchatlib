module.exports = function (parent) {
    var fChatLibInstance = parent;

    var cmdHandler = {};

    cmdHandler.wrestle = function (args, data) {
        if(fChatLibInstance.userList.length < 3){fChatLibInstance.sendMessage('There aren\'t enough wrestlers here!', data.channel); return; }
        var idFirstWrestler;
        do{
            idFirstWrestler = getRandomInt(0,fChatLibInstance.userList.length);
        }while(fChatLibInstance.userList[idFirstWrestler] == parent.config.character)
        var idSecondWrestler;
        do{
           idSecondWrestler = getRandomInt(0,fChatLibInstance.userList.length);
        }while(idSecondWrestler == idFirstWrestler || fChatLibInstance.userList[idSecondWrestler] == parent.config.character)

        fChatLibInstance.sendMessage('I think that... '+fChatLibInstance.userList[idFirstWrestler]+' should fight '+fChatLibInstance.userList[idSecondWrestler]+'!', data.channel);
    };

    return cmdHandler;
};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}