const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('volume')
        .setDescription('گۆڕینی ئاستی دەنگی مۆسیقاکە')
        .addIntegerOption(option =>
            option.setName('level')
                .setDescription('ئاستی دەنگ لە نێوان 1 بۆ 100')
                .setMinValue(1)
                .setMaxValue(100)
                .setRequired(true)
        ),

    async execute(interaction) {
        const queue = interaction.client.player.nodes.get(interaction.guild.id);

        if (!queue || !queue.currentTrack) {
            return interaction.reply({ content: "❌ هیچ گۆرانییەک لە ئێستادا پەخش ناکرێت.", ephemeral: true });
        }

        const volume = interaction.options.getInteger('level');

        try {
            queue.node.setVolume(volume);

            return interaction.reply(`🔊 قەبارەی دەنگ بە سەرکەوتوویی گۆڕدرا بۆ **${volume}%**`);
        } catch (error) {
            console.error("Volume Error:", error);
            return interaction.reply({ content: "❌ هەڵەیەک ڕوویدا لە کاتی گۆڕینی ئاستی دەنگ.", ephemeral: true });
        }
    },
};
