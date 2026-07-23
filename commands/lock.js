const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lock')
        .setDescription('قەفڵکردنی کەناڵی ئێستا بۆ ئەوەی ئەندامان نەتوانن نامە بنێرن')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async execute(interaction) {
        if (!interaction.guild) {
            return interaction.reply({ content: "❌ ئەم فەرمانە تەنها لە ناو سێروەردا کار دەکات.", ephemeral: true });
        }

        await interaction.channel.permissionOverwrites.edit(
            interaction.guild.roles.everyone,
            {
                SendMessages: false,
            }
        );

        const embed = new EmbedBuilder()
            .setColor("Red")
            .setTitle("🔒 کەناڵ قەفڵکرا")
            .setDescription(
                `ئەم کەناڵە قەفڵکرا لەلایەن ${interaction.user}.`
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
