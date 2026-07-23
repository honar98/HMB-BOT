const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roles')
        .setDescription('پیشاندانی لیستی رۆڵەکانی خۆت یان ئەندامێکی تر لە سێروەردا')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('ئەو ئەندامەی دەتەوێت رۆڵەکانی ببەیت (بە بەتاڵی هی خۆت پیشان دەدات)')
                .setRequired(false)
        ),

    async execute(interaction) {
        const targetMember = interaction.options.getMember('user') || interaction.member;
        const guild = interaction.guild;

        const roles = targetMember.roles.cache
            .filter(role => role.id !== guild.id)
            .sort((a, b) => b.position - a.position)
            .map(role => `• ${role}`)
            .join("\n") || "هیچ رۆڵێکی نییە";

        const embed = new EmbedBuilder()
            .setColor("#5865F2")
            .setTitle("🎭 رۆڵەکانی ئەندام")
            .setThumbnail(targetMember.user.displayAvatarURL({ dynamic: true }))
            .addFields(
                {
                    name: "👤 بەکارهێنەر",
                    value: targetMember.user.tag,
                    inline: true,
                },
                {
                    name: "📊 کۆی گشتی رۆڵەکان",
                    value: `${targetMember.roles.cache.size - 1}`,
                    inline: true,
                },
                {
                    name: "📋 لیستی رۆڵەکان",
                    value: roles.length > 1024
                        ? roles.slice(0, 1020) + "..."
                        : roles,
                }
            )
            .setTimestamp();

        return interaction.reply({
            embeds: [embed],
        });
    },
};
