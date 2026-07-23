const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('دەرکردنی ئەندامێک لە سێروەر (Kick)')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('ئەو ئەندامەی دەتەوێت دەری بکەیت')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('هۆکاری دەرکردنەکە')
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'هیچ هۆکارێک نەنووسراوە';

        const member = await interaction.guild.members.fetch(user.id).catch(() => null);

        if (!member) {
            return interaction.reply({ content: "❌ ئەم ئەندامە لە سێروەرەکەدا نییە یان نەدۆزرایەوە.", ephemeral: true });
        }

        if (!member.kickable) {
            return interaction.reply({ content: "❌ من ناتوانم ئەم ئەندامە دەربکەم (پایەی بەرزترە یان خاوەنی سێروەرە).", ephemeral: true });
        }

        await member.kick(reason);

        const embed = new EmbedBuilder()
            .setColor("Orange")
            .setTitle("👢 ئەندام دەرکرا (Kicked)")
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
