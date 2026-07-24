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
            await interaction.deferReply();

            // دروستکردنی کویو یان پەیوەندیکردن بە کەناڵەکەوە بێ ئەوەی ناچار بێت شتێک لێبدات
            let queue = interaction.client.player.nodes.get(interaction.guild.id);
            if (!queue) {
                queue = interaction.client.player.nodes.create(interaction.guild, {
                    metadata: interaction.channel
                });
            }

            if (!queue.connection) {
                await queue.connect(vc);
            }

            await interaction.editReply("✅ بۆتەکە بە سەرکەوتوویی هاتە ناو کەناڵی دەنگییەکەت!");
        } catch (e) {
            console.error(e);
            
            const errorMsg = "❌ هەڵەیەک ڕوویدا لە کاتی هێنانی بۆت بۆ کەناڵەکە.";
            
            if (interaction.deferred || interaction.replied) {
                await interaction.editReply(errorMsg);
            } else {
                await interaction.reply({ content: errorMsg, ephemeral: true });
            }
        }
    },
};
