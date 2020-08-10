module.exports = {
    name: "dig",
    category: "recon",
    run: async (client, message, args) => {
        const { exec } = require('child_process');
        const Discord = require('discord.js');
        const arguments = message.toString().slice((message.content).substr(0,message.content.indexOf(' ')).length + 1);
        
        if (args[0] == "help" || !args[0]) {
            // displays information about dig in a message embed
            const helpEmbed = new Discord.MessageEmbed()
                .setColor('#f01d0e')
                .setTitle('Dig - Help')
                .addField('Description', "dig is a utility that performs DNS lookups and displays the answers that are returned from the name server(s) that were queried. This is often used to troubleshoot DNS problems, but can be used for many more scenarios.")
                .addField('Arguments', "[server] ~ specifies the server to lookup\n[-p port#] ~  specifies the port to be queried; by default, this is port 53 (DNS)\n[-4/-6] ~ forces dig to use only IPv4 or IPv6 query transport")
                .addField('Examples', 'dig chadley25.github.io\ndig -4 samsung.com')
                .addField('More Information', 'https://en.wikipedia.org/wiki/Dig_(command)')    
            message.channel.send(helpEmbed);
        } else {
            // executes the "dig" command locally and displays the output
            exec(`dig ${arguments}`, (error, stdout, stderr) => {
                if (error) {
                    message.channel.send(`**An error has occured:** ${error.message}`);
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