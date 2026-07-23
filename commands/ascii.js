const { SlashCommandBuilder } = require('discord.js');
const figlet = require('figlet');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ascii')
        .setDescription('گۆڕینی دەق بۆ شێوازی تێکستی هونەری گەورە')
        .addStringOption(option =>
            option.setName('text')
                .setDescription('ئەو دەقەی دەتەوێت بیگۆڕیت (بە ئینگلیزی)')
                .setRequired(true)
        ),
    async execute(interaction) {
        const text = interaction.options.getString('text');

        if (text.length > 10) {
            return interaction.reply({ content: '❌ تکایە دەقێکی کورتتر بنووسە (کەمتر لە ١٠ پیت)!', ephemeral: true });
        }

        figlet(text, async function(err, data) {
            if (err) {
                return interaction.reply({ content: '❌ هەڵەیەک ڕوودا لە دروستکردنی دەقەکە.', ephemeral: true });
            }

            await interaction.reply(`\`\`\`${data}\`\`\``);
        });
    },
};
