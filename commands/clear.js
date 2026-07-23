const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('سڕینەوەی چەند پەیامێک بەیەکجار لە چاتەکەدا')
        .addIntegerOption(option =>
            option.setName('count')
                .setDescription('ژمارەی ئەو پەیامانەی دەتەوێت بسڕیتەوە (1 تا 100)')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(100)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interaction) {
        const amount = interaction.options.getInteger('count');

        // سڕینەوەی پەیامەکان
        await interaction.channel.bulkDelete(amount, true).catch(err => {
            return interaction.reply({ 
                content: '❌ هەڵەیەک ڕوویدا لە سڕینەوەی پەیامەکان (ڕەنگە کۆنتر بن لە 14 ڕۆژ).', 
                ephemeral: true 
            });
        });

        // ناردنی وەڵامێکی نهێنی (Ephemeral) بۆ ئەوەی چاتەکە پیس نەبێت
        await interaction.reply({ 
            content: `✅ بە سەرکەوتوویی **${amount}** پەیام سڕرانەوە.`, 
            ephemeral: true 
        });
    },
};
