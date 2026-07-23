const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove')
        .setDescription('دەرکردنی ئەندام لە تیکێت')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('ئەو ئەندامەی دەتەوێت لە تیکێت دەریبهێنیت')
                .setRequired(true)
        ),
    async execute(interaction) {
        if (!interaction.channel.name.startsWith('ticket-')) {
            return interaction.reply({ content: '❌ تکایە ئەم فەرمانە تەنها لە ناو چەنڵی تیکێتدا بەکاربێنە!', ephemeral: true });
        }

        const user = interaction.options.getUser('user');

        try {
            await interaction.channel.permissionOverwrites.delete(user);

            const embed = new EmbedBuilder()
                .setTitle('➖ دەرکردنی ئەندام لە تیکێت')
                .setDescription(`ئەندام ${user} لەم تیکێتە لابرا!`)
                .setColor('#E74C3C')
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: '❌ هەڵەیەک ڕوودا لە لابردنی ئەندامەکە.', ephemeral: true });
        }
    },
};
