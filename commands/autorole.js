const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('autorole')
        .setDescription('ڕێکخستنی ڕۆڵی خۆکار بۆ ئەندامە نوێیەکان')
        .addSubcommand(subcommand =>
            subcommand
                .setName('set')
                .setDescription('دیاریکردنی ڕۆڵی خۆکار')
                .addRoleOption(option =>
                    option.setName('role')
                        .setDescription('ئەو ڕۆڵەی کە دەبێت بدرێت بە ئەندامی نوێ')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('سڕینەوەی ڕۆڵی خۆکار')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('status')
                .setDescription('پیشاندانی ڕۆڵی خۆکاری ئێستا')
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const file = "autorole.json";
        let data = {};

        if (fs.existsSync(file)) {
            try {
                data = JSON.parse(fs.readFileSync(file, "utf8"));
            } catch (e) {
                data = {};
            }
        }

        const subcommand = interaction.options.getSubcommand();
        const guildId = interaction.guild.id;

        if (subcommand === 'set') {
            const role = interaction.options.getRole('role');

            if (!role) {
                return interaction.reply({ content: "❌ تکایە ڕۆڵێکی ڕاست هەڵبژێرە.", ephemeral: true });
            }

            data[guildId] = role.id;
            fs.writeFileSync(file, JSON.stringify(data, null, 2));

            return interaction.reply({ content: `✅ بە سەرکەوتوویی ڕۆڵی خۆکار دانرا بە: **${role.name}**`, ephemeral: true });
        }

        if (subcommand === 'remove') {
            if (!data[guildId]) {
                return interaction.reply({ content: "❌ هیچ ڕۆڵێکی خۆکار بۆ ئەم سێروەرە نەبەستراوە.", ephemeral: true });
            }

            delete data[guildId];
            fs.writeFileSync(file, JSON.stringify(data, null, 2));

            return interaction.reply({ content: "✅ بە سەرکەوتوویی ڕۆڵی خۆکار لابرا.", ephemeral: true });
        }

        if (subcommand === 'status') {
            const roleId = data[guildId];

            if (!roleId) {
                return interaction.reply({ content: "❌ هیچ ڕۆڵێکی خۆکار بۆ ئەم سێروەرە دیاری نەکراوە.", ephemeral: true });
            }

            const role = interaction.guild.roles.cache.get(roleId);

            if (!role) {
                return interaction.reply({ content: "❌ ئەو ڕۆڵەی پێشتر سەیڤ کرابوو ئیتر بوونی نییە.", ephemeral: true });
            }

            return interaction.reply({ content: `🛡️ ڕۆڵی خۆکاری ئێستای سێروەر: **${role.name}**`, ephemeral: true });
        }
    },
};
