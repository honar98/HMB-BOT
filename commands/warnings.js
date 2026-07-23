const fs = require("fs");
const path = require("path");
const { SlashCommandBuilder } = require("discord.js");

const warningsFile = path.join(__dirname, "../warnings.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("warnings")
        .setDescription("پیشاندانی لیستی ئاگادارکردنەوەکانی بەکارهێنەرێک")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("ئەو بەکارهێنەرەی دەتەوێت ئاگادارکردنەوەکانی ببینی (ئەگەر دیاری نەکەیت هی خۆت دەبێت)")
                .setRequired(false)
        ),

    async execute(interaction) {
        if (!interaction.guild) {
            return interaction.reply({ content: "❌ ئەم فەرمانە تەنها لەناو سێروەردا کاردەکات.", ephemeral: true });
        }

        const targetUser = interaction.options.getUser("user") || interaction.user;

        try {
            let warnings = {};

            if (fs.existsSync(warningsFile)) {
                warnings = JSON.parse(fs.readFileSync(warningsFile, "utf8"));
            }

            const userWarnings = Array.isArray(warnings[targetUser.id])
                ? warnings[targetUser.id]
                : [];

            if (userWarnings.length === 0) {
                return interaction.reply({
                    content: `✅ بەکارهێنەر **${targetUser.tag}** هیچ ئاگادارکردنەوەیەکی نییە.`,
                    ephemeral: true
                });
            }

            const list = userWarnings
                .map((w, i) => {
                    return `**${i + 1}.** ${w.reason}\n👮 سەرپەرشتیار: ${w.moderator}\n📅 مێژوو: ${w.date}`;
                })
                .join("\n\n");

            return interaction.reply({
                content: `⚠️ **${targetUser.tag}** خاوەنی **${userWarnings.length}/5** ئاگادارکردنەوەیە:\n\n${list}`,
                ephemeral: true
            });

        } catch (err) {
            console.error("Warnings Error:", err);
            return interaction.reply({
                content: "❌ هەڵەیەک ڕوویدا لە هێنانی زانیاری ئاگادارکردنەوەکان.",
                ephemeral: true
            });
        }
    }
};
