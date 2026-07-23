const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');

const file = "./links.json";

if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify({ enabled: true }, null, 2));
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('link')
        .setDescription('چالاککردن یان ناچالاککردنی سیستەمی پاراستنی لینکەکان')
        .addStringOption(option =>
            option.setName('action')
                .setDescription('کردارەکە هەڵبژێرە')
                .setRequired(true)
                .addChoices(
                    { name: 'on (چالاککردن)', value: 'on' },
                    { name: 'off (ناچالاککردن)', value: 'off' },
                    { name: 'status (زانیاری دۆخ)', value: 'status' }
                )
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        let config = {};
        if (fs.existsSync(file)) {
            try {
                config = JSON.parse(fs.readFileSync(file, "utf8"));
            } catch (e) {
                config = { enabled: true };
            }
        }

        const action = interaction.options.getString('action');

        if (action === "on") {
            config.enabled = true;
            fs.writeFileSync(file, JSON.stringify(config, null, 2));
            return interaction.reply({ content: "✅ Link Protection چالاک کرا.", ephemeral: true });
        }

        if (action === "off") {
            config.enabled = false;
            fs.writeFileSync(file, JSON.stringify(config, null, 2));
            return interaction.reply({ content: "❌ Link Protection ناچالاک کرا.", ephemeral: true });
        }

        if (action === "status") {
            return interaction.reply({
                content: config.enabled ? "🟢 Link Protection چالاکە." : "🔴 Link Protection ناچالاکە.",
                ephemeral: true
            });
        }
    },
};
