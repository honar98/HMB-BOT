const { PermissionsBitField } = require("discord.js");

module.exports = {
  name: "ban",

  async execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers))
      return message.reply("❌ You don't have permission.");

    const member = message.mentions.members.first();
    if (!member)
      return message.reply("❌ Mention a member.");

    if (!member.bannable)
      return message.reply("❌ I can't ban this member.");

    const reason = args.slice(1).join(" ") || "No reason provided";

    try {
      await member.ban({ reason });

      message.channel.send(
        `🔨 **${member.user.tag}** has been banned.\nReason: **${reason}**`
      );
    } catch (err) {
      console.error(err);
      message.reply("❌ Failed to ban member.");
    }
  },
};
