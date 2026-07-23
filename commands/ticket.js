const {
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    PermissionFlagsBits
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ticket")
        .setDescription("ناردنی پەناڵی دروستکردنی تکێت (Ticket Panel)")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild), // دەتوانیت ئەمە لابەیت ئەگەر دەتەوێت هەموو کەسێک بەکاریبهێنێت

    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor("#5865F2")
            .setTitle("🎫 HMB BOT Ticket System")
            .setDescription("Click the button below to create your support ticket.")
            .setFooter({ text: "HMB BOT" });

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("create_ticket")
                .setLabel("Create Ticket")
                .setEmoji("🎫")
                .setStyle(ButtonStyle.Primary)
        );

        await interaction.reply({
            embeds: [embed],
            components: [row],
        });
    },
};
