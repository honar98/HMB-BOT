const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('servericon')
        .setDescription('پیشاندانی وێنەی سێروەرەکە (Icon)'),

    async execute(interaction) {
        if (!interaction.guild) {
            return interaction.reply({ content: "❌ ئەم فەرمانە تەنها لەناو سێروەردا کاردەکات.", ephemeral: true });
        }

        try {
            const icon = interaction.guild.iconURL({ size: 1024 });

            if (!icon) {
                return interaction.reply({ content: "❌ ئەم سێروەرە هیچ وێنەیەکی (Icon) نییە.", ephemeral: true });
            }

            const embed = new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle(`🖼️ وێنەی سێروەری ${interaction.guild.name}`)
                .setImage(icon);

            return interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error("ServerIcon Error:", error);
            return interaction.reply({
                content: "❌ هەڵەیەک ڕوویدا لە هێنانی وێنەی سێروەر.",
                ephemeral: true
            });
        }
    },
};
