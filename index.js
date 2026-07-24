require("dotenv").config();

const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// وێب سەوەر بۆ ڕەیلوەی تا بۆتەکە بە ئاگایی بمێنێتەوە
app.get("/", (req, res) => {
  res.send("HMB-BOT is active and running 24/7!");
});

app.listen(PORT, () => {
  console.log(`🌐 Express web server is listening on port ${PORT}`);
});

const fs = require("fs");
const path = require("path");

const {
  Client,
  Collection,
  GatewayIntentBits,
  ChannelType,
  PermissionFlagsBits,
  Events,
  REST,
  Routes
} = require("discord.js");

const { GiveawaysManager } = require("discord-giveaways");
const { Player } = require("discord-player");
const { DefaultExtractors } = require("@discord-player/extractor");

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

// دروستکردنی پلەیەر و بارکردنی ئێستراکتۆرەکان بە شێوەیەکی فەرمی و ڕاست
const player = new Player(client);
client.player = player;

(async () => {
  try {
    await player.extractors.loadMulti(DefaultExtractors);
    console.log("🎵 Music extractors loaded successfully!");
  } catch (e) {
    console.error("Error loading extractors:", e);
  }
})();

player.events.on("error", (error) => console.error("Player error:", error));
player.events.on("playerError", (error) => console.error("Player internal error:", error));

const PREFIX = "$";
client.commands = new Collection();
client.slashCommands = new Collection();
const slashCommandsArray = [];

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
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if (command.name && command.execute) {
      client.commands.set(command.name, command);
    }

    if (command.data && command.execute) {
      client.slashCommands.set(command.data.name, command);
      slashCommandsArray.push(command.data.toJSON());
    }
  }
}

client.once(Events.ClientReady, async (c) => {
  console.log(`✅ Logged in as ${c.user.tag}`);

  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

  try {
    console.log('Started refreshing application (/) commands.');
    await rest.put(
      Routes.applicationCommands(c.user.id),
      { body: slashCommandsArray },
    );
    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
});

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot || !message.inGuild()) return;

  try {
    if (fs.existsSync("./antispam.json")) {
      const config = JSON.parse(fs.readFileSync("./antispam.json", "utf8"));
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
    }
  } catch (err) {
    console.error("Anti-spam error:", err);
  }

  if (message.mentions.has(message.client.user)) {
    const query = message.content
      .replace(`<@!${message.client.user.id}>`, '')
      .replace(`<@${message.client.user.id}>`, '')
      .trim();

    if (query) {
      try {
        await message.channel.sendTyping();

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: query }]
            }]
          })
        });

        const data = await response.json();
        const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || "ببوورە، ناتوانم لەم پرسیارە تێبگەم.";

        await message.reply(replyText);
      } catch (error) {
        console.error("Gemini AI Error:", error);
        await message.reply("ببوورە، هەڵەیەک ڕوویدا لە پەیوەندیکردن بە زیرەکی دەستکردەوە.");
      }
      return;
    }
  }

  if (!message.content.startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);
  if (!command) return;

  try {
    await command.execute(message, args);
  } catch (error) {
    console.error(error);
    await message.channel.send("❌ هەڵەیەک ڕوویدا لە جێبەجێکردنی ئەم فەرمانە.").catch(() => {});
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isChatInputCommand()) {
    const command = client.slashCommands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: '❌ هەڵەیەک ڕوویدا لە جێبەجێکردنی ئەم فەرمانە.', ephemeral: true }).catch(() => {});
      } else {
        await interaction.reply({ content: '❌ هەڵەیەک ڕوویدا لە جێبەجێکردنی ئەم فەرمانە.', ephemeral: true }).catch(() => {});
      }
    }
  }
  else if (interaction.isButton() && interaction.customId === "create_ticket") {
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

      await channel.send(`🎫 بەخێر بێیت ${interaction.user}!\nتکایە کێشەکەت ڕوون بکەرەوە.`);

      await interaction.reply({
        content: `✅ تیکێتەکەت دروستکرا: ${channel}`,
        ephemeral: true,
      });
    } catch (error) {
      console.error(error);
      if (!interaction.replied) {
        await interaction.reply({
          content: "❌ نەتوانرا تیکێتەکە دروست بکرێت.",
          ephemeral: true,
        });
      }
    }
  }
});

const safeRequire = (filePath) => {
  try {
    if (fs.existsSync(filePath + ".js") || fs.existsSync(filePath)) {
      require(filePath)(client);
    }
  } catch (e) {
    console.log(`Module optional load skipped: ${filePath}`);
  }
};

safeRequire("./welcome");
safeRequire("./welcomeCard");
safeRequire("./autorole");
safeRequire("./events/logs");
safeRequire("./events/searchMenu");
safeRequire("./helpMenu");

client.login(process.env.TOKEN);
