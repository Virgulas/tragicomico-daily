const fs = require("node:fs");
const { Client, Collection, Intents } = require("discord.js");
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const { token, channelIds } = require("./config.json");

//To see this bot running, you need a config.json with the bot token, clientId, guildId and the required channelId's.

client.commands = new Collection();

const commandFiles = fs.readdirSync("./commands").filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    // Set a new item in the Collection
    // With the key as the command name and the value as the exported module
    client.commands.set(command.data.name, command);
}

//Tells if the bot is on.

client.on("ready", async () => {
    console.log("on");
});

//Allows only links and attachments in the specified channel.

client.on("messageCreate", async (msg) => {
    if (msg.channelId == channelIds["index"]) {
        let rg = /(http|https|ftp|ftps)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?/;
        if (!msg.attachments.firstKey() && !msg.content.match(rg)) {
            setTimeout(() => msg.delete(), 1000);
        }
    }
});

//Commands interaction interface. It reads every interaction and if the interaction is listed, It executes

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: "There was an error while executing this command!",
            ephemeral: true,
        });
    }
});

client.login(token);
