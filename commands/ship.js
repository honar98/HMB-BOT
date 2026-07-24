const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ship')
        .setDescription('پشکنی ڕێژەی خۆشەویستی نێوان دوو کەس ❤️')
        .addUserOption(option =>
            option.setName('user1')
                .setDescription('کەسی یەکەم')
                .setRequired(true))
        .addUserOption(option =>
            option.setName('user2')
                .setDescription('کەسی دووەم')
                .setRequired(true)),

    async execute(interaction) {
        await interaction.deferReply();

        const user1 = interaction.options.getUser('user1');
        const user2 = interaction.options.getUser('user2');

        // دروستکردنی ڕێژەیەکی هەڕەمەکی لە 0 تا 100
        const percentage = Math.floor(Math.random() * 101);

        // دروستکردنی بارێکی جوانی پێشکەوتن (Progress Bar)
        const filledBars = Math.round(percentage / 10);
        const emptyBars = 10 - filledBars;
        const progressBar = '█'.repeat(filledBars) + '░'.repeat(emptyBars);

        // دیاریکردنی پەیام و ڕەنگ بەپێی ڕێژەی خۆشەویستییەکە
        let message = "";
        let embedColor = "#FF1493";

        if (percentage > 85) {
            message = "✨ ئەوە خۆشەویستییەکی ڕاستەقینەیە! زۆر هاوسەنگن پێکەوە! 😍";
            embedColor = "#00FF7F";
        } else if (percentage > 50) {
            message = "💖 پەیوەندییەکی باشە و هیوای سەرکەوتنی بۆ دەخوازم! 😉";
            embedColor = "#FFD700";
        } else {
            message = "💔 پێویستە کاتێکی زیاتر بە یەکەوە ببەن بەسەر! 😅";
            embedColor = "#FF4500";
        }

        try {
            // دروستکردنی کەنڤاس بە قەبارەی 700 بە 250 پیکسڵ
            const canvas = createCanvas(700, 250);
            const ctx = canvas.getContext('2d');

            // بارکردنی وێنەی پاشبنەما (Background)
            const background = await loadImage('https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=700&auto=format&fit=crop').catch(() => null);
            if (background) {
                ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
            } else {
                ctx.fillStyle = '#1e1f22';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            // تاریککردنی کەمێک باکگراوندەکە
            ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // 1. بارکردنی وێنەی پڕۆفایلی کەسی یەکەم (چەپ)
            const avatar1 = await loadImage(user1.displayAvatarURL({ extension: 'png', size: 256 }));
            ctx.save();
            ctx.beginPath();
            ctx.arc(110, 125, 70, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(avatar1, 40, 55, 140, 140);
            ctx.restore();

            ctx.strokeStyle = '#ff4757';
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.arc(110, 125, 70, 0, Math.PI * 2, true);
            ctx.stroke();

            // 2. بارکردنی وێنەی پڕۆفایلی کەسی دووەم (ڕاست)
            const avatar2 = await loadImage(user2.displayAvatarURL({ extension: 'png', size: 256 }));
            ctx.save();
            ctx.beginPath();
            ctx.arc(590, 125, 70, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(avatar2, 520, 55, 140, 140);
            ctx.restore();

            ctx.strokeStyle = '#ff4757';
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.arc(590, 125, 70, 0, Math.PI * 2, true);
            ctx.stroke();

            // 3. بازنەی سوور و دڵ لە ناوەڕاستدا بۆ جوانی
            ctx.fillStyle = '#ff4757';
            ctx.beginPath();
            ctx.arc(350, 125, 30, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 22px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('❤️', 350, 126);

            // دروستکردنی فایلەکە بۆ ناردن
            const attachment = new AttachmentBuilder(canvas.toBuffer('image/png'), { name: 'ship-result.png' });

            const embed = new EmbedBuilder()
                .setColor(embedColor)
                .setTitle('💘 پشکنی ڕێژەی خۆشەویستی (Ship Match)')
                .setDescription(`🔗 **${user1.username}** لەگەڵ **${user2.username}**`)
                .addFields(
                    { name: '❤️ ڕێژەی خۆشەویستی', value: `> **${percentage}%**\n> \`${progressBar}\``, inline: false },
                    { name: '💬 ڕای بۆت', value: `> *${message}*`, inline: false }
                )
                .setImage('attachment://ship-result.png')
                .setFooter({ text: `داواکراوە لەلایەن ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed], files: [attachment] });

        } catch (error) {
            console.error("Canvas Ship Error:", error);
            await interaction.editReply({ content: '❌ هەڵەیەک ڕوویدا لە دروستکردنی وێنەی شیپەکە.' });
        }
    },
};
