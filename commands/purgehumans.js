const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('purgehumans')
        .setDescription('سڕینەوەی نامەی بەکارهێنەران (مرۆڤەکان) بە کۆمەڵ لە کەناڵدا')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('ژمارەی نامەکان بۆ سڕینەوە (لە 1 بۆ 100)')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(100)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interaction) {
        const amount = interaction.options.getInteger('amount');

        try {
            await interaction.deferReply({ ephemeral: true });

            const messages = await interaction.channel.messages.fetch({
                limit: 100
            });

            const humanMessages = messages
                .filter(msg => !msg.author.bot)
                .first(amount);

            if (humanMessages.length === 0) {
                return interaction.editReply({ content: "❌ هیچ نامەیەکی بەکارهێنەر نەدۆزرایەوە بۆ سڕینەوە." });
            }

            await interaction.channel.bulkDelete(humanMessages, true);

            return interaction.editReply({
                content: `🧹 بە سەرکەوتوویی **${humanMessages.length}** نامەی بەکارهێنەر سڕایەوە.`
            });

        } catch (err) {
            console.error(err);

            const errorMsg = "❌ سەرکەوتوو نەبوو لە سڕینەوەی نامەکان (تێبینی: نامەی سەروو 14 ڕۆژ کۆن ناتوانرێت بە کۆمەڵ بسڕدرێتەوە).";
            if (interaction.deferred || interaction.replied) {
                return interaction.editReply({ content: errorMsg });
            } else {
                return interaction.reply({ content: errorMsg, ephemeral: true });
            }
        }
    },
};
