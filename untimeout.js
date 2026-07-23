const { PermissionsBitField } = require("discord.js");

module.exports = {
  name: "untimeout",

  async execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers))
      return message.reply("❌ You don't have permission.");

    const member = message.mentions.members.first();
    if (!member)
      return message.reply("❌ Mention a member.");

    try {
      await member.timeout(null);

      message.channel.send(
        `✅ ${member.user.tag} has been removed from timeout.`
      );
    } catch (err) {
      console.error(err);
      message.reply("❌ Failed to remove timeout.");
    }
  },
};
