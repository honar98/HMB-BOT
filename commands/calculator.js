const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('calculator')
        .setDescription('ئەنجامدانی ژمێرکاری (پێویستە هاوکێشەکە بنووسیت)')
        .addStringOption(option =>
            option.setName('expression')
                .setDescription('نموونە: 5+5 یان 10*2 یان 50/2')
                .setRequired(true)
        ),
    async execute(interaction) {
        const expression = interaction.options.getString('expression');
        
        try {
            // تەنها پیت و ژمارە و هێما دروستەکان قەبووڵ دەکات بۆ سەلامەتی
            if (!/^[\d+\-*/().\s]+$/.test(expression)) {
                return interaction.reply({ content: '❌ تکایە تەنها هێمای دروستی ژمێرکاری بەکاربێنە!', ephemeral: true });
            }

            const result = eval(expression);

            const embed = new EmbedBuilder()
                .setTitle('🔢 ژمێرەر (Calculator)')
                .setDescription(`• **هاوکێشە:** \`${expression}\`\n• **ئەنجام:** \`${result}\``)
                .setColor('#2ECC71')
                .setTimestamp()
                .setFooter({ text: `داواکراوە لەلایەن ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            await interaction.reply({ content: '❌ هەڵەیەک لە هاوکێشەکەدا هەیە، تکایە دڵنیابەرەوە.', ephemeral: true });
        }
    },
};
