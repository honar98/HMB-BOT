const cache = require("../utils/searchCache");

module.exports = (client) => {
    client.on("interactionCreate", async (interaction) => {
        if (!interaction.isStringSelectMenu()) return;
        if (interaction.customId !== "music-search") return;

        const tracks = cache.get(interaction.user.id);

        if (!tracks) {
            return interaction.reply({
                content: "❌ ئەنجامی گەڕان کۆتایی هاتووە، دووبارە $search بەکاربهێنە.",
                ephemeral: true
            });
        }

        const track = tracks[parseInt(interaction.values[0])];

        if (!track) {
            return interaction.reply({
                content: "❌ گۆرانی نەدۆزرایەوە.",
                ephemeral: true
            });
        }

        const voiceChannel = interaction.member.voice.channel;

        if (!voiceChannel) {
            return interaction.reply({
                content: "❌ سەرەتا بچۆ ناو Voice Channel.",
                ephemeral: true
            });
        }

        try {
            await client.player.play(voiceChannel, track, {
                nodeOptions: {
                    metadata: interaction.channel
                }
            });

            await interaction.update({
                content: `🎵 **${track.title}** پەخش دەکرێت.`,
                embeds: [],
                components: []
            });

            cache.delete(interaction.user.id);

        } catch (err) {
            console.error(err);

            await interaction.reply({
                content: "❌ هەڵەیەک ڕوویدا.",
                ephemeral: true
            });
        }
    });
};
