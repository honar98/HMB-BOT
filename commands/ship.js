const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ship')
        .setDescription('شایپ کردنی نێوان دوو کەس و پشکنینی ڕێژەی خۆشەویستی ❤️')
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
        let color = "#FF1493"; // ڕەنگی پەمەیی سەرەتایی

        if (percentage > 85) {
            message = "✨ ئەوە خۆشەویستییەکی ڕاستەقینەیە! زۆر هاوسەنگن! پێکەوە زۆر جوانن! 😍";
            color = "#00FF7F"; // سەوزی کاڵ
        } else if (percentage > 50) {
            message = "💖 پەیوەندییەکی باشە و هیوای سەرکەوتنی بۆ دەخوازم! 😉";
            color = "#FFD700"; // زێڕی
        } else {
            message = "💔 پێویستە کاتێکی زیاتر بە یەکەوە ببەن بەسەر! پێشەنگی کەمترە هێشتا. 😅";
            color = "#FF4500"; // سووری نارنجی
        }

        // دروستکردنی ئێمبێدی پرۆفیشناڵ
        const embed = new EmbedBuilder()
            .setColor(color)
            .setTitle('💘 پشکنی ڕێژەی خۆشەویستی (Ship)')
            .setDescription(`بەستنەوەی نێوان **${user1}** و **${user2}**`)
            .addFields(
                { name: '👥 ئەندامەکان', value: `${user1.username} 🔀 ${user2.username}`, inline: false },
                { name: '❤️ ڕێژەی خۆشەویستی', value: `**${percentage}%**\n\`${progressBar}\``, inline: false },
                { name: '💬 رای بۆت', value: message, inline: false }
            )
            .setThumbnail(user2.displayAvatarURL({ dynamic: true }))
            .setFooter({ 
                text: `داواکراوە لەلایەن ${interaction.user.tag}`, 
                iconURL: interaction.user.displayAvatarURL({ dynamic: true }) 
            })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
