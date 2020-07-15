module.exports = {
    name: "dorking",
    category: "osint",
    description: "",
    run: async (client, message, args) => {
        const { exec } = require('child_process');
        const Discord = require('discord.js');
        let arguments = message.toString().slice((message.content).substr(0,message.content.indexOf(' ')).length + 1);
        
        if (args[0] == "help") {
            // displays information about the tool being used
            const richembed = new Discord.RichEmbed()
                .setColor('#f01d0e')
                .setTitle('Google Dorking - Help')
                .addField('Description', "Google dorking is a technique that uses Google Search and other Google apps to find security holes in the configuration and computer code that websites use.")
                .addField('Arguments', "[URL]")
                .addField('More Information', 'https://en.wikipedia.org/wiki/Google_hacking')    
            message.channel.send(richembed);
        } else {
            const puppeteer = require('puppeteer');
            let filePath = 'files/' + message.author.tag + '.pdf';

            (async () => {
              const browser = await puppeteer.launch();
              const page = await browser.newPage();
              await page.goto(args[0].toString());
              await page.pdf({path: filePath, format: 'A4'});  
              await browser.close();
              message.reply("here's your result.", { files: [filePath] });
            })();
        }
    }
}