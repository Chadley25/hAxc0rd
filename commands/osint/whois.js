module.exports = {
    name: "whois",
    category: "osint",
    run: async (client, message, args) => {
        const { exec } = require('child_process');
        const Discord = require('discord.js');
        const arguments = message.toString().slice((message.content).substr(0,message.content.indexOf(' ')).length + 1);
        
        if (args[0] == "help" || !args[0]) {
            // displays information about whois in a message embed
            const helpEmbed = new Discord.MessageEmbed()
                .setColor('#f01d0e')
                .setTitle('WHOIS - Help')
                .addField('Description', "WHOIS is a query and response protocol that is widely used for querying databases that store the registered users or assignees of an Internet resource, such as a domain name, an IP address block or an autonomous system, but is also used for a wider range of other information.")
                .addField('Arguments', "[domain] ~ specifies the domain name to lookup\n[-H] ~ hides legal disclaimers\n[-I] ~ first query whois.iana.org and then follow its referral")
                .addField('Examples', 'whois -H microsoft.com\nwhois samsung.com\nwhois -H -I apple.com')
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