module.exports = {
    name: "hackerman",
    category: "other",
    description: "",
    run: async (client, message, args) => {
        // displays funny "hacker" GIF to the user
        message.reply("https://i.imgur.com/eSqpwUX.gif");
    }
}