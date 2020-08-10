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
                .addField('Description', 'CyberChef is a tool for analysing and decoding data without having to deal with complex tools or programming languages.')
                .addField('Arguments', "[bake{To/From} {base64, hex, morsecode, kebabcase, charcode, decimal, etc.} message] ~ encodes or decodes data to/from the specified format\n[parseIPv6 IPv6_address] ~ parses the given IPv6 address & gives information about it, if available\n[convertTimeZone day/month/year hour:minutes:seconds output_time_zone(ex: America/Los_Angeles)] ~ converts the provided date and time to a different time zone")
                .addField('Examples', 'cyberchef bakeTo octal hello world\ncyberchef bakeFrom octal 150 145 154 154 157 40 167 157 162 154 144\ncyberchef parseIPv6 2001:0000:4136:e378:8000:63bf:3fff:fdd2\ncyberchef convertTimeZone 13/03/2008 23:12:27 America/New_York')
                .addField('More Information', 'https://gchq.github.io/CyberChef/ || https://github.com/gchq/CyberChef/wiki/Node-API')
            message.channel.send(helpEmbed);
        }
    }
}