const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('وەستاندنی مۆسیقا و سڕینەوەی لیستی پەخش (Queue)'),

    async execute(interaction) {
        const queue = interaction.client.player.nodes.get(interaction.guild.id);

        if (!queue || !queue.currentTrack) {
            return interaction.reply({ content: "❌ هیچ گۆرانییەک لە ئێستادا پەخش ناکرێت.", ephemeral: true });
        }

        try {
            queue.delete();

            return interaction.reply("⏹️ پەخشکردنی گۆرانی و لیستی پەخش (Queue) بە سەرکەوتوویی وەستێنرا.");
        } catch (error) {
            console.error(error);

            return interaction.reply({ content: "❌ هەڵەیەک ڕوویدا لە کاتی وەستاندنی پەخشکردن.", ephemeral: true });
        }
    }
};
