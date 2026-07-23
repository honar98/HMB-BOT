(async () => {
require("dotenv").config();

const fs = require("fs");
const path = require("path");

const {
  Client,
  Collection,
  GatewayIntentBits,
  ChannelType,
  PermissionFlagsBits,
} = require("discord.js");

const { GiveawaysManager } = require("discord-giveaways");
const { Player } = require("discord-player");
const { DefaultExtractors } = require("@discord-player/extractor");
const play = require("play-dl");

const spamUsers = new Map();

const client = new Client({
intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildEmojisAndStickers,
],
});

const player = new Player(client);

client.player = player;
await player.extractors.loadMulti(DefaultExtractors);

player.events.on("error", console.error);
player.events.on("playerError", console.error);

play.setToken({
  youtube: {
    cookie: process.env.YOUTUBE_COOKIE || "",
  },
});

const PREFIX = "$";
client.commands = new Collection();

client.giveawaysManager = new GiveawaysManager(client, {
  storage: "./giveaways.json",
  default: {
    botsCanWin: false,
    embedColor: "#FFD700",
    reaction: "🎉"
  }
});

const commandsPath = path.join(__dirname, "commands");

if (fs.existsSync(commandsPath)) {
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter(file => file.endsWith(".js"));

  for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    client.commands.set(command.name, command);
  }
}

client.once("clientReady", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (!message.inGuild()) return;

  // Anti-Spam
  try {
    const config = JSON.parse(fs.readFileSync("./antispam.json"));

    if (config.enabled) {
      const now = Date.now();
      const userId = message.author.id;

      if (!spamUsers.has(userId)) {
        spamUsers.set(userId, []);
      }

      const messages = spamUsers.get(userId);
      messages.push(now);

      const recent = messages.filter(time => now - time < 5000);
      spamUsers.set(userId, recent);

      if (recent.length >= 5) {
        await message.delete().catch(() => {});
        return message.channel.send(`⚠️ ${message.author} سپام مەکە.`);
      }
    }
  } catch (err) {
    console.error(err);
  }

if (!message.content.startsWith(PREFIX)) return;

  const args = message.content
    .slice(PREFIX.length)
    .trim()
    .split(/ +/);

  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);

  if (!command) return;

  try {
    await command.execute(message, args);
  } catch (error) {
    console.error(error);
message.channel.send("❌ An error occurred while executing this command.");
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;

  if (interaction.customId === "create_ticket") {
    try {
      const channel = await interaction.guild.channels.create({
        name: `ticket-${interaction.user.username}`,
        type: ChannelType.GuildText,
        permissionOverwrites: [
          {
            id: interaction.guild.id,
            deny: [PermissionFlagsBits.ViewChannel],
          },
          {
            id: interaction.user.id,
            allow: [
              PermissionFlagsBits.ViewChannel,
              PermissionFlagsBits.SendMessages,
              PermissionFlagsBits.ReadMessageHistory,
            ],
          },
        ],
      });

      await channel.send(
        `🎫 Welcome ${interaction.user}!\nPlease describe your problem.`
      );

      await interaction.reply({
        content: `✅ Your ticket has been created: ${channel}`,
        ephemeral: true,
      });
    } catch (error) {
      console.error(error);

      if (!interaction.replied) {
        await interaction.reply({
          content: "❌ Failed to create the ticket.",
          ephemeral: true,
        });
      }
    }
  }
});

require("./welcome")(client);
require("./welcomeCard")(client);
require("./autorole")(client);

// Events
require("./events/messageCreate")(client);
require("./events/logs")(client);


client.login(process.env.TOKEN);
})();
