=========================
  client.on("messageDelete", async (message) => {
    if (!message.guild || message.author?.bot) return;

    let data = {};

    if (fs.existsSync("./logs.json")) {
      data = JSON.parse(fs.readFileSync("./logs.json", "utf8"));
    }

    const channelId = data[message.guild.id];
    if (!channelId) return;

    const logChannel = message.guild.channels.cache.get(channelId);
    if (!logChannel) return;

    const embed = new EmbedBuilder()
      .setColor("Red")
      .setTitle("🗑️ Message Deleted")
      .addFields(
        {
          name: "User",
          value: `${message.author.tag}`,
          inline: true,
        },
        {
          name: "Channel",
          value: `${message.channel}`,
          inline: true,
        },
        {
          name: "Content",
          value: message.content || "No text",
        }
      )
      .setTimestamp();

    logChannel.send({ embeds: [embed] });
  });

  // =========================
  // Message Edit Logs
  // =========================
  client.on("messageUpdate", async (oldMessage, newMessage) => {
    if (!oldMessage.guild) return;
    if (oldMessage.author?.bot) return;
    if (oldMessage.content === newMessage.content) return;

    let data = {};
