const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('قەدەغەکردنی ئەندامێک لە سێروەر')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('ئەو ئەندامەی دەتەوێت بانی بکەیت')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('هۆکاری بانکردنەکە')
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'هیچ هۆکارێک نەنووسراوە';

        const member = await interaction.guild.members.fetch(user.id).catch(() => null);

        if (!member) {
            return interaction.reply({ content: "❌ ئەم ئەندامە لە سێروەرەکەدا نییە یان نەدۆزرایەوە.", ephemeral: true });
        }

        if (!member.bannable) {
            return interaction.reply({ content: "❌ من ناتوانم ئەم ئەندامە بانی بکەم (پایەی بەرزترە یان خاوەنی سێروەرە).", ephemeral: true });
        }

        await member.ban({ reason });

        const embed = new EmbedBuilder()
            .setColor("Red")
            .setTitle("🔨 ئەندام قەدەغەکرا (Banned)")
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: "👤 ئەندام:", value: `${user.tag} (\`${user.id}\`)`, inline: true },
                { name: "👮 مۆدیرەیتەر:", value: interaction.user.tag, inline: true },
                { name: "📝 هۆکار:", value: reason }
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
