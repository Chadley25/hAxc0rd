module.exports = {
    name: "seperateMessage",
    category: "global",
    aliases: "",
    description: "",
    run: async (message, stdout) => {
        let numOfChars = Math.ceil((stdout.length / 2000));
        for (i = 1; i < numOfChars + 1; i++) {
            let num2 = i * 2000;
            let num1 = num2 - 2000;
            if (i == numOfChars) {
                num2 = stdout.length;
            }
            message.channel.send(`${stdout.substring(num1,num2)}`);
        }
    }
}