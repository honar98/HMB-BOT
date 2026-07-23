const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("لێدانی گۆرانی لە یوتیوب")
        .addStringOption(option =>
            option.setName("song")
                .setDescription("ناوی گۆرانی یان لینکی یوتیوب")
                .setRequired(true)
        ),

    async execute(interaction) {
        // یەکەم کار ئەوەیە خێرا defer بکەین تا دیسکۆرد کات نەبڕێت
        await interaction.deferReply();

        const voiceChannel = interaction.member.voice.channel;

        if (!voiceChannel) {
            return interaction.editReply({ content: "❌ پێویستە سەرەتا بچیتە Voice Channel." });
        }

        const query = interaction.options.getString("song");

        try {
            const player = interaction.client.player;

            const { track } = await player.play(voiceChannel, query, {
                nodeOptions: {
                    metadata: {
                        channel: interaction.channel
                    },
                    leaveOnEmpty: true,
                    leaveOnEmptyCooldown: 300000,
                    leaveOnEnd: true,
                    leaveOnEndCooldown: 60000,
                    bufferingTimeout: 15000,
                    volume: 80
                }
            });

            return interaction.editReply({
                content:
                    `🎵 **Now Playing**\n\n` +
                    `**${track.title}**\n` +
                    `👤 ${track.author}\n` +
                    `⏱️ ${track.duration}`
            });

        } catch (error) {
            console.error("Music command error:", error);
            return interaction.editReply({
                content: "❌ هەڵەیەک ڕوویدا لە کاتی پەخشکردنی گۆرانی."
            });
        }
    }
};
