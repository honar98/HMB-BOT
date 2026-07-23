const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('join')
        .setDescription('هێنانی بۆت بۆ کەناڵی دەنگییەکەت'),

    async execute(interaction) {
        const vc = interaction.member.voice.channel;
        
        if (!vc) {
            return interaction.reply({ 
                content: "❌ تکایە سەرەتا بچۆ ناو کەناڵێکی دەنگییەوە.", 
                ephemeral: true 
            });
        }

        try {
            // چونکە ڕەنگە هێنانی مۆسیقاکە کەمێک بخایەنێت، سڵاوەکە دوا دەخەین (Defer)
            await interaction.deferReply();

            await interaction.client.player.play(vc, "https://www.youtube.com/watch?v=dQw4w9WgXcQ", {
                nodeOptions: {
                    metadata: interaction.channel,
                },
            });

            await interaction.editReply("✅ بۆتەکە هاتە ناو کەناڵی دەنگییەکەت!");
        } catch (e) {
            console.error(e);
            
            const errorMsg = "❌ " + (e.message || "هەڵەیەک ڕوویدا لە کاتی پەیوەندیکردن بە کەناڵەکەوە.");
            
            if (interaction.deferred || interaction.replied) {
                await interaction.editReply(errorMsg);
            } else {
                await interaction.reply({ content: errorMsg, ephemeral: true });
            }
        }
    },
};
