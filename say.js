const { PermissionsBitField } = require("discord.js");

module.exports = {
  name: "say",

  async execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages))
      return message.reply("❌ You don't have permission.");

    const text = args.join(" ");

    if (!text)
      return message.reply("❌ Please enter a message.");

    await message.delete().catch(() => {});

    message.channel.send(text);
  },
};
