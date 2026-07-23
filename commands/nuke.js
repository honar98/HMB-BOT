const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nuke')
        .setDescription('نۆککردنی کەناڵ (سڕینەوە و دروستکردنەوەی کەناڵەکە بە هەموو ڕێکخستنەکانییەوە)')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async execute(interaction) {
        if (!interaction.guild) {
            return interaction.reply({ content: "❌ ئەم فەرمانە تەنها لە ناو سێروەردا کار دەکات.", ephemeral: true });
        }

        try {
            // دواخستنی وەڵام چونکە پرۆسەی لەبەرگرتنەوە و سڕینەوە کاتێکی کەم دەبات
            await interaction.deferReply({ ephemeral: true });

            const channel = interaction.channel;
            const newChannel = await channel.clone();

            await newChannel.setPosition(channel.position);
            await channel.delete();

            await interaction.editReply({ content: "💥 کەناڵەکە بە سەرکەوتوویی نۆکرا." });
            return newChannel.send("💥 کەناڵەکە نوێکرایەوە و سڕایەوە (Nuked).");

        } catch (err) {
            console.error(err);

            const errorMsg = "❌ سەرکەوتوو نەبوو لە نۆککردنی ئەم کەناڵە.";
            if (interaction.deferred || interaction.replied) {
                return interaction.editReply({ content: errorMsg });
            } else {
                return interaction.reply({ content: errorMsg, ephemeral: true });
            }
        }
    },
};
