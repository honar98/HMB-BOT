const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('پیشاندانی پێڕستی سەرەکی یارمەتی و فەرمانەکان بە شێوازێکی پڕۆفیشناڵ'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('🤖 ناوەندی فەرمانەکان و یارمەتی بۆتی HMB')
            .setDescription(
                'بەخێربێیت بۆ سیستەمی یارمەتی پێشکەوتووی بۆتەکەمان! 🌟\n\n' +
                'سەرتافەی فەرمانەکانی بۆت ئێستا بە شێوازی **Slash Commands (`/`)** کاردەکەن بۆ خێرایی و ئاسانکاری زیاتر.\n\n' +
                '📌 **تکایە لە مێنوی خوارەوە یەکێک لە بەشەکان هەڵبژێرە بۆ بینینی فەرمانەکان:**'
            )
            .setColor('#5865F2')
            .addFields(
                { name: '🎵 مۆسیقا (Music)', value: 'لێدان و بەڕێوەبردنی گۆرانییەکان بە `/`', inline: true },
                { name: '🛡️ پاسەوان (Moderation)', value: 'پاراستنی سێرڤەر و پاککردنەوە بە `/`', inline: true },
                { name: '🎫 تیکێت (Ticket)', value: 'دروستکردنی سیستەمی تیکێت بە `/`', inline: true },
                { name: '🎉 دیاری (Giveaway)', value: 'سازکردنی سوپرایز و گیوێوەی بە `/`', inline: true },
                { name: '⚙️ گشتی (General)', value: 'فەرمانە گشتییەکان و خزمەتگوزاری بە `/`', inline: true }
            )
            .setTimestamp()
            .setFooter({ text: `داواکراوە لەلایەن ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });

        const row = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('help_menu')
                .setPlaceholder('✨ تکایە بەشێکی مەبەست هەڵبژێرە...')
                .addOptions([
                    {
                        label: 'پەڕەی سەرەکی (Home)',
                        description: 'گەڕانەوە بۆ ڕووبەری سەرەکی یارمەتی',
                        value: 'home',
                        emoji: '🏠'
                    },
                    {
                        label: 'مۆسیقا (Music)',
                        description: 'فەرمانەکانی لێدانی مۆسیقا و ستریم',
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
                        description: 'فەرمانەکانی تیکێت و ستاف',
                        value: 'ticket',
                        emoji: '🎫'
                    },
                    {
                        label: 'دیاری (Giveaway)',
                        description: 'فەرمانەکانی سوپرایز و دیاری',
                        value: 'giveaway',
                        emoji: '🎉'
                    },
                    {
                        label: 'گشتی (General)',
                        description: 'فەرمانە گشتییەکان و زانیاری',
                        value: 'general',
                        emoji: '⚙️'
                    }
                ])
        );

        await interaction.reply({ embeds: [embed], components: [row], ephemeral: false });
    },
};
