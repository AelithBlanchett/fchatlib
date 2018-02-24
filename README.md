# FChatLib


Small library written in Typescript to work out with F-list's chat system.

There's already a working plugin example [here](https://github.com/AelithBlanchett/FChatBot-ExamplePlugin)

## How to start?

0. [Install Node.JS (tested with v8.4.0)](https://nodejs.org/en/)
2. Open a console (Command invite on windows, or terminal on linux), then go to the directory where you extracted the files. (cd "C:\the\directory")
3. Type 'npm install fchatlib --save'
4. Let's start with the following app.js file.

`
var FChatLib = require('fchatlib');
var options = {username: "MyAccount", password: "MyPassword", character: "MyNewShinyRobot", master: "YourCharacter", room: "ADH-someid"};
var myFchatBot = new FChatLib(options);
myFchatBot.connect();
`

Change the options variable, fill in your credentials, the character your bot show as, and the room ID where the bot will go first.
If you don't know how to get that room ID I'm talking about, just open F-chat, go into the room you want to bot in, type /openroom to open it, then /code to get the code.
The usual format for the code is like this: 'ADH-xxxxxxxxxxxxxxxxxxxx'

4. Type 'node app.js', and watch the bot appear in the room!

5. By default, there aren't any plugins loaded. The !help command will show you which commands are available.
!availableplugins will show the list of plugins in the /plugins folder.
!loadplugin pluginname will load the plugin /plugins/pluginname.js, instanciating the pluginname class that's supposed to be in it.
Once the bot loads a plugin or joins a room, the bot will save and remember to connect to these rooms, and automatically load these plugins.

6. Type '!loadplugin myplugin' in the chat, and it will tell you which commands it has loaded.
Make sure the "myplugin" class is present in it, otherwise the plugin won't load.
I'd advise you to copy/paste the [my_plugin]() plugin, and start from there. 
Remember to load it with !loadplugin yourplugin, and to
reload it with !reloadplugins


## Functions

### `Constructor`

Awaits the option parameter, with the following arguments:
```
var options = {username = "", password = "", character = "", master = "", cname = "", cversion = ""}
var FChatLib = require('fchatlib');
var myFchatBot = new FChatLib(options);
myFchatBot.connect();
```
The required parameters are:

Username and password are your F-List's account's credentials,
character will determine which character on your account will be used for the bot,
master determines which character will have the privileges for rebooting, reloading and etc,

The optional parameters are:
cname is your bot's common name (surely used internally by F-list's),
cversion is the bot's current version (surely used internally by F-list's)

### `connect`

Authenticates the bot with F-list's servers, and connects to the room you've specified in the options.
If the bot had already been running in the past, it will connect to the previous rooms it had joined.
```
myFchatBot.connect();
```

### `sendMessage`

Sends a message to a channel the bot is connected to
```
myFchatBot.sendMessage("Message to send", "ADH-roomIDHere");
```

### `sendPrivMessage`

Sends a private message to a user. Make sure this user wants to receive messages from you.
```
myFchatBot.sendPrivMessage("TheCharacter", "Some nice messsage");
```

### `getUserList`

Retrieves the user list in a specified channel where the bot is connected to
```
var roomId = "ADH-roomIDHere";
var arrayUsers = myFchatBot.getUserList(roomId);
console.log("Here are the users connected in "+roomId+":"+arrayUsers.join(", "));
```

### `getAllUsersList`

Retrieves all the user lists in all channels where the bot is connected to
```
var roomId = "ADH-roomIDHere";
var arrayUsers = myFchatBot.getAllUsersList(roomId);
console.log(JSON.stringify(arrayOPs));
```

### `getChatOpList`

Retrieves the chat operators list in a specified channel where the bot is connected to
```
var roomId = "ADH-roomIDHere";
var arrayOPs = myFchatBot.getChatOpList(roomId);
console.log("Here are the chat operators connected in "+roomId+":"+arrayOPs.join(", "));
```

### `isUserChatOP`

Checks if the specified user in the specified channel is an operator. Returns true or false.
```
var isUserAMod = myFchatBot.isUserChatOP("MyCharacter", "ADH-roomIDHere");
```

### `softRestart`

Restarts the bot in the specified channel. Doesn't reboot it completely as it's still broken.
```
myFchatBot.softRestart("ADH-roomIDHere");
```

### `roll`

Rolls a die in a specific channel. If the first parameter is undefined, it will default to 1d10
```
myFchatBot.roll("1d20", "ADH-roomIDHere");

myFchatBot.roll(undefined, "ADH-roomIDHere");

myFchatBot.roll("1d20+5+2-1+8", "ADH-roomIDHere");
```

### `disconnect`

Disconnects. : /
```
myFchatBot.disconnect();
```

### `restart`

Still broken! The process will exit instead.
```
myFchatBot.restart();
```

### `sendWS` (experimented users only)

Sends the command with some data, as specified in the API [here](https://wiki.f-list.net/F-Chat_Client_Commands)
```
myFchatBot.sendWS('COL', { 'character': 'SomeCharacter' });
```


## Action Listeners

There are many actions that you can add a listener on. Each listener receives the same number and kind parameters, except for the data that changes with the action received.

Example:

You want to know when someone rolls a die, and want to know the score. Add a listener to it:
```
fChatLibInstance.addRollListener(function(parent, data){
        console.log(data.character+" rolled a "+data.endresult);
    });
```

Each listener will be fed two parameters: parent is the fChatLibInstance the action was received on, and data, the actual data the server had sent with the action.

### `addJoinListener`

Adds a listener for when a user joins the room for the first time.

```
var myFunction = function(parent,data){console.log('Do something!');};
fChatLibInstance.removeJoinListener(myFunction);

OR 


fChatLibInstance.addJoinListener(function(parent, data){
        console.log(data.character.identity+" joined the room.");
    });
```

### `removeJoinListener`

Removes that listener for this action.

```
var myFunction = function(parent,data){console.log('Do something!');};
fChatLibInstance.removeJoinListener(myFunction);
```


### To be continued

The list of listeners is here

    addConnectionListener
    removeConnectionListener
    addJoinListener
    removeJoinListener
    addLeaveListener
    removeLeaveListener
    addOnlineListener
    removeOnlineListener
    addOfflineListener
    removeOfflineListener
    addStatusListener
    removeStatusListener
    addChatOPListListener
    removeChatOPListListener
    addChatOPAddedListener
    removeChatOPAddedListener
    addChatOPRemovedListener
    removeChatOPRemovedListener
    addInviteListener
    removeInviteListener
    addKickListener
    removeKickListener
    addBanListener
    removeBanListener
    addDescriptionChangeListener
    removeDescriptionChangeListener
    addPingListener
    removePingListener
    addInitialChannelDataListener
    removeInitialChannelDataListener
    addMessageListener
    removeMessageListener
    addPrivateMessageListener
    removePrivateMessageListener
    addRollListener
    removeRollListener
    addVariableListener
    removeVariableListener