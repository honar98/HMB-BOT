const { AttachmentBuilder } = require("discord.js");
const { createCanvas, loadImage } = require("@napi-rs/canvas");

module.exports = (client) => {
  client.on("guildMemberAdd", async (member) => {
    try {
      const canvas = createCanvas(1000, 350);
      const ctx = canvas.getContext("2d");

      // Background
      ctx.fillStyle = "#111827";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Border
      ctx.strokeStyle = "#00e5ff";
      ctx.lineWidth = 8;
      ctx.strokeRect(0, 0, canvas.width, canvas.height);

      // Title
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 48px Sans";
      ctx.fillText("WELCOME", 330, 80);

      // Username
      ctx.fillStyle = "#00e5ff";
      ctx.font = "bold 36px Sans";
      ctx.fillText(member.user.username, 330, 140);

      // Member Count
      ctx.fillStyle = "#ffffff";
      ctx.font = "28px Sans";
      ctx.fillText(
        `Member #${member.guild.memberCount}`,
        330,
        190
      );

      // Avatar
      const avatar = await loadImage(
        member.user.displayAvatarURL({
          extension: "png",
          size: 256,
        })
      );

      ctx.save();
      ctx.beginPath();
      ctx.arc(160, 175, 90, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(avatar, 70, 85, 180, 180);
      ctx.restore();

      const attachment = new AttachmentBuilder(
        await canvas.encode("png"),
        { name: "welcome.png" }
      );

      if (member.guild.systemChannel) {
        member.guild.systemChannel.send({
          content: `👋 Welcome ${member}!`,
          files: [attachment],
        });
      }
    } catch (err) {
      console.error(err);
    }
  });
};
