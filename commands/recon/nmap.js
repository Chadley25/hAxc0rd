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
                .addField('Description', "Nmap (Network Mapper) is a free and open-source network scanner created by Gordon Lyon. It's is used to discover hosts and services on a computer network by sending packets and analyzing the responses.")
                .addField('Arguments', "[-Pn] ~ scans the targets regardless if it responds to ping or not\n[-vv] ~ increases the verbosity level, adding extra information\n[-A] ~ enables OS detection, version detection, script scanning, and traceroute\n[-T<0-5>] ~ sets the timing template (higher is faster)\n[-sS] ~ does a stealth scan\n[--script vuln] ~ runs scripts agains the target to look for vulnerabilities\n[target_IP_Address] ~ specifies the target to scan")
                .addField('Examples', 'nmap -Pn -A -T4 scanme.nmap.org\nnmap -sS -Pn -T1 scanme.nmap.org\nnmap --script vuln -T4 scanme.nmap.org')
                .addField('More Information', 'https://en.wikipedia.org/wiki/Nmap')
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