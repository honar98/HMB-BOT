const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('بۆ پشکنینی خێرایی و پەیوەندی بۆت'),

    async execute(interaction) {
        const sent = await interaction.reply({ content: "🏓 Pinging...", fetchReply: true });

        const embed = new EmbedBuilder()
            .setColor("#5865F2")
            .setTitle("🏓 Pong!")
            .addFields(
                {
                    name: "Bot Latency",
                    value: `${sent.createdTimestamp - interaction.createdTimestamp} ms`,
                    inline: true,
                },
                {
                    name: "API Latency",
                    value: `${Math.round(interaction.client.ws.ping)} ms`,
                    inline: true,
                }
            )
            .setFooter({
                text: `Requested by ${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
            })
            .setTimestamp();

        await interaction.editReply({
            content: "",
            embeds: [embed],
        });
    },
};
