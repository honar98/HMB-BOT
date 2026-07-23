const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('پیشاندانی زانیاری تەواو و پرۆفیشناڵی سێروەرەکە'),

    async execute(interaction) {
        if (!interaction.guild) {
            return interaction.reply({ content: "❌ ئەم فەرمانە تەنها لەناو سێروەردا کاردەکات.", ephemeral: true });
        }

        const guild = interaction.guild;

        try {
            // هێنانی زانیاری خاوەنی سێروەر و ئامارەکان
            const owner = await guild.fetchOwner();
            const textChannels = guild.channels.cache.filter(c => c.type === ChannelType.GuildText).size;
            const voiceChannels = guild.channels.cache.filter(c => c.type === ChannelType.GuildVoice).size;
            const rolesCount = guild.roles.cache.size - 1; // لابردنی @everyone
            const emojisCount = guild.emojis.cache.size;
            const boostLevel = guild.premiumTier;
            const boostCount = guild.premiumSubscriptionCount || 0;

            const embed = new EmbedBuilder()
                .setColor("#2b2d31") // ڕەنگی مۆدێرنی دیسکۆرد
                .setTitle(`📊 زانیاری پرۆفیشناڵی سێروەری ${guild.name}`)
                .setThumbnail(guild.iconURL({ dynamic: true, size: 1024 }))
                .setImage(guild.bannerURL({ size: 1024 }) || null) // پیشاندانی بەنەری سێروەر ئەگەر هەبێت
                .addFields(
                    {
                        name: "👑 خاوەنی سێروەر",
                        value: `> ${owner.user.tag} (<@${owner.id}>)`,
                        inline: false
                    },
                    {
                        name: "📌 زانیارییە گشتییەکان",
                        value: [
                            `> **🆔 ئایدی:** \`${guild.id}\``,
                            `> **📅 دروستکراوە لە:** <t:${Math.floor(guild.createdTimestamp / 1000)}:R>`,
                            `> **🌍 ئاستی ڤێریفای:** \`${guild.verificationLevel}\``
                        ].join("\n"),
                        inline: false
                    },
                    {
                        name: "👥 ئەندام و بۆستەکان",
                        value: [
                            `> **👤 کۆی ئەندامەکان:** \`${guild.memberCount}\``,
                            `> **🚀 بۆستەکان:** \`Level ${boostLevel} (${boostCount} Boost)\``
                        ].join("\n"),
                        inline: true
                    },
                    {
                        name: "📁 کەناڵ و ڕۆڵەکان",
                        value: [
                            `> **💬 کەناڵی نوسین:** \`${textChannels}\``,
                            `> **🔊 کەناڵی دەنگی:** \`${voiceChannels}\``,
                            `> **🎭 ژمارەی ڕۆڵەکان:** \`${rolesCount}\``,
                            `> **😀 ئەیمۆجییەکان:** \`${emojisCount}\``
                        ].join("\n"),
                        inline: true
                    }
                )
                .setFooter({
                    text: `داواکراوە لەلایەن ${interaction.user.tag}`,
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                })
                .setTimestamp();

            return interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error("Pro ServerInfo Error:", error);
            return interaction.reply({
                content: "❌ هەڵەیەک ڕوویدا لە هێنانی زانیارییە پرۆفیشناڵەکانی سێروەر.",
                ephemeral: true
            });
        }
    },
};
