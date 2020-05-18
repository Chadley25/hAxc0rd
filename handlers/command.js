const { readdirSync } = require("fs");
const ascii = require("ascii-table");

// creates a new Ascii table object & sets a heading
let table = new ascii("Commands");
table.setHeading("Command", "Load Status");

module.exports = (client) => {
    // for each commands in /commands direcotry...
    readdirSync("./commands/").forEach(dir => {
        // filters so there are only files with a .js file extension
        const commands = readdirSync(`./commands/${dir}/`).filter(file => file.endsWith(".js"));
    
        // loads every file from the commands folder
        for (let file of commands) {
            let pull = require(`../commands/${dir}/${file}`);
            
            // checks if there's a name for the module for the command
            if (pull.name) {
                client.commands.set(pull.name, pull);
                table.addRow(file, `✅`);
            } else {
                table.addRow(file, `❌`);
                continue;
            }
    
            // checks if there's an alias and if it's an array
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