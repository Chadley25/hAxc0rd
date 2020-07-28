module.exports = {
    name: "nslookup",
    category: "recon",
    run: async (client, message, args) => {
        const { exec } = require('child_process');
        const Discord = require('discord.js');
        const arguments = message.toString().slice((message.content).substr(0,message.content.indexOf(' ')).length + 1);

        if (args[0] == "help" || !args[0]) {
            // displays information about nslookup in a message embed
            const helpEmbed = new Discord.MessageEmbed()
                .setColor('#f01d0e')
                .setTitle('Nslookup - Help')
                .addField('Description', "Nslookup is a network administration command-line tool available in many computer operating systems for querying the Domain Name System (DNS) to obtain domain name or IP address mapping, or other DNS records.")
                .addField('Arguments', "None")
                .addField('More Information', 'https://linux.die.net/man/1/nslookup')
            message.channel.send(helpEmbed);
        } else {
            // executes the "nslookup" command locally and displays the output
            exec(`nslookup ${arguments}`, (error, stdout, stderr) => {
                if (error) {
                    message.channel.send(`**An error has occured:** ${error.message}`);
                    return;
                } else if (stderr) {
                    message.channel.send(`**An error has occured:** ${stderr}`);
                    return;
                // if message exceeds Discord's character limit, split the message into multiple ones
                } else if (stdout.length > 2000) {
                    const sepMsgCmd = client.commands.get("seperateMessage");
                    sepMsgCmd.run(message, stdout);
                } else {
                    message.channel.send(stdout);
                }
            });
        }
    }
}