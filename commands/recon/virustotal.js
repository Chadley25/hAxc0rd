module.exports = {
    name: "virustotal",
    category: "recon",
    description: "",
    run: async (client, message, args) => {
        const Discord = require('discord.js');
        const request = require('request');
        const fs = require('fs');
        const { exec } = require("child_process");
        const axios = require('axios');

        // downloads the file from the filename given
        var download = function(uri, filename, callback) {
            request.head(uri, function() {
                request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
            });
        };

        if (args[0] == "url") {
            if (args[1] && args[1].includes(".")) {
                let link = `https://www.virustotal.com/vtapi/v2/url/report?apikey=${process.env.VIRUSTOTAL}&resource=${args[1]}`;
                virusTotalURLCheck(link, args[1]);
            } else {
                message.channel.send(`**An error has occured:** The URL given is not valid.`)
            }
        } else if (args[0] == "file") {
            // checks to see if the message contains an attachment
            if(message.attachments.first()) {
                filename = "files/file-" + message.author.username;
                // downloads the first file that's attached to the message
                download(message.attachments.first().url, `${filename}`, function() {
                    // sends a post request to the VirusTotal API and parses through and returns the scanID and hash of the file
                    exec(`curl --request POST --url 'https://www.virustotal.com/vtapi/v2/file/scan' --form 'apikey=${process.env.VIRUSTOTAL}' --form 'file=@${filename}'`, (error, stdout, stderr) => {
                        if (error) {
                            message.channel.send(`**An error has occured:** ${error.message}`)
                            return;
                        } else {
                            let parsedData = JSON.parse(stdout);
                            message.reply("the file you provided has successfully been uploaded and put in the queue to be scanned.\nThis shouldn't take too long as long as the file you uploaded is small, though, nevertheless, I will notify you when it's complete.\nHowever, if you'd like to, you can manually check the scan using either the scan ID or the SHA-256 hash provided below.\nScan ID: `" + parsedData.scan_id + "`\nSHA-256 Hash: `" + parsedData.sha256 + "`")
                            iterations = 0;
                            // sets an interval to loop every 20 seconds to check if the file given has gone through the queue
                            var interval = setInterval(function() {
                                if (iterations >= 25) {
                                    message.reply(`the file you uploaded at ${message.createdAt} has not gone through the queue yet. Due to this, the bot will no longer notify you when your file is scanned; you can check this manually through <https://www.virustotal.com/gui/home/search>`);
                                    clearInterval(interval);
                                }
                                // sends get request to the VT API and parses through the data results
                                axios.get(`https://www.virustotal.com/vtapi/v2/file/report?apikey=${process.env.VIRUSTOTAL}&resource=${parsedData.scan_id}`)
                                    .then(function (response) {
                                        // checks to see if there is any data through the response code
                                        if (response.data.response_code == 1) {
                                            // if file was scanned, displays all information on it to the user
                                            message.reply(`the file you uploaded at ${message.createdAt} has been scanned. Your data results are listed below:`);
                                            virusTotalURLCheck(`https://www.virustotal.com/vtapi/v2/file/report?apikey=${process.env.VIRUSTOTAL}&resource=${parsedData.scan_id}`, "File Upload");
                                            clearInterval(interval);
                                        }
                                    })
                                    .catch(function (error) {
                                        console.log(`**An error has occured:** ${error.message}`);
                                    })
                            }, 20000);
                        }
                    });
                })
                setTimeout(deleteFile, 10000);
            } else {
                message.channel.send("An error has occured. This may be due to no file being attached to this message.");
            }
        } else {
            // displays information about the API being used
            const richembed = new Discord.RichEmbed()
                .setColor('#f01d0e')
                .setTitle('VirusTotal - Help')
                .addField('Description', 'VirusTotal is an online service that analyzes files and URLs enabling the detection of viruses, worms, trojans and other kinds of malicious content using antivirus engines and website scanners.')
                .addField('Arguments', "url {a website URL}\n file {the file uploaded along with the message}")
                .addField('More Information', 'https://www.virustotal.com/gui/home')
            message.channel.send(richembed);
        }
        
        // deletes a file
        function deleteFile() {
            fs.unlinkSync(filename)
        }
        function virusTotalURLCheck(link, title) {
            // sends a get request to the VirusTotal API and parses through the data
            // returned to see if any antivirus scans came back as positive
            axios.get(link)
                .then(function (response) {
                    let cleanDetect = "";
                    let malwareDetect = "";
                    // loops through all scans and adds the scan name to either an
                    // array of clean or positive scans
                    for (var i in response.data.scans) {
                        var result = response.data.scans[i].detected;
                        if (result == true) {
                            malwareDetect = malwareDetect + i + ", ";
                        } else {
                            cleanDetect = cleanDetect + i + ", ";
                        }
                    }
                    try {
                        const richembed = new Discord.RichEmbed()
                            .setColor('#00ffc8')
                            .setTitle('Virus Total - ' + title)
                            .setDescription(`There were ${response.data.positives} positive results for this content.`)
                            .addBlankField()
                            .addField("Positive Results From", "." + malwareDetect.substring(0, malwareDetect.length - 2))
                            .addField("Negative Results From", "." + cleanDetect.substring(0, cleanDetect.length - 2))
                        message.channel.send(richembed);
                    } catch (err) {
                        message.channel.send(`**An error has occured:** ${err.message}`)
                    }
                })
                .catch(function (error) {
                    console.log(`**An error has occured:** ${error.message}`);
                })
        }
    }
}