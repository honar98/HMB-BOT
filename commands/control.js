const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('control')
        .setDescription('کردنەوەی تابلۆی پێشکەوتووی کۆنتڕۆڵی موزیک v2026'),
    
    async execute(interaction) {
        const player = interaction.client.player;
        const queue = player.nodes.get(interaction.guildId);

        const currentTrack = queue && queue.isPlaying() ? queue.currentTrack : null;

        const embed = new EmbedBuilder()
            .setColor(currentTrack ? '#00FFFF' : '#FF0055')
            .setTitle('🎶 HMB MUSIC CONTROL CENTER v2026')
            .setDescription(currentTrack 
                ? `╭──────────────────────╮\n🎵 **ئێستا لێدەدرێت:**\n[${currentTrack.title}](${currentTrack.url})\n\n👤 **گۆرانیبێژ:** \`${currentTrack.author}\`\n⏱️ **ماوە:** \`${currentTrack.duration}\`\n╰──────────────────────╯` 
                : '╭──────────────────────╮\n❌ **هیچ گۆرانییەک کار ناکات!**\n\n🔹 تکایە دوگمەی خوارەوە بەکاربهێنە بۆ گەڕان و لێدانی گۆرانی لە:\n✨ **[ YouTube • Spotify • TikTok ]**\n╰──────────────────────╯')
            .setThumbnail(currentTrack ? currentTrack.thumbnail : 'https://i.imgur.com/492b3py.png')
            .addFields(
                { name: '🌐 دۆخی سیستەم', value: '`🟢 Online (2026 Ready)`', inline: true },
                { name: '🎛️ بەکارهێنەر', value: `\`${interaction.user.username}\``, inline: true }
            )
            .setTimestamp()
            .setFooter({ text: 'HMB Bot • Advanced Music System', iconURL: interaction.client.user.displayAvatarURL() });

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
                    .setLabel('گەڕان (YouTube, Spotify, TikTok)')
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
