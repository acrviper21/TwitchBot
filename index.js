// Get load permissions
const {loadCommandPermissions, loadSendMethods, loadBotCommands, loadMods} = require("./loadCommandPermissions");

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

setupBot();

async function setupBot()
{
    try 
    {
        const commandPermissions = await loadCommandPermissions();
        const sendMethods = await loadSendMethods();
        const botCommands = await loadBotCommands();
        const mods = await loadMods();
        // console.log("Permissions loaded: ", commandPermissions);
        // console.log("sendMethods loaded: ", sendMethods);
        // console.log("Bot Commands loaded: ", botCommands);
        // console.log("Mods loaded: ", mods);
        
        client.connect();
        
    } catch (error) 
    {
        console.log("Error has occurred: ", error)
    } 
}

client.on('join', (channel, username, self) => {
    if(self)
    {
        console.log("Connected");
        client.say(channelName, "Hello Everyone").catch(console.error);
    }
});