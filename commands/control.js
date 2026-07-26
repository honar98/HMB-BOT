const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('control')
        .setDescription('کردنەوەی تابلۆی کۆنتڕۆڵی موزیک'),
    async execute(interaction) {
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('search_music')
                    .setLabel('گەڕان')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('🔍'),
                new ButtonBuilder()
                    .setCustomId('pause_resume')
                    .setLabel('وەستان/لێدان')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('⏸️'),
                new ButtonBuilder()
                    .setCustomId('skip_music')
                    .setLabel('سکیپ')
                    .setStyle(ButtonStyle.Success)
                    .setEmoji('⏭️'),
                new ButtonBuilder()
                    .setCustomId('stop_music')
                    .setLabel('ستۆپ')
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji('⏹️')
            );

        await interaction.reply({
            content: '**🎵 تابلۆی کۆنتڕۆڵی موزیک:** دوگمەکانی خوارەوە بەکاربهێنە بۆ کۆنتڕۆڵکردن.',
            components: [row],
            ephemeral: false
        });
    },
};
