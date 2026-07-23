const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');

const warningsFile = "./warnings.json";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clearwarns')
        .setDescription('سڕینەوەی هەموو ئاگادارکردنەوەکانی (Warning) ئەندامێک')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('ئەو ئەندامەی دەتەوێت هۆشدارییەکانی بسڕیتەوە')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction) {
        const user = interaction.options.getUser('user');

        let warnings = {};

        if (fs.existsSync(warningsFile)) {
            try {
                warnings = JSON.parse(fs.readFileSync(warningsFile, "utf8"));
            } catch (e) {
                warnings = {};
            }
        }

        if (!warnings[user.id]) {
            return interaction.reply({ content: `❌ ئەم ئەندامە هیچ هۆشدارییەکی لە سیستمدا نییە.`, ephemeral: true });
        }

        delete warnings[user.id];

        fs.writeFileSync(
            warningsFile,
            JSON.stringify(warnings, null, 2)
        );

        return interaction.reply({
            content: `✅ هەموو هۆشدارییەکانی **${user.tag}** بە سەرکەوتوویی سڕرانەوە.`
        });
    },
};
