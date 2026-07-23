const { PermissionsBitField } = require("discord.js");

module.exports = {
  name: "kick",

  async execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers))
      return message.reply("❌ You don't have permission.");

    const member = message.mentions.members.first();
    if (!member)
      return message.reply("❌ Mention a member.");

    if (!member.kickable)
      return message.reply("❌ I can't kick this member.");

    const reason = args.slice(1).join(" ") || "No reason provided";

    try {
      await member.kick(reason);

      message.channel.send(
        `👢 **${member.user.tag}** has been kicked.\nReason: **${reason}**`
      );
    } catch (err) {
      console.error(err);
      message.reply("❌ Failed to kick member.");
    }
  },
};
