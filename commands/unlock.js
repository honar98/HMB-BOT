const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unlock')
        .setDescription('کردنەوەی کەناڵەکە و ڕێگەدان بە ئەندامان بۆ نووسین')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async execute(interaction) {
        if (!interaction.guild) {
            return interaction.reply({ content: "❌ ئەم فەرمانە تەنها لەناو سێروەردا کاردەکات.", ephemeral: true });
        }

        try {
            await interaction.channel.permissionOverwrites.edit(
                interaction.guild.roles.everyone,
                {
                    SendMessages: null,
                }
            );

            const embed = new EmbedBuilder()
                .setColor("Green")
                .setTitle("🔓 Channel Unlocked")
                .setDescription(`This channel has been unlocked by ${interaction.user}.`)
                .setTimestamp();

            return interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error("Unlock Error:", error);
            return interaction.reply({
                content: "❌ هەڵەیەک ڕوویدا لە کردنەوەی کەناڵەکە.",
                ephemeral: true
            });
        }
    },
};
