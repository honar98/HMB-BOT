const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');

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

        // لینکی جێگیرکراوی پلەیلیستەکەت لێرەدا دانراوە
        const playlistUrl = "https://open.spotify.com/playlist/2J4j4taiTOwxM60lR48KO5?si=8RIHYcJaRnSiMBObAsh8Kw&utm_source=copy-link&pi=W9rDrtlfT3qyx";

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
                .setDescription(`پلەیلیستەکە دەستی بە لێدان کرد لە فۆیس چانڵ!\n\n🔹 **هەموو گۆرانییەکانی ناو لینکەکە خرانە نێو لیستەکەوە.**\n🔹 **دوگمەی سکیپ چالاکە** و بە بێ ناردنی هیچ نامەیەک گۆرانییەکان دەگۆڕێت.`)
                .setTimestamp();

            const message = await interaction.editReply({ embeds: [embed], components: [row] });

            const collector = message.createMessageComponentCollector({ 
                componentType: ComponentType.Button, 
                time: 3600000 
            });

            collector.on('collect', async i => {
                if (i.customId === 'skip_song_btn') {
                    const queue = player.nodes.get(interaction.guildId);
                    if (!queue || !queue.isPlaying()) {
                        return i.reply({ content: '❌ هیچ گۆرانییەک لە لیستدا نییە بۆ سکیپ کردن!', ephemeral: true });
                    }
                    try {
                        queue.node.skip();
                        await i.deferUpdate(); 
                    } catch (err) {
                        await i.reply({ content: '❌ ناتوانرێت سکیپ بکرێت.', ephemeral: true });
                    }
                }
            });

        } catch (error) {
            console.error(error);
            await interaction.editReply(`❌ هەڵەیەک ڕوودا: نەتوانرا پلەیلیستەکە بخوێنرێتەوە. دڵنیابە لەوەی پاکێجی سپۆتیفای لە بۆتەکەدا کارا کراوە.`);
        }
    },
};
