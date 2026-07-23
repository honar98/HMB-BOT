const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('پیشاندانی پێڕستی یارمەتی و فەرمانەکانی بۆت'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('🤖 ناوەندی یارمەتی بۆتی HMB')
            .setDescription('بەخێربێیت بۆ سیستەمی یارمەتی بۆتەکەت!\n\nتکایە لە خوارەوە لە مێنوی هەڵبژاردن یەکێک لە بەشەکان دیاری بکە بۆ بینینی فەرمانەکان:')
            .setColor('#5865F2')
            .addFields(
                { name: '🎵 مۆسیقا (Music)', value: 'لێدان و بەڕێوەبردنی گۆرانییەکان', inline: true },
                { name: '🛡️ پاسەوان (Moderation)', value: 'پاراستنی سێرڤەر و پاککردنەوە', inline: true },
                { name: '🎫 تیکێت (Ticket)', value: 'دروستکردنی تیکێتی کێشەکان', inline: true },
                { name: '🎉 دیاری (Giveaway)', value: 'سازکردنی سوپرایز و دیارییەکان', inline: true },
                { name: '⚙️ گشتی (General)', value: 'فەرمانە گشتییەکان و خزمەتگوزاری', inline: true }
            )
            .setTimestamp()
            .setFooter({ text: `داواکراوە لەلایەن ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });

        const row = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('help_menu')
                .setPlaceholder('📌 تکایە بەشێک هەڵبژێرە...')
                .addOptions([
                    {
                        label: 'سەرەکی (Home)',
                        description: 'گەڕانەوە بۆ پەڕەی سەرەکی یارمەتی',
                        value: 'home',
                        emoji: '🏠'
                    },
                    {
                        label: 'مۆسیقا (Music)',
                        description: 'فەرمانەکانی لێدانی گۆرانی و ستریم',
                        value: 'music',
                        emoji: '🎵'
                    },
                    {
                        label: 'پاسەوان (Moderation)',
                        description: 'فەرمانەکانی پاککردنەوە، بان و کیک',
                        value: 'moderation',
                        emoji: '🛡️'
                    },
                    {
                        label: 'تیکێت (Ticket)',
                        description: 'فەرمانەکانی دروستکردنی تیکێت',
                        value: 'ticket',
                        emoji: '🎫'
                    },
                    {
                        label: 'دیاری (Giveaway)',
                        description: 'فەرمانەکانی سوپرایز و گیوێوەی',
                        value: 'giveaway',
                        emoji: '🎉'
                    },
                    {
                        label: 'گشتی (General)',
                        description: 'فەرمانە گشتییەکان و پینگ',
                        value: 'general',
                        emoji: '⚙️'
                    }
                ])
        );

        await interaction.reply({ embeds: [embed], components: [row], ephemeral: false });
    },
};
