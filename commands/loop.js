const { SlashCommandBuilder } = require('discord.js');
const { QueueRepeatMode } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('loop')
        .setDescription('گۆڕینی دۆخی دووبارەکردنەوەی گۆرانی (Loop Mode)'),

    async execute(interaction) {
        const queue = interaction.client.player.nodes.get(interaction.guild.id);

        if (!queue || !queue.currentTrack) {
            return interaction.reply({ content: "❌ هیچ گۆرانییەک لە ئێستادا پەخش ناکرێت.", ephemeral: true });
        }

        const currentMode = queue.repeatMode;

        if (currentMode === QueueRepeatMode.OFF) {
            queue.setRepeatMode(QueueRepeatMode.TRACK);
            return interaction.reply("🔂 دۆخی دووبارەکردنەوە: **گۆرانی ئێستا (Track)**");
        }

        if (currentMode === QueueRepeatMode.TRACK) {
            queue.setRepeatMode(QueueRepeatMode.QUEUE);
            return interaction.reply("🔁 دۆخی دووبارەکردنەوە: **لیستی گۆرانییەکان (Queue)**");
        }

        queue.setRepeatMode(QueueRepeatMode.OFF);
        return interaction.reply("➡️ دۆخی دووبارەکردنەوە: **داخراو (Off)**");
    },
};
