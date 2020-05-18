module.exports = {
    name: "ping",
    category: "info",
    description: "Test command to see if the bot's up and running",
    run: async (client, message, args) => {
        var ping = Date.now() - message.createdTimestamp;
        message.channel.send("Pong! Your ping is " + ping + " ms.")
    }
}