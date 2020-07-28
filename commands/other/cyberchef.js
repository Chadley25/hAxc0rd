module.exports = {
    name: "cyberchef",
    category: "other",
    run: async (client, message, args) => {
        const Discord = require('discord.js');
        const chef = require("cyberchef");
        var arguments = message.toString().slice((message.content).substr(0,message.content.indexOf(' ')).length + 1);

        if (args[0] == "bakeTo") { // converts string to the format requested
            arguments = arguments.substr(7);
            let action = arguments.split(' ')[0];
            let string = arguments.replace(action, '').substr(1);
            try {
                message.reply("here is your result:\n`" + chef.bake(string, "to " + action).toString() + "`");
            } catch (error) {
                message.channel.send(`**An error has occured:** ${error.message}`);
            }
        } else if (args[0] == "bakeFrom") { // decodes the string specified
            arguments = arguments.substr(9);
            let action = arguments.split(' ')[0];
            let string = arguments.replace(action, '').substr(1);
            try {
                message.reply("here is your result:\n`" + chef.bake(string, "from " + action).toString() + "`");
            } catch (error) {
                message.channel.send(`**An error has occured:** ${error.message}`);
            }
        }
        else if (args[0] == "parseIPv6") { // parses through the specified IPv6 address and displays info about it
            try {
                message.reply("here is your result:\n" + chef.parseIPv6Address(args[1]).toString());
            } catch (error) {
                message.channel.send(`**An error has occured:** ${error.message}`);
            }
        } else if (args[0] == "convertTimeZone") { // changes the time specified for a different timezone
            let argumentsSplit = arguments.split(' ');
            let date = argumentsSplit[1];
            let time = argumentsSplit[2];
            let place = argumentsSplit[3];
            try {
                message.reply("here are your results:\n`" + chef.translateDateTimeFormat(date + " " + time, {
                    outputTimezone: place
                }).toString() + "`\n*Note: If the time is exactly the same, this may be due to the timezone entered not being valid.*" 
                + " *A list of all valid timezones can be found at http://momentjs.com/timezone/docs/#/data-loading/.*");
            } catch (error) {
                message.channel.send(`**An error has occured:** ${error.message}`);
            }
        } else {
            // displays information about CyberChef in a message embed
            const helpEmbed = new Discord.MessageEmbed()
                .setColor('#f01d0e')
                .setTitle('CyberChef - Help')
                .addField('Description', 'CyberChef is a web app/framework for encryption, encoding, compression, and data analysis.')
                .addField('Arguments', "bake{To/From} [base64, hex, morsecode, kebabcase, charcode, decimal, etc.] [message]\nparseIPv6 [IPv6 address]\nconvertTimeZone [day/month/year hour:minutes:seconds outputTimezone(ex: America/Los_Angeles)]")
                .addField('More Information', 'https://gchq.github.io/CyberChef/')
            message.channel.send(helpEmbed);
        }
    }
}