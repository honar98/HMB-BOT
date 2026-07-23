const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('close')
        .setDescription('داخستنی تیکێتەکە لەلایەن ستافەوە'),
    async execute(interaction) {
        // پشکنین بۆ ئەوەی دڵنیابین لەوەی لە چەنڵی تیکێتدا بەکاردێت
        if (!interaction.channel.name.startsWith('ticket-')) {
            return interaction.reply({ content: '❌ تکایە ئەم فەرمانە تەنها لە ناو چەنڵی تیکێتدا بەکاربێنە!', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setTitle('🔒 داخستنی تیکێت')
            .setDescription('ئەم تیکێتە لەلایەن **' + interaction.user.tag + '**ـەوە دادەخرێت و پاش چەند چرکەیەک סڕدەوە دەبێت.')
            .setColor('#E74C3C')
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });

        // سڕینەوەی چەنڵەکە دوای 5 چرکە
        setTimeout(async () => {
            try {
                await interaction.channel.delete();
            } catch (err) {
                console.error("Error deleting channel: ", err);
            }
        }, 5000);
    },
};
