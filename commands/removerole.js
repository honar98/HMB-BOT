const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removerole')
        .setDescription('لابردنی رۆڵ لە ئەندامێک لە ناو سێروەردا')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('ئەو ئەندامەی دەتەوێت رۆڵی لێ بکەیتەوە')
                .setRequired(true)
        )
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('ئەو رۆڵەی دەتەوێت لاببەیت')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

    async execute(interaction) {
        const member = interaction.options.getMember('user');
        const role = interaction.options.getRole('role');

        if (!member) {
            return interaction.reply({ content: "❌ تکایە ئەندامێکی دروست دیاری بکە لەم سێروەرەدا.", ephemeral: true });
        }

        try {
            await member.roles.remove(role);

            return interaction.reply({
                content: `✅ بە سەرکەوتوویی رۆڵی **${role.name}** لە **${member.user.tag}** لادرا.`
            });

        } catch (err) {
            console.error(err);

            return interaction.reply({
                content: "❌ سەرکەوتوو نەبوو لە لابردنی رۆڵەکە (تکایە دڵنیابە کە پلەی بۆت لە سەرووی ئەو رۆڵەوەیە).",
                ephemeral: true
            });
        }
    },
};
