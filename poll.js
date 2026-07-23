const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "poll",

  async execute(message, args) {
    const question = args.join(" ");

    if (!question)
      return message.reply("❌ Please provide a poll question.");

    const embed = new EmbedBuilder()
      .setColor("Blue")
      .setTitle("📊 New Poll")
      .setDescription(question)
      .setFooter({ text: `Started by ${message.author.tag}` })
      .setTimestamp();

    const poll = await message.channel.send({ embeds: [embed] });

    await poll.react("👍");
    await poll.react("👎");

    await message.delete().catch(() => {});
  },
};
