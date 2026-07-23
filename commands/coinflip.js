const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('coinflip')
        .setDescription('هەڵدانی دراو (سەر یان خاچ - Heads or Tails)'),
    async execute(interaction) {
        const result = Math.random() < 0.5 ? 'سەر (Heads) 🎯' : 'خاچ (Tails) 🪙';
        const color = result.includes('سەر') ? '#F1C40F' : '#3498DB';

        const embed = new EmbedBuilder()
            .setTitle('🪙 یاری هەڵدانی دراو (Coinflip)')
            .setDescription(`دراوەکە هەڵدرا و ئەنجامەکەی:\n\n**${result}**`)
            .setColor(color)
            .setTimestamp()
            .setFooter({ text: `داواکراوە لەلایەن ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });

        await interaction.reply({ embeds: [embed] });
    },
};
