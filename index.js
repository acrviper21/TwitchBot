// Get load permissions
const {loadCommandPermissions, loadSendMethods, loadBotCommands, loadMods} = require("./loadCommandPermissions");

//libary needed to connect to twitch
const tmi = require("tmi.js");

require("dotenv").config();

const channelName = process.env.CHANNEL_NAME;
const commandRegex = new RegExp(" ?!.+ ?");
let commandPermissions;
let sendMethods;
let botCommands;
let mods;

const client = new tmi.Client({
    identity:{
        username: process.env.BOT_USERNAME,
        password: process.env.OAUTH_TOKEN
    },
    channels: [process.env.CHANNEL_NAME]
});

setupBot();

//Bot setup to run before connecting to twitch
async function setupBot()
{
    try 
    {
        commandPermissions = await loadCommandPermissions();
        sendMethods = await loadSendMethods();
        botCommands = await loadBotCommands();
        mods = await loadMods();
        
        await client.connect();
        
    } catch (error) 
    {
        console.log("Error has occurred: ", error)
    } 
}

client.on('join', (channel, username, self) => {
    if(self)
    {

        client.say(channelName, "Hello Everyone").catch(console.error);
    }
});

client.on("message",(channel, tags, message, self) => {
    if(self)
    {
        return;
    }
    //Regular expression to match for commands
    const command = message.match(commandRegex);

    //Check if command is in the list
    if(botCommands.has(command[0]))
    {
        //If command in list then grab it and check the permissions
        //If user has appropriate permissions then output response
        const response = botCommands.get(command[0]);
        switch(parseInt(response.permission)){
            case 1:
                //Check to see if user has badge then check if they're the streamer
                if(tags.badges && tags.badges.broadcaster === "1")
                {
                    sendMessage(channel, response.response, parseInt(response.sendMethod));
                }
                break;
            case 2:
                if(!tags.mod && (!tags.badges || tags.badges.broadcaster != "1"))
                {
                    return;
                }
                    sendMessage(channel, response.response, parseInt(response.sendMethod));
                break;
            case 3:
                sendMessage(channel, response.response, parseInt(response.sendMethod));
                break;
            default:
                break;
        }
    }
})

function sendMessage(channel, response, messageType)
{
    if(parseInt(messageType) === 1)
    {
        client.say(channel, response);
    }else{
        client.action(channel, response);
    }
}