const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('پیشاندانی لیستی گۆرانییە چاوەڕوانکراوەکان (Queue)'),

    async execute(interaction) {
        const queue = interaction.client.player.nodes.get(interaction.guild.id);

        if (!queue || !queue.currentTrack) {
            return interaction.reply({ content: "❌ هیچ گۆرانییەک لە لیستی چاوەڕوانیدا (Queue) نییە.", ephemeral: true });
        }

        const tracks = queue.tracks.toArray();

        const embed = new EmbedBuilder()
            .setColor("#5865F2")
            .setTitle("🎵 لیستی گۆرانییە چاوەڕوانکراوەکان (Queue)")
            .setDescription(
                tracks.length
                    ? tracks
                          .slice(0, 10)
                          .map((track, index) =>
                              `**${index + 1}.** ${track.title}\n👤 ${track.author} • ⏱️ ${track.duration}`
                          )
                          .join("\n\n")
                    : "📭 هیچ گۆرانییەکی دیکە لە لیستی چاوەڕوانیدا نییە."
            )
            .addFields({
                name: "🎶 گۆرانی ئێستا (Now Playing)",
                value: `**${queue.currentTrack.title}**\n👤 ${queue.currentTrack.author} • ⏱️ ${queue.currentTrack.duration}`
            })
            .setFooter({
                text: `کۆی گشتی گۆرانییەکان: ${tracks.length + 1}`
            });

        return interaction.reply({
            embeds: [embed]
        });
    },
};
