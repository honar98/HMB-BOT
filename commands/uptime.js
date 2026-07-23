const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('uptime')
        .setDescription('پیشاندانی ماوەی بەردەوامی و کارکردنی بۆتەکە'),
    async execute(interaction) {
        const totalSeconds = (interaction.client.uptime / 1000);
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor(totalSeconds / 3600) % 24;
        const minutes = Math.floor(totalSeconds / 60) % 60;
        const seconds = Math.floor(totalSeconds % 60);

        const embed = new EmbedBuilder()
            .setTitle('⏱️ ماوەی کارکردنی بۆت (Uptime)')
            .setDescription(`بۆتەکە بۆ ئەم ماوەیە بە بێ پچڕان کاردەکات:\n\n` +
                          `• **${days}** ڕۆژ\n` +
                          `• **${hours}** کاتژمێر\n` +
                          `• **${minutes}** خولەک\n` +
                          `• **${seconds}** چرکە`)
            .setColor('#2ECC71')
            .setTimestamp()
            .setFooter({ text: `داواکراوە لەلایەن ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });

        await interaction.reply({ embeds: [embed] });
    },
};
