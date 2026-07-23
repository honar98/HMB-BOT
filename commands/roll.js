const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roll')
        .setDescription('هەڵدانی زاری (Dice) بۆ دەرکردنی ژمارەیەکی هەڕەمەکی')
        .addIntegerOption(option =>
            option.setName('max')
                .setDescription('گەورەترین ژمارە (بەتەواوی 6 دیاری کراوە ئەگەر بەتاڵی دابنێیت)')
                .setRequired(false)
        ),
    async execute(interaction) {
        const max = interaction.options.getInteger('max') || 6;
        const result = Math.floor(Math.random() * max) + 1;

        const embed = new EmbedBuilder()
            .setTitle('🎲 زاری یاری (Dice Roll)')
            .setDescription(`زارەکە هەڵدرا لە نێوان \`1\` تا \`${max}\`:\n\n✨ **ئەنجام:** \`${result}\``)
            .setColor('#9B59B6')
            .setTimestamp()
            .setFooter({ text: `داواکراوە لەلایەن ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });

        await interaction.reply({ embeds: [embed] });
    },
};
