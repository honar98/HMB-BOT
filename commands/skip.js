const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('تێپەڕاندنی گۆرانی ئێستا و چوون بۆ گۆرانی داهاتوو'),

    async execute(interaction) {
        const queue = interaction.client.player.nodes.get(interaction.guild.id);

        if (!queue || !queue.currentTrack) {
            return interaction.reply({ content: "❌ هیچ گۆرانییەک لە ئێستادا پەخش ناکرێت.", ephemeral: true });
        }

        try {
            queue.node.skip();

            return interaction.reply("⏭️ گۆرانییەکە بە سەرکەوتوویی تێپەڕێندرا.");
        } catch (error) {
            console.error(error);

            return interaction.reply({ content: "❌ نەتوانرا گۆرانییەکە تێپەڕێندرێت.", ephemeral: true });
        }
    },
};
