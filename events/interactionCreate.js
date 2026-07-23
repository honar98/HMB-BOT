const { Events } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isStringSelectMenu()) return;

        if (interaction.customId === 'help-menu') {
            const selected = interaction.values[0];
            
            if (selected === 'music') {
                await interaction.reply({ content: "🎵 فەرمانەکانی مۆسیقا لێرە دەبن.", ephemeral: true });
            } else if (selected === 'ticket') {
                await interaction.reply({ content: "🎫 سیستەمی تیکێت لێرە دەبێت.", ephemeral: true });
            } else if (selected === 'giveaway') {
                await interaction.reply({ content: "🎉 مسابقە و گیڤوەی لێرە دەبن.", ephemeral: true });
            } else if (selected === 'moderation') {
                await interaction.reply({ content: "🛡️ فەرمانەکانی مۆدێراشن لێرە دەبن.", ephemeral: true });
            } else if (selected === 'utility') {
                await interaction.reply({ content: "⚙️ فەرمانە گشتییەکان لێرە دەبن.", ephemeral: true });
            } else if (selected === 'admin') {
                await interaction.reply({ content: "👑 فەرمانەکانی ئادمین لێرە دەبن.", ephemeral: true });
            } else if (selected === 'info') {
                await interaction.reply({ content: "ℹ️ زانیارییەکان لێرە دەبن.", ephemeral: true });
            }
        }
    },
};
