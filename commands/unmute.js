const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('لابردنی میوت (Timeout) لەسەر بەکارهێنەرێک')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('ئەو بەکارهێنەرەی دەتەوێت میوتی لەسەر لابەیت')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction) {
        if (!interaction.guild) {
            return interaction.reply({ content: "❌ ئەم فەرمانە تەنها لەناو سێروەردا کاردەکات.", ephemeral: true });
        }

        const member = interaction.options.getMember('user');

        if (!member) {
            return interaction.reply({ content: "❌ تکایە بەکارهێنەرێکی ڕاست دیاری بکە.", ephemeral: true });
        }

        try {
            await member.timeout(null);

            return interaction.reply({
                content: `🔊 بە سەرکەوتوویی میوت لەسەر **${member.user.tag}** لادرا.`
            });
        } catch (err) {
            console.error("Unmute Error:", err);
            return interaction.reply({
                content: "❌ سەرکەوتوو نەبوو لە لابردنی میوت لەسەر ئەم بەکارهێنەرە.",
                ephemeral: true
            });
        }
    },
};
