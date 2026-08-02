require("dotenv").config();

const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

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
  Routes,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  EmbedBuilder
} = require("discord.js");

const { GiveawaysManager } = require("discord-giveaways");
const { Player } = require("discord-player");
const { DefaultExtractors } = require("@discord-player/extractor");

const spamTracker = new Map();

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

(async () => {
  try {
    await player.extractors.loadMulti(DefaultExtractors);
    console.log("🎵 Default Extractors loaded successfully!");
  } catch (e) {
    console.error("Error loading extractors:", e);
  }
})();

player.events.on("error", (queue, error) => console.error(`Player error: ${error.message}`));
player.events.on("playerError", (queue, error) => console.error(`Player internal error: ${error.message}`));

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
  if (message.author.bot) {
    if (message.client.user.id !== message.author.id && message.inGuild()) {
      try {
        await message.delete();
      } catch (e) {}
    }
    return;
  }

  if (!message.inGuild()) return;

  try {
    if (fs.existsSync("./antispam.json")) {
      const config = JSON.parse(fs.readFileSync("./antispam.json", "utf8"));
      if (config.enabled) {
        if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
          const now = Date.now();
          const userId = message.author.id;
          const channel = message.channel;

          if (!spamTracker.has(userId)) {
            spamTracker.set(userId, []);
          }

          const timestamps = spamTracker.get(userId);
          timestamps.push(now);

          const timeWindow = 7000;
          const recent = timestamps.filter(time => now - time < timeWindow);
          spamTracker.set(userId, recent);

          if (recent.length >= 5) {
            spamTracker.set(userId, []);

            const member = await message.guild.members.fetch(userId).catch(() => null);

            if (member && member.moderatable) {
              await member.timeout(5 * 60 * 1000, 'سپام کردن - ٥ پەیامی لەسەریەک').catch(() => {});
            }

            const fetched = await channel.messages.fetch({ limit: 30 }).catch(() => null);
            if (fetched) {
              const userMsgs = fetched.filter(m => m.author.id === userId);
              for (const [id, msg] of userMsgs) {
                await msg.delete().catch(() => {});
              }
            }

            const warningMsg = await channel.send({
              content: `⚠️ <@${userId}> **سپام قەدەغەیە!** ٥ پەیامت لەسەریەک نارد، سەرجەم پەیامەکانت سڕرانەوە و بۆ ماوەی **٥ خولەک** مێوتکرایت.`
            }).catch(() => {});

            if (warningMsg) {
              setTimeout(() => {
                warningMsg.delete().catch(() => {});
              }, 5000);
            }
            return;
          }
        }
      }
    }
  } catch (err) {
    console.error("Anti-spam error:", err);
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
  else if (interaction.isButton() && interaction.customId === "search_music") {
    const modal = new ModalBuilder()
      .setCustomId("musicSearchModal")
      .setTitle("گەڕانی گۆرانی");

    const songInput = new TextInputBuilder()
      .setCustomId("songQueryInput")
      .setLabel("ناوی گۆرانی یان لینکی یوتیوب/سپۆتیفای")
      .setStyle(TextInputStyle.Short)
      .setPlaceholder("Song name or link...")
      .setRequired(true);

    modal.addComponents(new ActionRowBuilder().addComponents(songInput));
    return await interaction.showModal(modal);
  }
  else if (interaction.isModalSubmit() && interaction.customId === "musicSearchModal") {
    const vc = interaction.member.voice.channel;
    if (!vc) {
      return interaction.reply({ content: "❌ تکایە سەرەتا بچۆ ناو کەناڵێکی دەنگییەوە.", ephemeral: true });
    }

    const query = interaction.fields.getTextInputValue("songQueryInput");
    try {
      await interaction.deferReply();
      const player = interaction.client.player;
      
      const res = await player.play(vc, query, {
        nodeOptions: { 
          metadata: interaction.channel, 
          leaveOnEmpty: false, 
          leaveOnEnd: false, 
          selfDeaf: true 
        }
      });

      const track = res.track || (res.playlist ? res.playlist.tracks[0] : null);

      const embed = new EmbedBuilder()
        .setColor('#1DB954')
        .setTitle('🎵 دەنگپەخشکرا')
        .setDescription(`🎶 **${track ? track.title : query}**`);

      await interaction.editReply({ embeds: [embed] });
    } catch (e) {
      console.error(e);
      await interaction.editReply("❌ نەتوانرا گۆرانییەکە بدۆزرێتەوە یان لێبدرێت. دڵنیا ببەوە لە ڕاستی لینکەکە.");
    }
  }
  else if (interaction.isButton() && interaction.customId === "pause_resume") {
    const player = interaction.client.player;
    const queue = player.nodes.get(interaction.guildId);
    if (!queue || !queue.isPlaying()) return interaction.reply({ content: "❌ هیچ گۆرانییەک کار ناکات!", ephemeral: true });
    
    if (queue.node.isPaused()) {
      queue.node.resume();
      await interaction.reply({ content: "▶️ موزیکەکە بەردەوام بووەوە!", ephemeral: true });
    } else {
      queue.node.pause();
      await interaction.reply({ content: "⏸️ موزیکەکە ڕاوەستا.", ephemeral: true });
    }
  }
  else if (interaction.isButton() && (interaction.customId === "skip_music" || interaction.customId === "skip_song_btn")) {
    const player = interaction.client.player;
    const queue = player.nodes.get(interaction.guildId);
    if (!queue || !queue.isPlaying()) return interaction.reply({ content: "❌ هیچ گۆرانییەک لە لیستدا نییە!", ephemeral: true });
    
    queue.node.skip();
    await interaction.reply({ content: "⏭️ گۆرانییەکە سکیپ کرا!", ephemeral: true });
  }
  else if (interaction.isButton() && interaction.customId === "stop_music") {
    const player = interaction.client.player;
    const queue = player.nodes.get(interaction.guildId);
    if (!queue) return interaction.reply({ content: "❌ هیچ پلەیەرێک کار ناکات!", ephemeral: true });
    
    queue.delete();
    await interaction.reply({ content: "⏹️ پلەیەرەکە وەستا و سڕایەوە.", ephemeral: true });
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
