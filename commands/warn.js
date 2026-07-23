const fs = require("fs");
const path = require("path");
const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

const warningsFile = path.join(__dirname, "../warnings.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("warn")
        .setDescription("ئاگادارکردنەوەی بەکارهێنەرێک (Warning)")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("ئەو بەکارهێنەرەی دەتەوێت ئاگاداری بکەیتەوە")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("reason")
                .setDescription("هۆکاری ئاگادارکردنەوەکە")
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction) {
        if (!interaction.guild) {
            return interaction.reply({ content: "❌ ئەم فەرمانە تەنها لەناو سێروەردا کاردەکات.", ephemeral: true });
        }

        const member = interaction.options.getMember("user");
        const reason = interaction.options.getString("reason") || "No reason provided";

        if (!member) {
            return interaction.reply({ content: "❌ تکایە بەکارهێنەرێکی ڕاست دیاری بکە.", ephemeral: true });
        }

        try {
            let warnings = {};

            if (fs.existsSync(warningsFile)) {
                warnings = JSON.parse(fs.readFileSync(warningsFile, "utf8"));
            }

            if (!Array.isArray(warnings[member.user.id])) {
                warnings[member.user.id] = [];
            }

            warnings[member.user.id].push({
                reason,
                moderator: interaction.user.tag,
                date: new Date().toLocaleString()
            });

            fs.writeFileSync(
                warningsFile,
                JSON.stringify(warnings, null, 2)
            );

            const total = warnings[member.user.id].length;

            await member.send(
                `⚠️ You were warned in **${interaction.guild.name}**\nReason: ${reason}\nWarnings: ${total}/5`
            ).catch(() => {});

            if (total === 3) {
                await member.timeout(
                    10 * 60 * 1000,
                    "Reached 3 warnings"
                );

                return interaction.reply({
                    content: `⛔ ${member.user.tag} reached **3 warnings** and was timed out for **10 minutes**.`
                });
            }

            if (total >= 5) {
                await member.ban({
                    reason: "Reached 5 warnings"
                });

                return interaction.reply({
                    content: `🔨 ${member.user.tag} has been banned for reaching **5 warnings**.`
                });
            }

            return interaction.reply({
                content: `⚠️ ${member.user.tag} has been warned.\nReason: ${reason}\nTotal Warnings: ${total}/5`
            });

        } catch (err) {
            console.error("Warn Error:", err);
            return interaction.reply({
                content: "❌ سەرکەوتوو نەبوو لە ئاگادارکردنەوەی بەکارهێنەرەکە.",
                ephemeral: true
            });
        }
    }
};
