import CommandHandler from "./CommandHandler";
import {IPlugin} from "./IPlugin";

let requireNew = require('require-clean');

export class CommandHandlerHelper{

    commandHandler:CommandHandler;

    constructor(commandHandler:CommandHandler){
        this.commandHandler = commandHandler;
    }

    internalLoadPlugin(pluginName:string, commandHandler:CommandHandler){
        let indexPluginAlreadyExists = commandHandler.pluginsLoaded.findIndex(x => x.name == pluginName);
        if(indexPluginAlreadyExists != -1){
            commandHandler.pluginsLoaded.splice(indexPluginAlreadyExists, 1);
        }

        let path = process.cwd()+"\\plugins\\"+pluginName;

        try {
            let plugin:IPlugin = {name:"", instanciatedPlugin: {}};

            let customPlugin = requireNew(path);
            plugin.instanciatedPlugin = new customPlugin.CommandHandler(this.commandHandler.fChatLibInstance, this.commandHandler.channelName);
            plugin.name = pluginName;

            let strAddedCommands = "";

            for (let command of this.internalGetAllFuncs(plugin.instanciatedPlugin)) {
                strAddedCommands += "!" + command + ", ";
            }

            strAddedCommands = strAddedCommands.substr(0, strAddedCommands.length - 2);

            if (strAddedCommands == "") {
                commandHandler.fChatLibInstance.sendMessage("There weren't any loaded commands for this plugin. Are you sure it exists?", commandHandler.channelName);
            }
            else {
                commandHandler.fChatLibInstance.sendMessage("The following commands were loaded: " + strAddedCommands, commandHandler.channelName);
                commandHandler.pluginsLoaded.push(plugin);

                this.internalUpdatePluginsFile();
            }
        }
        catch(ex){
            if(ex && ex.code == "MODULE_NOT_FOUND"){
                let safeToDisplayPath = path.substr(path.indexOf("plugins"));
                this.commandHandler.fChatLibInstance.sendMessage("Plugin "+pluginName+" couldn't be found. (Path: '" + safeToDisplayPath + "' )", commandHandler.channelName);
            }
            else{
                this.commandHandler.fChatLibInstance.throwError("!loadplugin", ex.toString(), commandHandler.channelName);
            }

        }
    }

    internalUpdatePlugins(){
        // var exec = require('child_process').exec;
        // let child = exec('npm update',
        //     (error, stdout, stderr) => {
        //         if (error !== null) {
        //             this.commandHandler.fChatLibInstance.throwError('Plugins update', error, this.commandHandler.channelName);
        //         }
        //         else{
        //             this.commandHandler.fChatLibInstance.sendMessage("Plugins updated.", this.commandHandler.channelName);
        //         }
        //     });
    }

    internalUnloadPlugin(pluginName){
        if(this.commandHandler.pluginsLoaded.findIndex(x => x.name == pluginName) == -1){
            this.commandHandler.pluginsLoaded.splice(this.commandHandler.pluginsLoaded.findIndex(x => x.name == pluginName), 1);
            this.internalUpdatePluginsFile();
        }
    }

    internalUpdatePluginsFile(){
        this.commandHandler.fChatLibInstance.channels.set(this.commandHandler.channelName, this.commandHandler.pluginsLoaded);
        this.commandHandler.fChatLibInstance.updateRoomsConfig();
    }


    internalLoadPluginOnStart(pluginsArray, commandHandler) {
        for (let i = 0; i < pluginsArray.length; i++) {

            let plugin:IPlugin = {name: "", instanciatedPlugin: {}};

            plugin.name = pluginsArray[i].name;

            let indexPluginAlreadyExists = commandHandler.pluginsLoaded.findIndex(x => x.name == plugin.name);
            if(indexPluginAlreadyExists != -1){
                commandHandler.pluginsLoaded.splice(indexPluginAlreadyExists, 1);
            }

            let path = process.cwd()+"\\plugins\\"+plugin.name;
            try {
                let customPlugin = requireNew(path);
                plugin.instanciatedPlugin = new customPlugin.CommandHandler(this.commandHandler.fChatLibInstance, this.commandHandler.channelName);
                let strAddedCommands = "";

                for (let command of this.internalGetAllFuncs(plugin.instanciatedPlugin)) {
                    strAddedCommands += "!" + command + ", ";
                }

                strAddedCommands = strAddedCommands.substr(0, strAddedCommands.length - 2);

                if (strAddedCommands == "") {
                    console.log(`There weren't any loaded commands for the plugin ${plugin.name} (Channel: ${commandHandler.channelName}. Are you sure it exists?`);
                }
                else {
                    console.log(`The following commands were automatically loaded: ${strAddedCommands} (Channel: ${commandHandler.channelName}`);
                    commandHandler.pluginsLoaded.push(plugin);

                    this.internalUpdatePluginsFile();
                }
            }
            catch(ex){
                if(ex && ex.code == "MODULE_NOT_FOUND"){
                    let safeToDisplayPath = path.substr(path.indexOf("plugins"));
                    console.log(`Plugin ${plugin.name } couldn't be found. (Path: ${safeToDisplayPath} , Channel: ${commandHandler.channelName}`);
                }
                else{
                    console.log(`Unexpected error in channel ${commandHandler.channelName}: ${ex.toString()}`);
                }

            }
        }
    }

    internalGetAllFuncs(obj) {
        let props = [];

        do {
            const l = Object.getOwnPropertyNames(obj)
                .concat(Object.getOwnPropertySymbols(obj).map(s => s.toString()))
                .sort()
                .filter((p, i, arr) =>
                    typeof obj[p] === 'function' &&  //only the methods
                    p !== 'constructor' &&           //not the constructor
                    p !== 'processCommand' &&        //not the command processor
                    (i == 0 || p !== arr[i - 1]) &&  //not overriding in this prototype
                    props.indexOf(p) === -1          //not overridden in a child
                );
            props = props.concat(l);
        }
        while (
            (obj = Object.getPrototypeOf(obj)) &&   //walk-up the prototype chain
            Object.getPrototypeOf(obj)              //not the the Object prototype methods (hasOwnProperty, etc...)
            );

        return props;
    }

    internalGetUptime() {
        let sec_num = parseInt(process.uptime().toString(), 10); // don't forget the second param
        let hours   = Math.floor(sec_num / 3600);
        let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        let seconds = sec_num - (hours * 3600) - (minutes * 60);
        let hoursString   = hours.toString();
        let minutesString = minutes.toString();
        let secondsString = seconds.toString();

        if (hours   < 10) {hoursString   = "0"+hours;}
        if (minutes < 10) {minutesString = "0"+minutes;}
        if (seconds < 10) {secondsString = "0"+seconds;}
        return hoursString+':'+minutesString+':'+secondsString;
    }
}