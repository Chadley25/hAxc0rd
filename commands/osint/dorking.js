module.exports = {
    name: "dorking",
    category: "osint",
    run: async (client, message, args) => {
        const Discord = require('discord.js');
        
        if (args[0] == "help" || !args[0]) {
            // displays information about google dorking in a message embed
            const helpEmbed = new Discord.MessageEmbed()
                .setColor('#f01d0e')
                .setTitle('Google Dorking - Help')
                .addField('Description', "Google dorking, also referred to as Google Hacking, is a technique that uses Google Search and other Google apps to find security holes in the configuration and computer code that websites use.")
                .addField('Arguments', "[Search Query] ~ specifies the query for Google to search")
                .addField('Examples (Google Hacking Database)', "https://www.exploit-db.com/google-hacking-database")
                .addField('More Information', 'https://en.wikipedia.org/wiki/Google_hacking')    
            message.channel.send(helpEmbed);
        } else {
            const puppeteer = require('puppeteer');
            const filePath = 'files/' + message.author.tag + '.pdf';

            // loads the webpage specified from a search query and saves it as a PDF
            try {
                (async () => {
                    const browser = await puppeteer.launch();
                    const page = await browser.newPage();
                    await page.goto('https://www.google.com');
                    await page.type('input.gLFyf.gsfi', 'test');
                    await page.keyboard.press('Enter');
                    await page.waitFor(1000);
                    await page.pdf({path: filePath, format: 'A4'});
                    await browser.close();
                    message.reply("here's your result.", { files: [filePath] });
                })();
            } catch (err) {
                message.channel.send(`**An error has occured:** ${err}`);
            }
        }
    }
}