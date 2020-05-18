// Discord Security Bot
// Bradley Chavis & Thomas David Austad

const { Client, Collection } = require('discord.js');
const { config } = require('dotenv');
const jsonConfig = require('./config.json');
const { exec } = require("child_process");

const client = new Client({
    disableEveryone: true
})

// adds collections for commands and aliases
client.commands = new Collection();
client.aliases = new Collection();

// specifies the config path
config({
    path: __dirname + "/.env"
});

// loads all handlers
["command"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});

client.on("ready", () => {
    console.log(`Bot started as ${client.user.tag}...`);

    // sets bot status
    client.user.setPresence({
        status: "dnd",
        game: {
            name: "Brad fail at making a bot",
            type: "WATCHING"
        }
    });
})

client.on("message", async message => {
    const prefix = jsonConfig.prefix;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    if (message.author.bot) return;
    if (!message.guild) return;
    if (!message.content.startsWith(prefix)) return;
    if (!message.member) message.member = await message.guild.fetchMember(message);
    if (cmd.length === 0) return;

    // defines the command to load
    let command = client.commands.get(cmd);
    // if command doesn't exist, see if there is an alias
    if (!command) command = client.commands.get(client.aliases.get(cmd));

    // if command found, run & check if user has permission
    if (command)
        if (hasPermission(message)) {
            command.run(client, message, args);
        } else {
            message.reply("it seems that you don't have permission to use this command. Please contact the owner of this bot if you believe this is incorrect.");
        }
});

// checks is user's ID or role is in the permissionsConfig.json file
function hasPermission(message) {
    if (jsonConfig.allowedMemberIDs.includes(message.author.id)) {
        return true;
    }
    for (let i = 0; i < jsonConfig.allowedRoles.length; i++) {
        if (message.member.roles.find(r => r.name == jsonConfig.allowedRoles[i])) {
            return true;
        }
    }
    return false;
}

process.stdin.resume();//so the program will not close instantly

function exitHandler() {
    exec('rm -rf files/*');
    process.exit();
}

//do something when app is closing
process.on('exit', exitHandler.bind());

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind());

client.login(process.env.TOKEN);