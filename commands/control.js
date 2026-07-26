const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('control')
        .setDescription('کردنەوەی تابلۆی پێشکەوتووی کۆنتڕۆڵی موزیک'),
    
    async execute(interaction) {
        const player = interaction.client.player;
        const queue = player.nodes.get(interaction.guildId);

        const currentTrack = queue && queue.isPlaying() ? queue.currentTrack : null;

        const embed = new EmbedBuilder()
            .setColor(currentTrack ? '#1DB954' : '#FF0000')
            .setTitle('🎵 تابلۆی کۆنتڕۆڵی موزیک (HMB Music)')
            .setDescription(currentTrack 
                ? `🎶 **ئێستا لێدەدرێت:**\n[${currentTrack.title}](${currentTrack.url})\n\n👤 **گۆرانیبێژ:** ${currentTrack.author}\n⏱️ **ماوە:** ${currentTrack.duration}` 
                : '❌ هیچ گۆرانییەک لە ئێستادا کار ناکات.\n\nتکایە دوگمەی گەڕان بەکاربهێنە یان فەمانی `/play` بنووسە.')
            .setThumbnail(currentTrack ? currentTrack.thumbnail : null)
            .setFooter({ text: `داواکراوە لەلایەن: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });

        const row1 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('pause_resume')
                    .setLabel('وەستان / لێدان')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('⏯️'),
                new ButtonBuilder()
                    .setCustomId('skip_music')
                    .setLabel('سکیپ')
                    .setStyle(ButtonStyle.Success)
                    .setEmoji('⏭️'),
                new ButtonBuilder()
                    .setCustomId('stop_music')
                    .setLabel('وەستاندن')
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji('⏹️')
            );

        const row2 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('search_music')
                    .setLabel('گەڕانی گۆرانی')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('🔍'),
                new ButtonBuilder()
                    .setCustomId('queue_music')
                    .setLabel('لیستی چاوەڕوانی')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('📜')
            );

        await interaction.reply({
            embeds: [embed],
            components: [row1, row2],
            ephemeral: false
        });
    },
};
