const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('banner')
        .setDescription('پیشاندانی باوەری پڕۆفایلی (Banner) خۆت یان ئەندامێکی تر')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('ئەو ئەندامەی دەتەوێت باوەرەکەی ببەین')
                .setRequired(false)
        ),

    async execute(interaction) {
        const user = interaction.options.getUser('user') || interaction.user;

        // هێنانی زانیاری تەواوی بەکارهێنەر بۆ دڵنیابوون لە بوونی باوەرەکە
        const fetchedUser = await interaction.client.users.fetch(user.id, {
            force: true,
        });

        const bannerURL = fetchedUser.bannerURL({
            size: 4096,
            dynamic: true,
        });

        if (!bannerURL) {
            return interaction.reply({ content: "❌ ئەم ئەندامە هیچ باوەرێکی (Banner) نییە.", ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setColor('#5865F2')
            .setTitle(`🖼️ باوەری پڕۆفایلی ${user.username}`)
            .setImage(bannerURL)
            .setFooter({
                text: `داواکراوە لەلایەن ${interaction.user.username}`,
                iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
            })
            .setTimestamp();

        await interaction.reply({
            embeds: [embed],
        });
    },
};
