module.exports = {
    name: "ping",
    category: "info",
    description: "Test command to see if the bot's up and running",
    run: async (client, message, args) => {
        // gets ping of the user based on the time the message was created
        // and the time the code below was ran
        var ping = Date.now() - message.createdTimestamp;
        message.channel.send("Pong! Your ping is " + ping + " ms.")
    }
}