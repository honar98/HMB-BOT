const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('بێدەنگکردنی ئەندامێک (Timeout) بۆ ماوەی 10 خولەک')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('ئەو ئەندامەی دەتەوێت بیبەیتە تایماوت')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('هۆکاری بێدەنگکردنەکە')
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'هیچ هۆکارێک نەنووسراوە';

        const member = await interaction.guild.members.fetch(user.id).catch(() => null);

        if (!member) {
            return interaction.reply({ content: "❌ ئەم ئەندامە لە سێروەرەکەدا نییە یان نەدۆزرایەوە.", ephemeral: true });
        }

        try {
            // ماوەی 10 خولەک بە ملیۆن چرکە
            const duration = 10 * 60 * 1000;
            await member.timeout(duration, reason);

            return interaction.reply({
                content: `🔇 بە سەرکەوتوویی **${user.tag}** بێدەنگکرا بۆ ماوەی 10 خولەک.\n📝 هۆکار: ${reason}`
            });
        } catch (err) {
            console.error(err);
            return interaction.reply({ content: "❌ سەرکەوتوو نەبوو لە بێدەنگکردنی ئەندامەکە.", ephemeral: true });
        }
    },
};
