const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

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
        let color = "#FF1493";

        if (percentage > 85) {
            message = "✨ ئەوە خۆشەویستییەکی ڕاستەقینەیە! زۆر هاوسەنگن و پێکەوە زۆر جوانن! 😍";
            color = "#00FF7F";
        } else if (percentage > 50) {
            message = "💖 پەیوەندییەکی باشە و هیوای سەرکەوتنی بۆ دەخوازم! 😉";
            color = "#FFD700";
        } else {
            message = "💔 پێویستە کاتێکی زیاتر بە یەکەوە ببەن بەسەر و یەکدی بناسن! 😅";
            color = "#FF4500";
        }

        // دروستکردنی ئێمبێدی پرۆفیشناڵ بە وێنەی گەورە لە پشتەوە (Image)
        const embed = new EmbedBuilder()
            .setColor(color)
            .setTitle('💘 پشکنی ڕێژەی خۆشەویستی (Ship Match)')
            .setDescription(`🔗 بەستنەوەی نێوان **${user1}** و **${user2}**`)
            .addFields(
                { name: '👥 ئەندامەکان', value: `> ${user1} 🔀 ${user2}`, inline: false },
                { name: '❤️ ڕێژەی خۆشەویستی', value: `> **${percentage}%**\n> \`${progressBar}\``, inline: false },
                { name: '💬 ڕای بۆت', value: `> *${message}*`, inline: false }
            )
            .setThumbnail(user1.displayAvatarURL({ dynamic: true, size: 512 }))
            .setImage('https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=1000&auto=format&fit=crop') // وێنەیەکی جوانی ڕۆمانسی لە پشتەوە
            .setFooter({ 
                text: `داواکراوە لەلایەن ${interaction.user.tag}`, 
                iconURL: interaction.user.displayAvatarURL({ dynamic: true }) 
            })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
