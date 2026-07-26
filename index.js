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
const { YoutubeExtractor } = require("@discord-player/extractor");
const { SpotifyExtractor } = require("@discord-player/extractor");

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
    await player.extractors.register(YoutubeExtractor, {});
    await player.extractors.register(SpotifyExtractor, {});
    console.log("🎵 YouTube and Spotify Extractors registered successfully!");
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
      
      const { track } = await player.play(vc, query, {
        nodeOptions: { 
          metadata: interaction.channel, 
          leaveOnEmpty: false, 
          leaveOnEnd: false, 
          selfDeaf: true 
        }
      });

      const embed = new EmbedBuilder()
        .setColor('#1DB954')
        .setTitle('🎵 دەنگپەخشکرا')
        .setDescription(`🎶 **${track.title}**\n👤 **گۆرانیبێژ:** ${track.author}`);

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

client.login(process.env.TOKEN);
