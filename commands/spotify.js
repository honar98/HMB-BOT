const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('spotify')
        .setDescription('لێدانی پلەیلیستی کوردی لە سپۆتیفای لەگەڵ دوگمەی سکیپ بە بێ نامەی بێزارکەر'),
    async execute(interaction) {
        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) {
            return interaction.reply({ 
                content: '❌ تکایە سەرەتا سەر بکە ژوورەوە بۆ فۆیس چانڵێک!', 
                ephemeral: true 
            });
        }

        const playlistUrl = "https://open.spotify.com/playlist/2J4j4taiToWx601R48K057Si?si=Uv23mP1eRoK85_Dh1VJblQ";
        const playlistName = "Kurdish Music Brand New";

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
                .setTitle(`🎵 ${playlistName}`)
                .setDescription(`پلەیلیستەکە دەستی بە لێدان کرد لە فۆیس چانڵ!\n\n🔹 **دوگمەی سکیپ چالاکە** و بە بێ ناردنی هیچ نامەیەک گۆرانییەکان دەگۆڕێت بۆ گۆرانی داهاتوو.`)
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
                        // تەنها پەسەندکردنی کلیکەکە بێ ناردنی هیچ نامەیەک یان پەنجەرەیەک
                        await i.deferUpdate(); 
                    } catch (err) {
                        await i.reply({ content: '❌ ناتوانرێت سکیپ بکرێت.', ephemeral: true });
                    }
                }
            });

        } catch (error) {
            console.error(error);
            await interaction.editReply(`❌ هەڵەیەک ڕوودا لە لێدانی پلەیلیستەکە: ${error.message}`);
        }
    },
};
