const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('role')
        .setDescription('بەخشینی ڕۆڵ بە ئەندامێک لە ناو سێروەردا')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('ئەو ئەندامەی دەتەوێت ڕۆڵی پێ ببەخشیت')
                .setRequired(true)
        )
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('ئەو ڕۆڵەی دەتەوێت بیدەیت بە ئەندامەکە')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

    async execute(interaction) {
        // لە Slash Commands، بەکارهێنەر و ڕۆڵ ڕاستەخۆ لە options وەردەگیرێن
        const member = interaction.options.getMember('user');
        const role = interaction.options.getRole('role');

        // ئەم بەشە دڵنیایی دەدات کە ئەندامەکە لە سێروەرەکە بوونی هەیە
        if (!member) {
            return interaction.reply({ content: "❌ تکایە ئەندامێکی دروست دیاری بکە لەم سێروەرەدا.", ephemeral: true });
        }

        try {
            // زیادکردنی ڕۆڵەکە بۆ ئەندامەکە
            await member.roles.add(role);

            return interaction.reply({
                content: `✅ بە سەرکەوتوویی ڕۆڵی **${role.name}** بەخشرا بە **${member.user.tag}**.`
            });

        } catch (err) {
            console.error("Error adding role:", err);

            // نیشاندانی هەڵە ئەگەر بۆتەکە دەسەڵاتی پێویستی نەبێت
            return interaction.reply({
                content: "❌ سەرکەوتوو نەبوو لە بەخشینی ڕۆڵەکە (تکایە دڵنیابە کە پلەی بۆت لە سەرووی ئەو ڕۆڵەوەیە).",
                ephemeral: true
            });
        }
    },
};
