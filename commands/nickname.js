const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nickname')
        .setDescription('گۆڕینی ناوی خوازراوی (Nickname) ئەندامێک لە سێروەر')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('ئەو ئەندامەی دەتەوێت ناوی بگۆڕیت')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('nickname')
                .setDescription('ناوی خوازراوی نوێ')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames),

    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const nickname = interaction.options.getString('nickname');

        const member = await interaction.guild.members.fetch(user.id).catch(() => null);

        if (!member) {
            return interaction.reply({ content: "❌ ئەم ئەندامە لە سێروەرەکەدا نییە یان نەدۆزرایەوە.", ephemeral: true });
        }

        try {
            await member.setNickname(nickname);

            return interaction.reply({
                content: `✅ ناوی خوازراوی **${user.tag}** بە سەرکەوتوویی گۆڕدرا بۆ **${nickname}**.`
            });

        } catch (err) {
            console.error(err);

            return interaction.reply({
                content: "❌ سەرکەوتوو نەبوو لە گۆڕینی ناوی ئەندامەکە (ڕەنگە پایەی ئەم ئەندامە لە من بەرزتر بێت یان خاوەنی سێروەر بێت).",
                ephemeral: true
            });
        }
    },
};
