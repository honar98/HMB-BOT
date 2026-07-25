const { SlashCommandBuilder } = require('discord.js');

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
            
            // گەڕان و پەخشکردن بە شێوازێکی مۆدێرن و گونجاو لەگەڵ ڤێرژنی نوێ
            const { track } = await player.play(vc, query, {
                nodeOptions: {
                    metadata: interaction.channel,
                    leaveOnEmpty: false,      // کاتێک کەناڵەکە بەتاڵ دەبێت نەیەتە دەرەوە
                    leaveOnEnd: false,        // کاتێک پلەیلیست یان گۆرانی تەواو دەبێت نەیەتە دەرەوە
                    selfDeaf: true
                }
            });

            await interaction.editReply(`🎵 ئێستا دەنگپەخش کراوە: **${track.title}**`);
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
