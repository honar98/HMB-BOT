const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('پیشاندانی وێنەی پڕۆفایلی خۆت یان ئەندامێکی تر')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('ئەو ئەندامەی دەتەوێت وێنەکەی ببەین')
                .setRequired(false)
        ),

    async execute(interaction) {
        // ئەگەر کەسێکی تگ کردبوو، وێنەکەی دەهێنێت، ئەگەر نەخێر، وێنەی خۆی دەردەهێنێت
        const user = interaction.options.getUser('user') || interaction.user;

        const embed = new EmbedBuilder()
            .setColor('#5865F2')
            .setTitle(`🖼️ وێنەی پڕۆفایلی ${user.username}`)
            .setImage(user.displayAvatarURL({
                dynamic: true,
                size: 4096,
            }))
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
