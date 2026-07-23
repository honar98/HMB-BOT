const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('لابردنی باند (Unban) لە بەکارهێنەرێک لەڕێگەی ئایدییەکەیەوە')
        .addStringOption(option =>
            option.setName('userid')
                .setDescription('ئایدی (ID) ئەو کەسەی دەتەوێت بانی لابەیت')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async execute(interaction) {
        if (!interaction.guild) {
            return interaction.reply({ content: "❌ ئەم فەرمانە تەنها لەناو سێروەردا کاردەکات.", ephemeral: true });
        }

        const userId = interaction.options.getString('userid');

        try {
            // لابردنی باند لەسەر بەکارهێنەرەکە
            await interaction.guild.members.unban(
                userId,
                `Unbanned by ${interaction.user.tag}`
            );

            return interaction.reply({
                content: `✅ بە سەرکەوتوویی باند لەسەر بەکارهێنەرەکە (\`${userId}\`) لادرا.`
            });

        } catch (err) {
            console.error("Unban Error:", err);
            return interaction.reply({
                content: "❌ نەتوانرا باند لەسەر ئەم بەکارهێنەرە لابرێت. دڵنیابەوە لە دروستبوونی ئایدییەکە یان ئایا بەکارهێنەرەکە لە ڕاستیدا باند کراوە.",
                ephemeral: true
            });
        }
    },
};
