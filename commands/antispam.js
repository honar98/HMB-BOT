const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('antispam')
        .setDescription('چالاککردن یان ناچالاککردنی سیستەمی دژە-سپام')
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
        const file = "./antispam.json";

        if (!fs.existsSync(file)) {
            fs.writeFileSync(file, JSON.stringify({ enabled: false }, null, 2));
        }

        let data = JSON.parse(fs.readFileSync(file, 'utf8'));
        const action = interaction.options.getString('action');

        if (action === "on") {
            data.enabled = true;
            fs.writeFileSync(file, JSON.stringify(data, null, 2));
            return interaction.reply({ content: "✅ Anti-Spam چالاک کرا.", ephemeral: true });
        }

        if (action === "off") {
            data.enabled = false;
            fs.writeFileSync(file, JSON.stringify(data, null, 2));
            return interaction.reply({ content: "❌ Anti-Spam ناچالاک کرا.", ephemeral: true });
        }

        if (action === "status") {
            return interaction.reply({
                content: `🛡️ Anti-Spam دۆخی ئێستا: ${data.enabled ? "ON ✅" : "OFF ❌"}`,
                ephemeral: true
            });
        }
    },
};
