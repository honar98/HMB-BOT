const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('لێدانی گۆرانی بە ناونیشان یان لینک')
        .addStringOption(option =>
            option.setName('song')
                .setDescription('ناوی گۆرانی یان لینکی یوتیوب')
                .setRequired(true)),

    async execute(interaction) {
        const vc = interaction.member.voice.channel;
        
        if (!vc) {
            return interaction.reply({ 
                content: "❌ تکایە سەرەتا بچۆ ناو کەناڵێکی دەنگییەوە.", 
                ephemeral: true 
            });
        }

        const query = interaction.options.getString('song');

        try {
            await interaction.deferReply();

            const player = interaction.client.player;
            
            const res = await player.play(vc, query, {
                nodeOptions: {
                    metadata: interaction.channel,
                    leaveOnEmpty: false,
                    leaveOnEnd: false,
                    selfDeaf: true
                }
            });

            const track = res.track || (res.playlist ? res.playlist.tracks[0] : null);

            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('🎵 دەنگپەخشکرا')
                .setDescription(`🎶 ئێستا دەنگپەخش کراوە: **${track ? track.title : query}**`);

            await interaction.editReply({ embeds: [embed] });
        } catch (e) {
            console.error(e);
            
            const errorMsg = "❌ هەڵەیەک ڕوویدا لە کاتی پەخشکردنی گۆرانییەکە. دڵنیا ببەوە لەوەی لینکەکە یان ناوەکە ڕاست بێت.";
            
            if (interaction.deferred || interaction.replied) {
                await interaction.editReply(errorMsg);
            } else {
                await interaction.reply({ content: errorMsg, ephemeral: true });
            }
        }
    },
};
