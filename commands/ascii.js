const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const figlet = require('figlet');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ascii')
        .setDescription('گۆڕینی دەقی ئینگلیزی بۆ شێوازی ئەسکی ئاررت (ASCII Art)')
        .addStringOption(option =>
            option.setName('text')
                .setDescription('ئەو دەقەی دەتهەوێت بیگۆڕیت (بە ئینگلیزی)')
                .setRequired(true)),

    async execute(interaction) {
        const text = interaction.options.getString('text');

        // پشکنین بۆ درێژی دەقەکە بۆ ئەوەی ناشیرین نەبێت
        if (text.length > 20) {
            return interaction.reply({
                content: '❌ **ببوورە:** تکایە دەقێکی کورتتر بنووسە (کەمتر لە ٢٠ پیت) تاوەکو شێوازەکەی تێکنەچێت.',
                ephemeral: true
            });
        }

        figlet(text, async function(err, data) {
            if (err) {
                return interaction.reply({
                    content: '❌ هەڵەیەک ڕوویدا لە دروستکردنی دەقەکە.',
                    ephemeral: true
                });
            }

            const embed = new EmbedBuilder()
                .setColor('#2b2d31')
                .setTitle('✨ ASCII Art Generator')
                .setDescription(`\`\`\`text\n${data}\`\`\``)
                .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        });
    },
};
