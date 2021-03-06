module.exports = {
    name: "commands",
    category: "info",
    aliases: ["test", "help"],
    description: "Command to see all the commands that can be ran",
    run: async (client, message, args) => {
        const Discord = require('discord.js');
        const jsonConfig = require('../../config.json')
        // returns a list of all commands in a richembed
        const richembed = new Discord.MessageEmbed()
            .setColor('#f542c8')
            .setTitle('Commands')
            .setDescription("If you would like to know more about a certain command, type the prefix, that command, and then 'help'.")
            .addField('Prefix', jsonConfig.prefix)
            .addField('Info', 'commands\nping')
            .addField('OSINT', "haveibeenpwned\nshodan\nwhois\ndorking")
            .addField('Recon', 'dig\nnslookup\nvirustotal\nnmap')
            .addField('Exploit', 'nikto\nhydra\njohntheripper\ngobuster')
            .addField('Other', 'cyberchef\nhackerman')
        message.channel.send(richembed);
    }
}