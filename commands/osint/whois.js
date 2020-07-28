module.exports = {
    name: "whois",
    category: "osint",
    run: async (client, message, args) => {
        const { exec } = require('child_process');
        const Discord = require('discord.js');
        const arguments = message.toString().slice((message.content).substr(0,message.content.indexOf(' ')).length + 1);
        
        if (args[0] == "help") {
            // displays information about whois in a message embed
            const helpEmbed = new Discord.RichEmbed()
                .setColor('#f01d0e')
                .setTitle('Whois - Help')
                .addField('Description', "WHOIS is a query and response protocol used to query databases that store the registered users or assigness of an internet resource.")
                .addField('Arguments', "[-H] ~ do not show the legal disclamers that some directories like to show\n[-h HOST] ~ connects to a host\n[-p PORT] ~ connects to a port\n[-I] ~ first query whois.iana.org and then follow its referral to the whois server authoritative for that requests")
                .addField('More Information', 'https://www.iana.org/whois')    
            message.channel.send(helpEmbed);
        } else {
            // executes the "whois" command locally and displays the output
            exec(`whois ${arguments}`, (error, stdout, stderr) => {
                if (error) {
                    message.channel.send(`**An error has occured:** ${error.message}`)
                    return;
                } else if (stderr) {
                    message.channel.send(`**An error has occured:** ${stderr}`);
                    return;
                // if message exceeds Discord's character limit, split the message into multiple ones
                } else if (stdout.length > 2000) {
                    const command = client.commands.get("seperateMessage");
                    command.run(message, stdout);
                } else {
                    message.channel.send(`${stdout}`);
                }
            });
        }
    }
}