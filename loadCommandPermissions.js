const fs = require("fs");
const csv = require("csv-parser");
const { Console } = require("console");

const permissions = new Map();
const sendMethods = new Map();
const botCommands = new Map();

function loadCommandPermissions()
{
    return new Promise((resolve, reject) => {
        //Create a stream to read in csv file
        fs.createReadStream("commandPermissions.csv")
        .pipe(csv())
        // Get each row from the csv file
        .on("data", (row) => {
            permissions.set(parseInt(row.id), row.name);
        })
        // Called after the file is done being read
        .on("end", () =>{
            resolve(permissions);
        })
        .on("error", (err) => {
            reject(err);
        });
    })
}

function loadSendMethods()
{
    return new Promise((resolve, reject) => {
        fs.createReadStream("sendMethods.csv")
        .pipe(csv())
        .on("data", row => {
            sendMethods.set(parseInt(row.id), row.messageType);
        })
        .on("end", () => {
            resolve(sendMethods);
        })
        .on("error", (err) => {
            reject(err);
        });
    })
}

function loadBotCommands()
{
    return new Promise((resolve, reject) => {
        fs.createReadStream("botCommands.csv")
        .pipe(csv())
        .on("data", row =>{
            botCommands.set(row.command,
                {
                    response: row.response,
                    permission: row.permission,
                    sendMethod: row.sendMethod
                }
            )
        })
        .on("end", () =>{
            resolve(botCommands);
        })
        .on("error", (err) => {
            reject(err);
        });
    })
}

function loadMods()
{
    return new Promise((resolve, reject) =>
    {
        fs.readFile("mods.txt", "utf-8", (err, data) =>{
            if(err)
            {
                reject(err);
            }
            else{
                const mods = data.split("\n");
                resolve(mods);
            }
        })
    })
}
module.exports = {loadCommandPermissions, loadSendMethods, loadBotCommands, loadMods};

