const fs = require("fs");
const path = require("path");
const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setlogs")
        .setDescription("دیاریکردنی کەناڵی لۆگ (Logs) بۆ سێروەرەکە")
        .addChannelOption(option =>
            option.setName("channel")
                .setDescription("ئەو کەناڵەی دەتەوێت وەک لۆگ بەکاربێت")
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const channel = interaction.options.getChannel("channel");

        try {
            const logsFile = path.join(__dirname, "../logs.json");
            let data = {};

            if (fs.existsSync(logsFile)) {
                data = JSON.parse(fs.readFileSync(logsFile, "utf8"));
            }

            data[interaction.guild.id] = channel.id;

            fs.writeFileSync(logsFile, JSON.stringify(data, null, 2));

            return interaction.reply({
                content: `✅ بە سەرکەوتوویی کەناڵی لۆگ دیاری کرا بۆ: ${channel}`,
                ephemeral: true
            });

        } catch (err) {
            console.error("SetLogs Error:", err);
            return interaction.reply({
                content: "❌ هەڵەیەک ڕوویدا لە پاشەکەوتکردنی کەناڵی لۆگ.",
                ephemeral: true
            });
        }
    },
};
