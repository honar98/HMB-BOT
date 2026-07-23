const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverbanner')
        .setDescription('پیشاندانی ڕووی پێشەوەی (Banner) سێروەرەکە'),

    async execute(interaction) {
        if (!interaction.guild) {
            return interaction.reply({ content: "❌ ئەم فەرمانە تەنها لەناو سێروەردا کاردەکات.", ephemeral: true });
        }

        try {
            // هێنانی زانیاری تەواوی سێروەرەکە بە شێوەیەکی دروست
            const guild = await interaction.client.guilds.fetch(interaction.guild.id);
            const banner = guild.bannerURL({ extension: "png", size: 1024 });

            if (!banner) {
                return interaction.reply({ content: "❌ ئەم سێروەرە هیچ ڕووی پێشەوەیەکەی (Banner) نییە.", ephemeral: true });
            }

            const embed = new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle(`🖼️ ڕووی پێشەوەی سێروەری ${guild.name}`)
                .setImage(banner);

            return interaction.reply({
                embeds: [embed]
            });

        } catch (err) {
            console.error(err);
            return interaction.reply({
                content: "❌ هەڵەیەک ڕوویدا لە هێنانی بەنەری سێروەر.",
                ephemeral: true
            });
        }
    },
};
