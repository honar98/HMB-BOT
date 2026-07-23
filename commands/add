const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add')
        .setDescription('زیادکردنی ئەندام بۆ ناو تیکێت')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('ئەو ئەندامەی دەتەوێت زیادی بکەیت بۆ تیکێت')
                .setRequired(true)
        ),
    async execute(interaction) {
        if (!interaction.channel.name.startsWith('ticket-')) {
            return interaction.reply({ content: '❌ تکایە ئەم فەرمانە تەنها لە ناو چەنڵی تیکێتدا بەکاربێنە!', ephemeral: true });
        }

        const user = interaction.options.getUser('user');

        try {
            await interaction.channel.permissionOverwrites.create(user, {
                ViewChannel: true,
                SendMessages: true,
                ReadMessageHistory: true
            });

            const embed = new EmbedBuilder()
                .setTitle('➕ زیادکردنی ئەندام بۆ تیکێت')
                .setDescription(`سەرکەوتووانە ئەندام ${user} بۆ ئەم تیکێتە زیادکرا!`)
                .setColor('#2ECC71')
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: '❌ هەڵەیەک ڕوودا لە زیادکردنی ئەندامەکە.', ephemeral: true });
        }
    },
};
