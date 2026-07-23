const {
  PermissionsBitField,
  EmbedBuilder
} = require("discord.js");

module.exports = {
  name: "timeout",

  async execute(message, args) {

    if (
      !message.member.permissions.has(
        PermissionsBitField.Flags.ModerateMembers
      )
    ) {
      return message.reply("❌ You don't have permission.");
    }

    const member = message.mentions.members.first();

    if (!member) {
      return message.reply(
        "❌ Usage: $timeout @user 10m Reason"
      );
    }

    if (member.id === message.author.id) {
      return message.reply(
        "❌ You can't timeout yourself."
      );
    }

    if (member.id === message.guild.ownerId) {
      return message.reply(
        "❌ You can't timeout the server owner."
      );
    }

    const duration = args[1];

    if (!duration) {
      return message.reply(
        "❌ Specify a duration. Example: 10m"
      );
    }

    const reason =
      args.slice(2).join(" ") || "No reason provided";

    let ms = 0;

    if (duration.endsWith("s")) {
      ms = parseInt(duration) * 1000;
    } else if (duration.endsWith("m")) {
      ms = parseInt(duration) * 60 * 1000;
    } else if (duration.endsWith("h")) {
      ms = parseInt(duration) * 60 * 60 * 1000;
    } else if (duration.endsWith("d")) {
      ms = parseInt(duration) * 24 * 60 * 60 * 1000;
    } else {
      return message.reply(
        "❌ Invalid time. Use: s, m, h or d"
      );
    }

    try {

      await member.timeout(ms, reason);

      const embed = new EmbedBuilder()
        .setTitle("⏳ Member Timed Out")
        .setColor("Orange")
        .addFields(
          {
            name: "Member",
            value: `${member.user.tag}`
          },
          {
            name: "Duration",
            value: duration
          },
          {
            name: "Reason",
            value: reason
          },
          {
            name: "Moderator",
            value: `${message.author.tag}`
          }
        )
        .setTimestamp();

      await message.channel.send({
        embeds: [embed]
      });

    } catch (error) {
      console.error(error);

      return message.reply(
        "❌ Failed to timeout this member."
      );
    }

  }
};
