const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('poll')
        .setDescription('دروستکردنی راپرسی (Poll) بۆ وەرگرتنی رای ئەندامان')
        .addStringOption(option =>
            option.setName('question')
                .setDescription('پرسیار یان بابەتی راپرسییەکە')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interaction) {
        const question = interaction.options.getString('question');

        const embed = new EmbedBuilder()
            .setColor(0x00AEFF)
            .setTitle("📊 راپرسی نوێ")
            .setDescription(`**${question}**`)
            .setFooter({
                text: `دروستکراوە لەلایەن ${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL({ dynamic: true })
            })
            .setTimestamp();

        // ناردنی پەیامەکە و وەرگرتنی ئۆبێکتەکەی بۆ ئەوەی ڕیاکشنی تێدا بکرێت
        const poll = await interaction.reply({ embeds: [embed], fetchReply: true });

        await poll.react("👍");
        await poll.react("👎");
    },
};
