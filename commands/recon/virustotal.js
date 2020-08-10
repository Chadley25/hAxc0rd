module.exports = {
    name: "virustotal",
    category: "recon",
    run: async (client, message, args) => {
        const Discord = require('discord.js');
        const request = require('request');
        const fs = require('fs');
        const axios = require('axios');
        const { exec } = require("child_process");

        // downloads a file based on the URI provided
        var download = (uri, filename, callback) => {
            request.head(uri, () => {
                request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
            });
        };
        // validates that the string provided is a valid URL
        function validURL(str) {
            var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol check
              '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
              '((\\d{1,3}\\.){3}\\d{1,3}))'+ // or IPv4 address check
              '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port & path check
              '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query check
              '(\\#[-a-z\\d_]*)?$','i'); // fragment locator check
            return !!pattern.test(str);
        }

        if (args[0] == "url") { // uses VirusTotal to scan the provided URL to see if it's malicious, then displays the results
            if (args[1] && validURL(args[1])) {
                const link = `https://www.virustotal.com/vtapi/v2/url/report?apikey=${process.env.VIRUSTOTAL}&resource=${args[1]}`;
                virusTotalURLCheck(link, args[1]);
            } else {
                message.channel.send(`**An error has occured:** The URL provided is not valid.`);
            }
        } else if (args[0] == "file") { // uses VirusTotal to scan the provided file to see if it's malicious, then displays the results
            // checks to see if the message contains an attachment
            if (message.attachments.first()) {
                filename = "files/file-" + message.author.username;
                // downloads the first file that's attached to the message
                download(message.attachments.first().url, `${filename}`, () => {
                    // sends a post request to the VirusTotal API with the provided file
                    exec(`curl --request POST --url 'https://www.virustotal.com/vtapi/v2/file/scan' --form 'apikey=${process.env.VIRUSTOTAL}' --form 'file=@${filename}'`, (error, stdout, stderr) => {
                        if (error) {
                            message.channel.send(`**An error has occured:** ${error.message}`);
                            return;
                        } else {
                            // deletes the file provided
                            fs.unlinkSync(filename);
                            let parsedData = JSON.parse(stdout);
                            message.reply("the file you provided has successfully been uploaded and put in the queue to be scanned.\nThis shouldn't take too if the file you provided is small, though, nevertheless, you will be notified when it's complete. If you want manually check on its status, below are two ways to do so through the VirusTotal website.\nScan ID: `" + parsedData.scan_id + "`\nSHA-256 Hash: `" + parsedData.sha256 + "`");                
                            iterations = 0;
                            // loops every 20 seconds to check if the file has yet to be scanned by VirusTotal
                            var interval = setInterval(() => {
                                if (iterations >= 25) {
                                    message.reply(`the file you uploaded at ${message.createdAt} has not gone through the queue yet after 8 minutes. Due to this, you will no longer be notified when the file provided is finished scanning. So, please check this manually through the options you were given when you first used thsi tool.`);
                                    clearInterval(interval);
                                }
                                const parsedData = JSON.parse(stdout);
                                // sends get request to the VirusTotal API to check if the file has been scanned yet
                                axios.get(`https://www.virustotal.com/vtapi/v2/file/report?apikey=${process.env.VIRUSTOTAL}&resource=${parsedData.scan_id}`)
                                    .then((response) => {
                                        // if file scanned and results are returned...
                                        if (response.data.response_code == 1) {
                                            message.reply(`the file you uploaded at ${message.createdAt} has been scanned. The results for it are listed below.`);
                                            virusTotalURLCheck(`https://www.virustotal.com/vtapi/v2/file/report?apikey=${process.env.VIRUSTOTAL}&resource=${parsedData.scan_id}`, "File Upload");
                                            clearInterval(interval);
                                        }
                                    })
                                    .catch((error) => {
                                        message.channel.send(`**An error has occured:** ${error.message}`);
                                    })
                            }, 20000);
                        }
                    });
                })
            } else {
                message.channel.send(`**An error has occured:** There is no file attached to this message.`);
            }
        } else {
            // displays information about the VirusTotal API
            const helpEmbed = new Discord.MessageEmbed()
                .setColor('#f01d0e')
                .setTitle('VirusTotal - Help')
                .addField('Description', 'VirusTotal is an online service that analyzes files and URLs, enabling the detection of viruses, worms, trojans and other kinds of malicious content using antivirus engines and website scanners.')
                .addField('Arguments', "[url website_URL] ~ scans the specified website URL through antivirus engines\n[file {file attached to this message}] ~ scans the uploaded file through antivirus engines")
                .addField('Example', 'virustotal url www.apple.com')
                .addField('More Information', 'https://www.virustotal.com/gui/home')
            message.channel.send(helpEmbed);
        }
                
        function virusTotalURLCheck(link, title) {
            // sends a get request to the VirusTotal API with the given link
            axios.get(link)
                .then((res) => {
                    var clean = "";
                    var malware= "";
                    // parses through the data returned and appends the antivirus names to one of
                    // two strings, depending on if the result from it was positive or negative
                    for (var i in res.data.scans) {
                        let result = res.data.scans[i].detected;
                        if (result == true) {
                            malware = malware + i + ", ";
                        } else {
                            clean = clean + i + ", ";
                        }
                    }
                    try {
                        // displays results to the user in a message embed
                        const virusTotalResultEmbed = new Discord.MessageEmbed()
                            .setColor('#00ffc8')
                            .setTitle('Virus Total - ' + title)
                            if (res.data.positives > 0) {
                                virusTotalResultEmbed.setDescription(`There are/is ${res.data.positives} positive result(s) for this content.`)
                            }                            
                            if (malware.length > 0) {
                                virusTotalResultEmbed.addField("Positive Results From", `${malware.substring(0, malware.length - 2)}`);
                            } else {
                                virusTotalResultEmbed.addField("There were no positive results.", ".");
                            }
                            if (clean.length > 1024) {
                                virusTotalResultEmbed.addField("Negative Results From", `.${clean.substring(0, 1000)}`);
                                virusTotalResultEmbed.addField("Cont.", `.${clean.substring(1000, clean.length - 2)}`);
                            } else {
                                if (clean.length > 0) {
                                    virusTotalResultEmbed.addField("Negative Results From", `.${clean.substring(0, clean.length - 2)}`)
                                } else {
                                    virusTotalResultEmbed.addField("There were no negative results.", ".");
                                }
                            }
                            
                        message.channel.send(virusTotalResultEmbed);
                    } catch (err) {
                        message.channel.send(`**An error has occured:** ${err.message}`);
                    }
                })
                .catch((error) => {
                    message.channel.send(`**An error has occured:** ${error.message}`);
                })
        }
    }
}