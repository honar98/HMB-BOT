const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('control')
        .setDescription('تابلۆی کۆنتڕۆڵی پێشکەوتووی موزیک v2026'),
    
    async execute(interaction) {
        const player = interaction.client.player;
        const queue = player.nodes.get(interaction.guildId);

        const currentTrack = queue && queue.isPlaying() ? queue.currentTrack : null;

        const embed = new EmbedBuilder()
            .setColor('#2F3136')
            .setDescription(currentTrack 
                ? `🎶 **${currentTrack.title}** \`(${currentTrack.duration})\`` 
                : '❌ **هیچ گۆرانییەک لە ئێستادا کار ناکات.**');

        const row1 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('back_music')
                    .setLabel('پێشوو')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('pause_resume')
                    .setLabel('وەستان/لێدان')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('skip_music')
                    .setLabel('سکیپ')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('stop_music')
                    .setLabel('لابردن')
                    .setStyle(ButtonStyle.Secondary)
            );

        const row2 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('queue_music')
                    .setLabel('لیست')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('lyrics_music')
                    .setLabel('تێکست')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('add_playlist')
                    .setLabel('زیادکردن')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('search_music')
                    .setLabel('گەڕان')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('shuffle_music')
                    .setLabel('تێکەڵ')
                    .setStyle(ButtonStyle.Secondary)
            );

        const row3 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('like_music')
                    .setLabel('دڵخواز')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('volume_down')
                    .setLabel('دەنگی کەم')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('volume_up')
                    .setLabel('دەنگی بەرز')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('filter_music')
                    .setLabel('فیلتەر')
                    .setStyle(ButtonStyle.Secondary)
            );

        const row4 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('favorites_library')
                    .setLabel('ئایتمەکان')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('history_library')
                    .setLabel('مێژوو')
                    .setStyle(ButtonStyle.Secondary)
            );

        await interaction.reply({
            embeds: [embed],
            components: [row1, row2, row3, row4],
            ephemeral: false
        });
    },
};
