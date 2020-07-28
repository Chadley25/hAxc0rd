module.exports = {
    name: "nmap",
    category: "recon",
    run: async (client, message, args) => {
        const { exec } = require("child_process");
        const Discord = require('discord.js');
        const arguments = message.toString().slice((message.content).substr(0,message.content.indexOf(' ')).length + 1);
        
        if (args[0] == "help" || !args[0]) {
            // displays information about nmap in a message embed
            const helpEmbed = new Discord.MessageEmbed()
                .setColor('#f01d0e')
                .setTitle('Nmap - Help')
                .addField('Description', "Nmap (Network Mapper) is a free and open-source network scanner created by Gordon Lyon (also known by his pseudonym Fyodor Vaskovich). Nmap is used to discover hosts and services on a computer network by sending packets and analyzing the responses.")
                .addField('Arguments', "[-iL input_filename] ~ input from a list of hosts/networks\n[-Pn] ~ treat all hosts as online -- skip host discovery\n[-p port_ranges] ~ only scan specified ports\n[-sV] ~ probe open ports to determine services/version info\n[-sC] ~ runs scrips equivalent to --script=default\n[-O] ~ enable OS detection\n[-T 0-5] ~ set timing tempalte - higher is quicker, but less accurate\n[-oA filename] ~ output results into three of the major formats\n[-6] ~ enable Ipv6 scanning")
                .addField('More Information', 'https://linux.die.net/man/1/nmap')
            message.channel.send(helpEmbed);
        } else {
            message.channel.send("Nmap scan started...");
            // executes the "nmap" command locally and displays the output
            exec(`nmap ${arguments}`, (error, stdout, stderr) => {
                if (error) {
                    message.channel.send(`**An error has occured:** ${error.message}`);
                    return;
                } else if (stderr) {
                    message.channel.send(`**An error has occured:** ${stderr}`);
                    return;
                } else {
                    // gets rid of all links
                    stdout = stdout.replace(/(?:https):\/\/[\n\S]+/g, '');
                    // if message exceeds Discord's character limit, split the message into multiple ones
                    if (stdout.length > 2000) {
                        const sepMsgCmd = client.commands.get("seperateMessage");
                        sepMsgCmd.run(message, stdout);
                    } else {
                        message.channel.send(stdout);
                    }
                }
            });
        }
    }
}