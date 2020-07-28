module.exports = {
    name: "haveibeenpwned",
    category: "osint",
    run: async (client, message, args) => {
        const axios = require('axios');
        const striptags = require('striptags');
        const Discord = require('discord.js');
        const sha1 = require('sha1');

        if (args[0] == "password") {
            // deletes the message from the user just in case they put a real password of theirs
            message.delete();
            try {
                // hashes the password provided using SHA1
                const passwordHashed = sha1(args[1]);
                const link = "https://api.pwnedpasswords.com/range/" + passwordHashed.substring(0,5);
                // sends a get request to the haveibeenpwned API with the given link, finding out how many times a password has been breached
                axios.get(link)
                    .then(function (response) {
                        let compromised = false;
                        const arr = response.data.split(/\r?\n/);
                        // loops through each line of data returned and searches for the password hash of the password entered
                        arr.forEach((line)=> {
                            if (line.includes(passwordHashed.substring(5).toUpperCase())) {
                                message.reply(`the password you entered has been compromised ${line.substring(36)} times.`);
                                compromised = true;
                            }
                        });
                        if (compromised == false) {
                            message.reply("the password you entered is not in the database of passwords breaches on the haveibeenpwned website.");
                        }
                    })
                    .catch(function (error) {
                        message.channel.send(`**An error has occured:** ${error.message}`);
                    })
            } catch (err) {
                message.channel.send("An error has occured: *" + err.message + "*")
            }
        } else if (args[0] == "company") {
            const link = "https://haveibeenpwned.com/api/v3/breach/" + args[1];
            // sends a get request to the haveibeenpwned API with the given link, finding out information about a breach for a certain company
            axios.get(link)
                .then(function (response) {
                    try {
                        const haveibeenpwnedDataEmbed = new Discord.MessageEmbed()
                            .setColor('#00ffc8')
                            .setTitle('haveibeenpwned - ' + response.data.Name)
                            .addField('Domain', response.data.Domain)
                            .addField('Breach Date', response.data.BreachDate)
                            .addField('Pwn Count', response.data.PwnCount)
                            .addField('Description', striptags(response.data.Description))
                        message.channel.send(haveibeenpwnedDataEmbed);
                    } catch (err) {
                        message.channel.send(`**An error has occured:** ${err.message}\n*This is most likely due to the company name not being in the haveibeenpwned database.*\n*If you wish to see all companies that are in the haveibeenpwned database, please visit <https://haveibeenpwned.com/PwnedWebsites>.*`);
                    }
                })
                .catch(function (err) {
                    message.channel.send(`**An error has occured:** ${err.message}\n*This is most likely due to the company name not being in the haveibeenpwned database.*\n*If you wish to see all companies that are in the haveibeenpwned database, please visit <https://haveibeenpwned.com/PwnedWebsites>.*`);
                })
        } else {
            // displays information about the haveibeenpwned API
            const helpEmbed = new Discord.MessageEmbed()
                .setColor('#f01d0e')
                .setTitle('haveibeenpwned - Help')
                .addField('Description', 'Have I Been Pwned? is a website that allows people to check whether their personal data has been compromised by data breaches.');
                .addField('Arguments', "password {password}\ncompany {company name}")
                .addField('More Information', 'https://haveibeenpwned.com/')
            message.channel.send(helpEmbed);
        }
    }
}