var uuid = require('uuid');

export class CommandHandler {
    fChatLibInstance: any;
    channel: string;
    randomId: any;

    constructor(fChatLib, chan) {
        this.fChatLibInstance = fChatLib;
        this.fChatLibInstance.addRollListener((args, data) => {
            this.fChatLibInstance.sendMessage("Random seed: " + this.randomId.toString(), data.channel);
        });
        this.channel = chan;
        this.randomId = uuid.v4();
    }

    hello(args, data) {
        var word = args || "everyone";
        this.fChatLibInstance.sendMessage(data.character + " wishes Bonjour! to " + word + " in " + data.channel, data.channel);
    };

    rng(args, data) {
        this.fChatLibInstance.sendMessage("Random seed: "+this.randomId, data.channel);
    };
}