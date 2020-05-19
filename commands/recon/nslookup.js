module.exports = {
    name: "nslookup",
    category: "recon",
    description: "",
    run: async (client, message, args) => {
        const { exec } = require('child_process');
        const Discord = require('discord.js');
        let arguments = message.toString().slice((message.content).substr(0,message.content.indexOf(' ')).length + 1);

        if (args[0] == "help" || !args[0]) {
            // displays information about the tool being used
            const richembed = new Discord.RichEmbed()
                .setColor('#f01d0e')
                .setTitle('Nslookup - Help')
                .addField('Description', "nslookup is a network administration command-line tool available in many computer operating systems for querying the Domain Name System (DNS) to obtain domain name or IP address mapping, or other DNS records.")
                .addField('Arguments', "None")
                .addField('More Information', 'https://linux.die.net/man/1/nslookup')
            message.channel.send(richembed);
        } else {
            // executes the "nslookup" commands on the local system that the bot is hosted on
            // along with any arguments entered using the child_process API
            exec(`nslookup ${arguments}`, (error, stdout, stderr) => {
                if (error) {
                    message.channel.send(`**An error has occured:** ${error.message}`)
                    return;
                } else if (stderr) {
                    message.channel.send(`**An error has occured:** ${stderr}`);
                    return;
                // if message exceeds Discord's character limit, split the message into multiple ones
                } else if (stdout.length > 2000) {
                    let command = client.commands.get("seperateMessage");
                    command.run(message, stdout);
                } else {
                    message.channel.send(`${stdout}`);
                }
            });
        }
    }
}