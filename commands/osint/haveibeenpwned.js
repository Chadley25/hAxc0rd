module.exports = {
    name: "haveibeenpwned",
    category: "osint",
    description: "Looks through the haveibeenpwned API and returns if a company has been pwned before",
    run: async (client, message, args) => {
        const axios = require('axios');
        const striptags = require('striptags');
        const Discord = require('discord.js');
        const sha1 = require('sha1');

        if (args[0] == "password") {
            message.delete();
            try {
                let passwordHashed = sha1(args[1]);
                let link = "https://api.pwnedpasswords.com/range/" + passwordHashed.substring(0,5);
                // sends a get request to the haveibeenpwned API with a hash of the password entered
                // to see if it's been compromised and is in their database. if it has, it returns
                // how many times it's been compromised.
                axios.get(link)
                    .then(function (response) {
                        let compromised = false;
                        let arr = response.data.split(/\r?\n/);
                        arr.forEach((line)=> {
                            if (line.includes(passwordHashed.substring(5).toUpperCase())) {
                                message.reply(`the password you entered has been compromised ${line.substring(36)} times.`)
                                compromised = true;
                            }
                        });
                        if (compromised == false) {
                            message.reply("the password you entered seems to not have been compromised from the database of breaches on the haveibeenpwned website.");
                        }
                    })
                    .catch(function (error) {
                        message.channel.send(`**An error has occured:** ${error.message}`);
                    })
            } catch (err) {
                message.channel.send("An error has occured: *" + err.message + "*")
            }
        } else if (args[0] == "company") {
            let company = args[1];
            let link = "https://haveibeenpwned.com/api/v3/breach/" + company;
            // sends a get request to the haveibeenpwned API and parses through
            // the json file returned to display info about a company that
            // was compromised and is in the haveibeenpwned database
            axios.get(link)
                .then(function (response) {
                    try {
                        const richembed = new Discord.RichEmbed()
                            .setColor('#00ffc8')
                            .setTitle('haveibeenpwned - ' + response.data.Name)
                            .addField('Domain', response.data.Domain)
                            .addField('Breach Date', response.data.BreachDate)
                            .addField('Pwn Count', response.data.PwnCount)
                            .addField('Description', striptags(response.data.Description))
                        message.channel.send(richembed);
                    } catch (err) {
                        message.channel.send(`**An error has occured:** ${err.message}\n*This is most likely due to the company name not being in the haveibeenpwned database.*\n*If you wish to see all companies that are in the haveibeenpwned database, please visit <https://haveibeenpwned.com/PwnedWebsites>.*`)
                    }
                })
                .catch(function (err) {
                    message.channel.send(`**An error has occured:** ${err.message}\n*This is most likely due to the company name not being in the haveibeenpwned database.*\n*If you wish to see all companies that are in the haveibeenpwned database, please visit <https://haveibeenpwned.com/PwnedWebsites>.*`)
                })
        } else {
            // displays help the the user including a description of the tool and arugments that could be used
            const richembed = new Discord.RichEmbed()
                .setColor('#f01d0e')
                .setTitle('haveibeenpwned - Help')
                .addField('Description', 'Have I Been Pwned? is a website that allows people to check whether their personal data has been compromised by data breaches.')
                .addField('Arguments', "password {password}\ncompany {company name}")
                .addField('More Information', 'https://haveibeenpwned.com/')
            message.channel.send(richembed);
        }
    }
}