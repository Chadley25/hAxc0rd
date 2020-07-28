module.exports = {
    name: "seperateMessage",
    category: "global",
    aliases: "",
    description: "",
    run: async (message, stdout) => {
        // seperates the string into 2000 character messages
        // to be compliant with Discord's 2000 character limit
        const numOfChars = Math.ceil((stdout.length / 2000));
        for (i = 1; i < numOfChars + 1; i++) {
            const num2 = i * 2000;
            const num1 = num2 - 2000;
            if (i == numOfChars) {
                num2 = stdout.length;
            }
            message.channel.send(`${stdout.substring(num1,num2)}`);
        }
    }
}