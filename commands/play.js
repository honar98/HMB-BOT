const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('spotify')
        .setDescription('لێدانی گۆرانی یان پلەیلیستی سپۆتیفای بە لینک')
        .addStringOption(option =>
            option.setName('link')
                .setDescription('لینکی گۆرانی یان پلەیلیستی سپۆتیفای')
                .setRequired(true)),

    async execute(interaction) {
        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) {
            return interaction.reply({ 
                content: '❌ تکایە سەرەتا بچۆ ناو فۆیس چانڵێکەوە!', 
                ephemeral: true 
            });
        }

        const playlistUrl = interaction.options.getString('link');

        await interaction.deferReply();

        try {
            const player = interaction.client.player;
            const { track } = await player.play(voiceChannel, playlistUrl, {
                nodeOptions: {
                    metadata: interaction.channel,
                    leaveOnEmpty: false,
                    leaveOnEnd: false,
                    selfDeaf: true
                }
            });

            const embed = new EmbedBuilder()
                .setColor('#1DB954')
                .setTitle(`🎵 سپۆتیفای`)
                .setDescription(`🎶 ئێستا دەنگپەخش کراوە: **${track.title}**`);

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            await interaction.editReply(`❌ هەڵەیەک ڕوودا لە خوێندنەوەی لینکی سپۆتیفای.`);
        }
    },
};
