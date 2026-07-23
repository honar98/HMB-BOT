const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('slowmode')
        .setDescription('دیاریکردنی کاتی سۆلمۆد (Slowmode) بۆ کەناڵەکە')
        .addIntegerOption(option =>
            option.setName('seconds')
                .setDescription('ماوەی چرکەکان (لە 0 بۆ 21600 چرکە)')
                .setMinValue(0)
                .setMaxValue(21600)
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async execute(interaction) {
        const seconds = interaction.options.getInteger('seconds');

        try {
            await interaction.channel.setRateLimitPerUser(seconds);

            if (seconds === 0) {
                return interaction.reply({ 
                    content: "✅ سۆلمۆد (Slowmode) بۆ ئەم کەناڵە پەکخرا.", 
                    ephemeral: true 
                });
            }

            return interaction.reply({ 
                content: `✅ سۆلمۆد بۆ ئەم کەناڵە دانرا لەسەر **${seconds}** چرکە.`, 
                ephemeral: true 
            });

        } catch (err) {
            console.error("Slowmode Error:", err);
            return interaction.reply({
                content: "❌ سەرکەوتوو نەبوو لە گۆڕینی کاتی سۆلمۆد.",
                ephemeral: true
            });
        }
    },
};
