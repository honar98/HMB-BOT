const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ship')
        .setDescription('پشکنی ڕێژەی خۆشەویستی نێوان دوو کەس بە شێوازی وێنەی دڵخواز ❤️')
        .addUserOption(option =>
            option.setName('user1')
                .setDescription('کەسی یەکەم')
                .setRequired(true))
        .addUserOption(option =>
            option.setName('user2')
                .setDescription('کەسی دووەم')
                .setRequired(true)),

    async execute(interaction) {
        // چاوەڕوانکردنی بۆت تاوەکو وێنەکە دروست دەبێت
        await interaction.deferReply();

        const user1 = interaction.options.getUser('user1');
        const user2 = interaction.options.getUser('user2');

        // دروستکردنی ڕێژەیەکی هەڕەمەکی لە 0 تا 100
        const percentage = Math.floor(Math.random() * 101);

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

            // تاریککردنی کەمێک باکگراوندەکە بۆ دەرکەوتنی ڕووناکی وێنەکان
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

            // چوارچێوەی جوانی دەوری وێنەی یەکەم
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

            // چوارچێوەی جوانی دەوری وێنەی دووەم
            ctx.strokeStyle = '#ff4757';
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.arc(590, 125, 70, 0, Math.PI * 2, true);
            ctx.stroke();

            // 3. نووسینی ڕێژەی خۆشەویستی و هێمای دڵ لە ناوەڕاستدا
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 45px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(`${percentage}%`, 350, 115);

            ctx.font = 'bold 22px sans-serif';
            let statusText = percentage > 85 ? "✨ زۆر هاوسەنگن!" : percentage > 50 ? "💖 پەیوەندییەکی باشە!" : "💔 پێویستی بە کاتە!";
            ctx.fillText(statusText, 350, 160);

            // دروستکردنی فایلی وێنەکە بۆ ناردن
            const attachment = new AttachmentBuilder(canvas.toBuffer('image/png'), { name: 'ship-result.png' });

            let embedColor = percentage > 85 ? '#00FF7F' : percentage > 50 ? '#FFD700' : '#FF4500';

            const embed = new EmbedBuilder()
                .setColor(embedColor)
                .setTitle('💘 پشکنی ڕێژەی خۆشەویستی (Ship Match)')
                .setDescription(`🔗 **${user1.username}** لەگەڵ **${user2.username}**`)
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
