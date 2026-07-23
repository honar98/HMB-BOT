const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('ناردنی پەیام لە ڕێگەی بۆتەوە')
        .addStringOption(option =>
            option.setName("message")
                .setDescription("ئەو پەیامەی دەتەوێت بۆتەکە بینێرێت")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interaction) {
        const text = interaction.options.getString("message");

        try {
            await interaction.deferReply({ ephemeral: true });
            await interaction.channel.send(text);
            await interaction.editReply({ content: "✅ پەیامەکە بە سەرکەوتوویی نێردرا." });
        } catch (error) {
            console.error(error);
            if (interaction.deferred || interaction.replied) {
                await interaction.editReply({ content: "❌ هەڵەیەک ڕوویدا لە ناردنی پەیامەکە." });
            } else {
                await interaction.reply({ content: "❌ هەڵەیەک ڕوویدا لە ناردنی پەیامەکە.", ephemeral: true });
            }
        }
    }
};
