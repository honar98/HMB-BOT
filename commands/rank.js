const fs = require("fs");
const path = require("path");
const {
  SlashCommandBuilder,
  AttachmentBuilder,
} = require("discord.js");
const {
  createCanvas,
  loadImage,
} = require("@napi-rs/canvas");

// فەنکشنی یاریدەدەر بۆ دروستکردنی چوارگۆشەی گۆشەبازنەیی (Rounded Rectangle)
function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
  if (typeof radius === 'number') {
    radius = { tl: radius, tr: radius, br: radius, bl: radius };
  } else {
    radius = Object.assign({ tl: 0, tr: 0, br: 0, bl: 0 }, radius);
  }
  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx.closePath();
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rank")
    .setDescription("پیشاندانی کارتەی زانیاری ئاست و ئەزموون (XP & Level)")
    .addUserOption(option =>
      option.setName("user")
        .setDescription("ئەو ئەندامەی دەتەوێت ڕیزبەندییەکەی ببەیت")
        .setRequired(false)
    ),

  async execute(interaction) {
    const targetUser = interaction.options.getUser("user") || interaction.user;

    const levelsFile = path.join(__dirname, "../levels.json");
    if (!fs.existsSync(levelsFile)) {
      return interaction.reply({ content: "❌ هیچ زانیارییەکی ئاست (XP) تۆمار نەکراوە.", ephemeral: true });
    }

    const levels = JSON.parse(fs.readFileSync(levelsFile, "utf8"));
    const data = levels[targetUser.id];

    if (!data) {
      return interaction.reply({ content: `❌ ${targetUser.tag} هیچ ئاست یان XPی نییە لە سیستەمەکەدا.`, ephemeral: true });
    }

    await interaction.deferReply();

    try {
      // دروستکردنی کانڤاس بە قەبارەی ستانداردی پڕۆفیشناڵ (1000x350)
      const canvas = createCanvas(1000, 350);
      const ctx = canvas.getContext("2d");

      // 1. پاشبنەمای گرادینتی تاریک و سەرنجڕاکێش
      const bgGradient = ctx.createLinearGradient(0, 0, 1000, 350);
      bgGradient.addColorStop(0, "#0a0a16");
      bgGradient.addColorStop(0.5, "#121224");
      bgGradient.addColorStop(1, "#1a0b2e");
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, 1000, 350);

      // هێڵی نيون دەوری کارتەکە
      ctx.strokeStyle = "#00d8ff";
      ctx.lineWidth = 3;
      ctx.shadowColor = "#00d8ff";
      ctx.shadowBlur = 12;
      roundRect(ctx, 15, 15, 970, 320, 20, false, true);
      ctx.shadowBlur = 0;

      // 2. وێنەی پڕۆفایلی ئەندام (Avatar)
      const avatarUrl = targetUser.displayAvatarURL({ extension: "png", size: 256 });
      const avatar = await loadImage(avatarUrl);
      const avatarX = 110;
      const avatarY = 175;
      const avatarRadius = 75;

      // بازنەی درەوشاوەی دەوری وێنە
      ctx.beginPath();
      ctx.arc(avatarX, avatarY, avatarRadius + 5, 0, Math.PI * 2);
      ctx.lineWidth = 5;
      ctx.strokeStyle = "#27e8ff";
      ctx.shadowColor = "#27e8ff";
      ctx.shadowBlur = 20;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // بڕینی بازنەیی و نیشاندانی وێنە
      ctx.save();
      ctx.beginPath();
      ctx.arc(avatarX, avatarY, avatarRadius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(avatar, avatarX - avatarRadius, avatarY - avatarRadius, avatarRadius * 2, avatarRadius * 2);
      ctx.restore();

      // 3. ناوی بەکارهێنەر (Username)
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 38px Sans";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(targetUser.username, 215, 95);

      // ڕێزبەندی (Rank) و ئاست (Level)
      const rank = Object.keys(levels)
        .sort((a, b) => levels[b].xp - levels[a].xp)
        .indexOf(targetUser.id) + 1;

      const maxXP = data.level * 100;

      // چوارگۆشەیچووک بۆ Level
      ctx.fillStyle = "rgba(0, 216, 255, 0.1)";
      roundRect(ctx, 670, 55, 130, 75, 12, true, false);
      ctx.strokeStyle = "#00d8ff";
      ctx.lineWidth = 2;
      roundRect(ctx, 670, 55, 130, 75, 12, false, true);

      ctx.fillStyle = "#00d8ff";
      ctx.font = "bold 18px Sans";
      ctx.textAlign = "center";
      ctx.fillText("LEVEL", 735, 75);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 30px Sans";
      ctx.fillText(`${data.level}`, 735, 108);

      // چوارگۆشەیچووک بۆ Rank
      ctx.fillStyle = "rgba(124, 255, 79, 0.1)";
      roundRect(ctx, 820, 55, 130, 75, 12, true, false);
      ctx.strokeStyle = "#7CFF4F";
      ctx.lineWidth = 2;
      roundRect(ctx, 820, 55, 130, 75, 12, false, true);

      ctx.fillStyle = "#7CFF4F";
      ctx.font = "bold 18px Sans";
      ctx.textAlign = "center";
      ctx.fillText("RANK", 885, 75);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 30px Sans";
      ctx.fillText(`#${rank}`, 885, 108);

      // 4. نوسینی XP
      ctx.fillStyle = "#b8b8cc";
      ctx.font = "bold 22px Sans";
      ctx.textAlign = "right";
      ctx.fillText(`${data.xp} / ${maxXP} XP`, 950, 175);

      // 5. هێڵی پێشکەوتن (XP Progress Bar)
      const barX = 215;
      const barY = 195;
      const barWidth = 735;
      const barHeight = 35;
      const barRadius = 17;

      // پاشبنەمای هێڵەکە
      ctx.fillStyle = "#161625";
      roundRect(ctx, barX, barY, barWidth, barHeight, barRadius, true, false);

      // پڕکردنەوەی هێڵەکە بە گرادینت
      const percent = Math.min(data.xp / maxXP, 1);
      if (percent > 0) {
        const fillWidth = Math.max(barHeight, barWidth * percent);
        const progressGradient = ctx.createLinearGradient(barX, barY, barX + barWidth, barY);
        progressGradient.addColorStop(0, "#00e5ff");
        progressGradient.addColorStop(0.5, "#00a2ff");
        progressGradient.addColorStop(1, "#8a2be2");

        ctx.fillStyle = progressGradient;
        roundRect(ctx, barX, barY, fillWidth, barHeight, barRadius, true, false);
      }

      // چوارگۆشەی دەوری هێڵی پێشکەوتن
      ctx.strokeStyle = "rgba(0, 216, 255, 0.4)";
      ctx.lineWidth = 2;
      roundRect(ctx, barX, barY, barWidth, barHeight, barRadius, false, true);

      const attachment = new AttachmentBuilder(
        await canvas.encode("png"),
        { name: "rank.png" }
      );

      return interaction.editReply({ files: [attachment] });

    } catch (err) {
      console.error(err);
      return interaction.editReply({
        content: "❌ هەڵەیەک ڕوویدا لە دروستکردنی کارتەی ڕانک."
      });
    }
  },
};
