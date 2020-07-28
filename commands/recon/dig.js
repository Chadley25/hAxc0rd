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
                .addField('Description', "dig is a flexible tool for interrogating DNS name servers. It performs DNS lookups and displays the answers that are returned from the name server(s) that were queried. Most DNS administrators use dig to troubleshoot DNS problems because of its flexibility, ease of use and clarity of output. Other lookup tools tend to have less functionality than dig.")
                .addField('Arguments', "[-b address] ~ sets the source IP address of the query to address\n[-c class] ~ overwrites the default query class\n[-f filename] ~ makes dig operate in batch mode by reading a list of lookup requests to process from the file specified\n[-m] ~ enables memory usage debugging\n[-p port#] ~  specifies the port to be queried; by default, this is port 53 (dns)\n[-4/-6] ~  forces dig to use only IPv4 or IPv6 query transport\n[-q name] ~ sets the query name to the one specified")
                .addField('More Information', 'https://linux.die.net/man/1/dig')    
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