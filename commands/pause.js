const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('وەستاندنی کاتیی گۆرانی ئێستا'),

    async execute(interaction) {
        const queue = interaction.client.player.nodes.get(interaction.guild.id);

        if (!queue || !queue.currentTrack) {
            return interaction.reply({ content: "❌ هیچ گۆرانییەک لە ئێستادا پەخش ناکرێت.", ephemeral: true });
        }

        if (queue.node.isPaused()) {
            return interaction.reply({ content: "⏸️ گۆرانییەکە پێشتر وەستێنراوە.", ephemeral: true });
        }

        queue.node.pause();

        return interaction.reply("⏸️ گۆرانییەکە وەستێنرا.");
    },
};
