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

        // ڕیزبەندی یەکەم: Playback (پێشوو، لێدان/وەستان، داهاتوو، وەستاندن)
        const row1 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('back_music')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('⏮️'),
                new ButtonBuilder()
                    .setCustomId('pause_resume')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('▶️'),
                new ButtonBuilder()
                    .setCustomId('skip_music')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('⏭️'),
                new ButtonBuilder()
                    .setCustomId('stop_music')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('✖️')
            );

        // ڕیزبەندی دووەم: Music Actions (لیستی چاوەڕوانی، گۆرانی لێدراو، زیادکردن، گەڕان، تێکەڵ)
        const row2 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('queue_music')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('☰'),
                new ButtonBuilder()
                    .setCustomId('lyrics_music')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('🎵'),
                new ButtonBuilder()
                    .setCustomId('add_playlist')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('➕'),
                new ButtonBuilder()
                    .setCustomId('search_music')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('🔍'),
                new ButtonBuilder()
                    .setCustomId('shuffle_music')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('🔀')
            );

        // ڕیزبەندی سێیەم: Controls (لایکی گۆرانی، دەنگ بەرزکردنەوە، کەمکردنەوە، فیلتەر)
        const row3 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('like_music')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('🤍'),
                new ButtonBuilder()
                    .setCustomId('volume_down')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('🔉'),
                new ButtonBuilder()
                    .setCustomId('volume_up')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('🔊'),
                new ButtonBuilder()
                    .setCustomId('filter_music')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('🎛️')
            );

        // ڕیزبەندی چوارەم: Library (دڵخوازەکان، مێژوو)
        const row4 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('favorites_library')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('❤️'),
                new ButtonBuilder()
                    .setCustomId('history_library')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('🕒')
            );

        await interaction.reply({
            embeds: [embed],
            components: [row1, row2, row3, row4],
            ephemeral: false
        });
    },
};
