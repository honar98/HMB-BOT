const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

// پێڕستی گۆرانییەکان بەپێی زمانەکان
const spotifySongs = {
    kurdish: [
        { label: 'گۆرانی کوردی ١ (خۆشەویستی)', value: 'kurdish_1', query: 'kurdish sad song' },
        { label: 'گۆرانی کوردی ٢ (شایی)', value: 'kurdish_2', query: 'kurdish dance song' }
    ],
    arabic: [
        { label: 'گۆرانی عەرەبی ١ (مۆدێرن)', value: 'arabic_1', query: 'arabic hit song' },
        { label: 'گۆرانی عەرەبی ٢ (هێمن)', value: 'arabic_2', query: 'arabic romantic song' }
    ],
    turkish: [
        { label: 'گۆرانی تورکی ١ (پۆپ)', value: 'turkish_1', query: 'turkish pop song' },
        { label: 'گۆرانی تورکی ٢ (کلاسیک)', value: 'turkish_2', query: 'turkish slow song' }
    ]
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('spotify')
        .setDescription('پەخشکردنی گۆرانییەکان لە ڕێگەی مینیوی سپۆتیفای (کوردی، عەرەبی، تورکی)'),

    async execute(interaction) {
        const vc = interaction.member.voice.channel;
        if (!vc) {
            return interaction.reply({ content: "❌ تکایە سەرەتا بچۆ ناو کەناڵێکی دەنگییەوە.", ephemeral: true });
        }

        // دروستکردنی مینیوی سەرەکی (هەڵبژاردنی زمان)
        const getMainEmbed = () => new EmbedBuilder()
            .setTitle('🎵 مینیوی گۆرانییەکان - Spotify')
            .setDescription('تکایە زمانێک لە خوارەوە هەڵبژێرە بۆ بینینی گۆرانییەکان:')
            .setColor('#1DB954');

        const getMainRow = () => new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('spotify_language_select')
                .setPlaceholder('زمانێک هەڵبژێرە...')
                .addOptions([
                    { label: 'کوردی (Kurdish)', description: 'پەخشکردنی گۆرانی کوردی', value: 'kurdish', emoji: ' Kurdish' },
                    { label: 'عەرەبی (Arabic)', description: 'پەخشکردنی گۆرانی عەرەبی', value: 'arabic', emoji: ' Arabic' },
                    { label: 'تورکی (Turkish)', description: 'پەخشکردنی گۆرانی تورکی', value: 'turkish', emoji: ' Turkish' }
                ])
        );

        await interaction.reply({ embeds: [getMainEmbed()], components: [getMainRow()], fetchReply: true });

        const filter = i => i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 120000 });

        collector.on('collect', async i => {
            try {
                if (i.customId === 'spotify_language_select') {
                    const lang = i.values[0];
                    const songs = spotifySongs[lang];

                    const langEmbed = new EmbedBuilder()
                        .setTitle(`🎵 گۆرانییەکان - ${lang.toUpperCase()}`)
                        .setDescription('تکایە گۆرانییەکی دیاریکراو هەڵبژێرە بۆ لێدان:')
                        .setColor('#1DB954');

                    const songSelect = new StringSelectMenuBuilder()
                        .setCustomId(`spotify_song_select_${lang}`)
                        .setPlaceholder('گۆرانییەک هەڵبژێرە...')
                        .addOptions(songs.map(s => ({ label: s.label, value: s.value })));

                    const backButton = new ButtonBuilder()
                        .setCustomId('spotify_main_menu')
                        .setLabel('گەڕانەوە بۆ بەشی سەرەکی')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('🏠');

                    const row1 = new ActionRowBuilder().addComponents(songSelect);
                    const row2 = new ActionRowBuilder().addComponents(backButton);

                    await i.update({ embeds: [langEmbed], components: [row1, row2] });
                }
                else if (i.customId.startsWith('spotify_song_select_')) {
                    const songValue = i.values[0];
                    let selectedQuery = '';

                    for (const langKey in spotifySongs) {
                        const found = spotifySongs[langKey].find(s => s.value === songValue);
                        if (found) {
                            selectedQuery = found.query;
                            break;
                        }
                    }

                    if (!selectedQuery) {
                        return i.reply({ content: "❌ گۆرانییەکە نەدۆزرایەوە.", ephemeral: true });
                    }

                    await i.update({ content: "⏳ خەریکی بارکردن و پەخشکردنی گۆرانییەکەم...", embeds: [], components: [] });

                    const player = interaction.client.player;
                    const { track } = await player.play(vc, selectedQuery, {
                        nodeOptions: {
                            metadata: interaction.channel,
                            leaveOnEmpty: true,
                            leaveOnEmptyCooldown: 30000,
                            selfDeaf: true
                        }
                    });

                    await i.editReply(`🎵 ئێستا دەنگپەخش کراوە: **${track.title}**`);
                }
                else if (i.customId === 'spotify_main_menu') {
                    await i.update({ embeds: [getMainEmbed()], components: [getMainRow()] });
                }
            } catch (error) {
                console.error(error);
                if (!i.replied && !i.deferred) {
                    await i.reply({ content: "❌ هەڵەیەک ڕوویدا لە کاتی جێبەجێکردندا.", ephemeral: true }).catch(() => {});
                } else {
                    await i.editReply({ content: "❌ هەڵەیەک ڕوویدا لە کاتی جێبەجێکردنی فەرمانەکە.", embeds: [], components: [] }).catch(() => {});
                }
            }
        });
    },
};
