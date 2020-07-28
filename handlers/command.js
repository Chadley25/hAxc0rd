const { readdirSync } = require("fs");
const ascii = require("ascii-table");

// defines a new table for displaying if commands loaded correctly or not
let table = new ascii("Commands");
table.setHeading("Command", "Load Status");

module.exports = (client) => {
    // reads each file in the "commands/" directory
    readdirSync("./commands/").forEach(dir => {
        // filters out all files that aren't a .js filetype
        const commands = readdirSync(`./commands/${dir}/`).filter(file => file.endsWith(".js"));
    
        for (let file of commands) {
            let pull = require(`../commands/${dir}/${file}`);
            
            // checks if there's a name for the command found
            if (pull.name) {
                client.commands.set(pull.name, pull);
                table.addRow(file, `✅`);
            } else {
                table.addRow(file, `❌`);
                continue;
            }
            // checks for aliases
            if (pull.aliases && Array.isArray(pull.aliases)) pull.aliases.forEach(alias => client.aliases.set(alias, pull.name));
        }
    });
    console.log(table.toString());
}

/*
basic layout:
module.exports = {
    name: "command name",
    aliases: ["alias1", "alias2", "alias3"],
    category: "category name",
    description: "command description",
    usage: "usage of the command",
    run: (client, message, args) => {
        code for the command here
    }
  }
}
*/