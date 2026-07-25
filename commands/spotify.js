const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('spotify')
        .setDescription('گوێگرتن لە پلەیلیستی تایبەتی کوردی لە سپۆتیفای'),
    async execute(interaction) {
        const playlistName = "Kurdish Music Brand New";
        const playlistUrl = "https://open.spotify.com/playlist/2J4j4taiTOwxM60lR48KO5?si=uv23MpiERoK65_Dh1VJbiQ&utm_source=copy-link&pi=v-X0TlHGTmiGc";

        // دروستکردنی ڕووکاری جوان (Embed)
        const embed = new EmbedBuilder()
            .setColor('#1DB954') // رەنگی سپۆتیفای
            .setTitle(`🎵 ${playlistName}`)
            .setDescription(`کلیک لەسەر دوگمەی خوارەوە بکە یان لە لینکەکە بدە بۆ گوێگرتن بە خۆشترین گۆرانییە کوردییەکان!\n\n[${playlistName}](${playlistUrl})`)
            .setTimestamp();

        // دروستکردنی دوگمەی کارا بۆ کردنەوەی لینکەکە
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('گوێگرتن لە Spotify')
                    .setStyle(ButtonStyle.Link)
                    .setURL(playlistUrl)
            );

        await interaction.reply({ embeds: [embed], components: [row] });
    },
};
