// Get load permissions
const {loadCommandPermissions, loadSendMethods, loadBotCommands} = require("./loadCommandPermissions");

//libary needed to connect to twitch
const tmi = require("tmi.js");

require("dotenv").config();

const channelName = process.env.CHANNEL_NAME;

const client = new tmi.Client({
    identity:{
        username: process.env.BOT_USERNAME,
        password: process.env.OAUTH_TOKEN
    },
    channels: [process.env.CHANNEL_NAME]
});

client.connect();

client.on('join', (channel, username, self) => {
    if(self)
    {
        console.log("Connected");
        client.say(channelName, "Hello Everyone").catch(console.error);
    }
});

loadCommandPermissions()
.then((permissions) => {
    console.log("Permissions loaded: ", permissions);
})
.catch((error) => {
    console.error("Failed to load: ", error)
});

loadSendMethods()
.then((sendMethods) => {
    console.log("sendMethods loaded: ", sendMethods);
})
.catch((error) =>{
    console.error("Failed to load sendMethod, ", error);
})

loadBotCommands()
.then((botCommands) => {
    console.log("Bot Commands loaded: ", botCommands);
})
.catch((error) => {
    console.error("Failed to load bot commands, ", error);
})