const fs = require("fs");
const path = require("path");
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

const warningsFile = path.join(__dirname, "../warnings.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unwarn')
        .setDescription('لابردنی دوایین ئاگادارکردنەوە (Warning) لە بەکارهێنەرێک')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('ئەو بەکارهێنەرەی دەتەوێت ئاگادارکردنەوەی لێ لادەیت')
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
            let warnings = {};

            if (fs.existsSync(warningsFile)) {
                warnings = JSON.parse(fs.readFileSync(warningsFile, "utf8"));
            }

            if (
                !Array.isArray(warnings[member.user.id]) ||
                warnings[member.user.id].length === 0
            ) {
                return interaction.reply({ content: "❌ ئەم بەکارهێنەرە هیچ ئاگادارکردنەوەیەکی نییە.", ephemeral: true });
            }

            warnings[member.user.id].pop();

            if (warnings[member.user.id].length === 0) {
                delete warnings[member.user.id];
            }

            fs.writeFileSync(
                warningsFile,
                JSON.stringify(warnings, null, 2)
            );

            const remaining = warnings[member.user.id]?.length || 0;

            return interaction.reply({
                content: `✅ بە سەرکەوتوویی یەک ئاگادارکردنەوە لە **${member.user.tag}** لادرا.\nئاگادارکردنەوە ماوەکان: ${remaining}/5`
            });

        } catch (err) {
            console.error("Unwarn Error:", err);
            return interaction.reply({
                content: "❌ هەڵەیەک ڕوویدا لە لابردنی ئاگادارکردنەوەکە.",
                ephemeral: true
            });
        }
    },
};
