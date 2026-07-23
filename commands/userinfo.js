const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('پیشاندانی زانیاری تەواو و پرۆفیشناڵی بەکارهێنەر')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('ئەو بەکارهێنەرەی دەتەوێت زانیارییەکانی ببینی')
                .setRequired(false)
        ),

    async execute(interaction) {
        if (!interaction.guild) {
            return interaction.reply({ content: "❌ ئەم فەرمانە تەنها لەناو سێروەردا کاردەکات.", ephemeral: true });
        }

        const targetUser = interaction.options.getUser('user') || interaction.user;
        const member = await interaction.guild.members.fetch(targetUser.id).catch(() => null);

        if (!member) {
            return interaction.reply({ content: "❌ نەتوانرا ئەم بەکارهێنەرە لە سێروەردا بدۆزرێتەوە.", ephemeral: true });
        }

        try {
            const embed = new EmbedBuilder()
                .setColor("#5865F2")
                .setTitle("👤 زانیاری بەکارهێنەر")
                .setThumbnail(targetUser.displayAvatarURL({ dynamic: true, size: 1024 }))
                .addFields(
                    {
                        name: "👤 ناوی بەکارهێنەر",
                        value: targetUser.tag,
                        inline: true,
                    },
                    {
                        name: "🆔 ئایدی (ID)",
                        value: targetUser.id,
                        inline: true,
                    },
                    {
                        name: "📅 دروستبوونی ئەکاونت",
                        value: `<t:${Math.floor(targetUser.createdTimestamp / 1000)}:F>`,
                        inline: false,
                    },
                    {
                        name: "📥 کاتی هاتنە ناو سێروەر",
                        value: member.joinedTimestamp ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>` : 'نەزانراو',
                        inline: false,
                    }
                )
                .setFooter({
                    text: `داواکراوە لەلایەن ${interaction.user.tag}`,
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
                })
                .setTimestamp();

            return interaction.reply({
                embeds: [embed],
            });

        } catch (error) {
            console.error("UserInfo Error:", error);
            return interaction.reply({
                content: "❌ هەڵەیەک ڕوویدا لە هێنانی زانیارییەکانی بەکارهێنەر.",
                ephemeral: true
            });
        }
    },
};
