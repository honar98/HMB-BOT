const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('spotify')
        .setDescription('لێدانی هەموو گۆرانییەکانی پلەیلیستی سپۆتیفای بە یەک فەرمان'),
    async execute(interaction) {
        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) {
            return interaction.reply({ 
                content: '❌ تکایە سەرەتا سەر بکە ژوورەوە بۆ فۆیس چانڵێک!', 
                ephemeral: true 
            });
        }

        const playlistUrl = "https://open.spotify.com/playlist/2J4j4taiTOwxM60lR48KO5?si=8RIHYcJaRnSiMBObAsh8Kw&utm_source=copy-link&pi=W9rDrtlfT3qyx";

        await interaction.deferReply();

        try {
            const player = interaction.client.player;
            
            await player.play(voiceChannel, playlistUrl, {
                nodeOptions: {
                    metadata: interaction.channel,
                    leaveOnEmpty: true,
                    leaveOnEnd: false,
                    selfDeaf: true
                }
            });

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel('گوێگرتن لە Spotify')
                        .setStyle(ButtonStyle.Link)
                        .setURL(playlistUrl)
                );

            const embed = new EmbedBuilder()
                .setColor('#1DB954')
                .setTitle(`🎵 پلەیلیستی سپۆتیفای`)
                .setDescription(`پلەیلیستەکە دەستی بە لێدان کرد لە فۆیس چانڵ!\n\n🔹 **هەموو گۆرانییەکانی ناو لینکەکە خرانە نێو لیستەکەوە.**`)
                .setTimestamp();

            await interaction.editReply({ embeds: [embed], components: [row] });

        } catch (error) {
            console.error(error);
            await interaction.editReply(`❌ هەڵەیەک ڕوودا: نەتوانرا پلەیلیستەکە بخوێنرێتەوە. دڵنیابە لەوەی پاکێجی سپۆتیفای لە بۆتەکەدا کارا کراوە.`);
        }
    },
};
