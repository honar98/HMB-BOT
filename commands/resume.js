const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('بەردەوامبوون لە پەخشکردنی ئەو گۆرانییەی کە وەستێنرابوو'),

    async execute(interaction) {
        const queue = interaction.client.player.nodes.get(interaction.guild.id);

        if (!queue || !queue.currentTrack) {
            return interaction.reply({ content: "❌ هیچ گۆرانییەک لە ئێستادا پەخش ناکرێت.", ephemeral: true });
        }

        if (!queue.node.isPaused()) {
            return interaction.reply({ content: "▶️ گۆرانییەکە پێشتر پەخش دەکرێت و وەستێنراو نییە.", ephemeral: true });
        }

        queue.node.resume();

        return interaction.reply("▶️ گۆرانییەکە بەردەوام بوو لە لێدان.");
    },
};
