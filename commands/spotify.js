const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('spotify')
        .setDescription('لێدانی پلەیلیستی سپۆتیفای لەگەڵ دوگمەی سکیپ لە هەمان مێنودا'),
    async execute(interaction, client) {
        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) {
            return interaction.reply({ 
                content: '❌ تکایە سەرەتا سەر بکە ژوورەوە بۆ فۆیس چانڵێک!', 
                ephemeral: true 
            });
        }

        const playlistUrl = "https://open.spotify.com/playlist/2J4j4taiTOwxM60lR48KO5?si=uv23MpiERoK65_Dh1VJbiQ&utm_source=copy-link&pi=v-X0TlHGTmiGc";
        const playlistName = "Kurdish Music Brand New";

        await interaction.deferReply();

        try {
            await client.distube.play(voiceChannel, playlistUrl, {
                textChannel: interaction.channel,
                member: interaction.member,
            });

            // دروستکردنی دوگمەی لینک و دوگمەی سکیپ لە یەک ڕیزدا
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
                .setDescription(`پلەیلیستەکە دەستی بە لێدان کرد لە فۆیس چانڵ!\nدەتوانیت دوگمەی خوارەوە بۆ سکیپ کردنی گۆرانییەکان بەکاربهێنیت.`)
                .setTimestamp();

            const message = await interaction.editReply({ embeds: [embed], components: [row] });

            // کۆلێکتۆر بۆ کارپێکردنی دوگمەی سکیپ لە هەمان پەیامدا
            const collector = message.createMessageComponentCollector({ 
                componentType: ComponentType.Button, 
                time: 3600000 
            });

            collector.on('collect', async i => {
                if (i.customId === 'skip_song_btn') {
                    const queue = client.distube.getQueue(interaction.guildId);
                    if (!queue) {
                        return i.reply({ content: '❌ هیچ گۆرانییەک لە لیستدا نییە بۆ سکیپ کردن!', ephemeral: true });
                    }
                    try {
                        await client.distube.skip(interaction.guildId);
                        await i.reply({ content: '⏭️ **بە سەرکەوتوویی سکیپ کرا!** گواستراوەوە بۆ گۆرانی داهاتوو.', ephemeral: true });
                    } catch (err) {
                        await i.reply({ content: '❌ ناتوانرێت سکیپ بکرێت (ئەمە کۆتا گۆرانییە).', ephemeral: true });
                    }
                }
            });

        } catch (error) {
            console.error(error);
            await interaction.editReply(`❌ هەڵەیەک ڕوودا لە لێدانی مۆسیقاکە: ${error.message}`);
        }
    },
};
