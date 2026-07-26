const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('spotify')
        .setDescription('لێدانی هەموو گۆرانییەکانی پلەیلیستی سپۆتیفای'),
    async execute(interaction) {
        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) {
            return interaction.reply({ 
                content: '❌ تکایە سەرەتا سەر بکە ژوورەوە بۆ فۆیس چانڵێک!', 
                ephemeral: true 
            });
        }

        const playlistUrl = "لێرە_لینکی_سپۆتیفای_دابنە";

        await interaction.deferReply();

        try {
            const player = interaction.client.player;
            await player.play(voiceChannel, playlistUrl, {
                nodeOptions: {
                    metadata: interaction.channel,
                    leaveOnEmpty: true,
                    leaveOnEnd: false,
                }
            });

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel('گوێگرتن لە Spotify')
                        .setStyle(ButtonStyle.Link)
                        .setURL(playlistUrl),
                    new ButtonBuilder()
                        .setCustomId('skip_song_btn')
                        .setLabel('⏭️ سکیپ (Skip)')
                        .setStyle(ButtonStyle.Secondary)
                );

            const embed = new EmbedBuilder()
                .setColor('#1DB954')
                .setTitle(`🎵 پلەیلیستی سپۆتیفای`)
                .setDescription(`پلەیلیستەکە دەستی بە لێدان کرد لە فۆیس چانڵ!\n\n🔹 **هەموو گۆرانییەکانی ناو لینکەکە خرانە نێو لیستەکەوە.**`);

            await interaction.editReply({ embeds: [embed], components: [row] });

        } catch (error) {
            console.error(error);
            await interaction.editReply(`❌ هەڵەیەک ڕوودا لە خوێندنەوەی پلەیلیستی سپۆتیفای.`);
        }
    },
};
