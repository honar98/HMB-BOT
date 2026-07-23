const { PermissionsBitField } = require("discord.js");

module.exports = {
  name: "lock",

  async execute(message) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels))
      return message.reply("❌ You don't have permission.");

    try {
      await message.channel.permissionOverwrites.edit(message.guild.roles.everyone, {
        SendMessages: false,
      });

      message.channel.send("🔒 Channel has been locked.");
    } catch (err) {
      console.error(err);
      message.reply("❌ Failed to lock channel.");
    }
  },
};
