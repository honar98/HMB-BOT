const { 
    SlashCommandBuilder, 
    EmbedBuilder, 
    ActionRowBuilder, 
    StringSelectMenuBuilder 
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('پیشاندانی مینیوی یارمەتی پڕۆفیشناڵی بۆت'),
    
    async execute(interaction) {
        
        // 🏠 ئیمبەدی سەرەکی (Home Page)
        const homeEmbed = new EmbedBuilder()
            .setColor('#5865F2')
            .setTitle('🤖 ناوەندی یارمەتی بۆتی HMB')
            .setDescription(`بەخێربێیت **${interaction.user.username}** بۆ سیستەمی یارمەتی!\n\nلێرەدا دەتوانیت بە ئاسانی بە ناو فەرمانەکاندا بگەڕێیت و زانیاری لەسەر چۆنیەتی بەکارهێنانیان بەدەستبهێنیت.\n\n> 📌 **تکایە خوارەوە هەڵبژێرە بۆ بینینی بەشەکان:**`)
            .addFields(
                { name: '🎵 بەشی مۆسیقا', value: 'لێدان و کۆنتڕۆڵکردنی گۆرانییەکان', inline: true },
                { name: '⚙️ بەشی گشتی', value: 'فەرمانە گشتی و خزمەتگوزارییەکان', inline: true },
                { name: '🛡️ بەشی پاسەوان', value: 'فەرمانەکانی بەڕێوەبردن و سێروەر', inline: true }
            )
            .setThumbnail(interaction.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
            .setTimestamp()
            .setFooter({ text: `داواکراوە لەلایەن ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() });

        // 📌 دروستکردنی مینیوی هەڵبژاردن
        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('help_menu')
            .setPlaceholder('📂 تکایە بەشێک بۆ گەڕان هەڵبژێرە...')
            .addOptions([
                {
                    label: 'پەڕەی سەرەکی (Home)',
                    description: 'گەڕانەوە بۆ پەڕەی سەرەکی یارمەتی',
                    value: 'home',
                    emoji: '🏠'
                },
                {
                    label: 'بەشی مۆسیقا (Music)',
                    description: 'فەرمانەکانی play, skip, stop و هتد...',
                    value: 'music',
                    emoji: '🎵'
                },
                {
                    label: 'بەشی گشتی (General)',
                    description: 'فەرمانە گشتییەکانی وەک ping و info',
                    value: 'general',
                    emoji: '⚙️'
                },
                {
                    label: 'بەشی پاسەوان (Moderation)',
                    description: 'فەرمانەکانی پاککردنەوە و بەڕێوەبردن',
                    value: 'mod',
                    emoji: '🛡️'
                }
            ]);

        const row1 = new ActionRowBuilder().addComponents(selectMenu);

        // ناردنی پەیامی سەرەکی بۆ Slash Command
        const sentMessage = await interaction.reply({ 
            embeds: [homeEmbed], 
            components: [row1],
            fetchReply: true 
        });

        // 🔄 سیستەمی وەڵامدانەوە بۆ کلیککردن
        const collector = sentMessage.createMessageComponentCollector({ time: 120000 });

        collector.on('collect', async i => {
            if (i.user.id !== interaction.user.id) {
                return i.reply({ 
                    content: '❌ ئەم مینیوە هی تۆ نییە، تکایە خۆت فەرمانەکە بنووسە!', 
                    ephemeral: true 
                });
            }

            const value = i.values[0];

            if (value === 'home') {
                await i.update({ embeds: [homeEmbed], components: [row1] });
            } 
            else if (value === 'music') {
                const musicEmbed = new EmbedBuilder()
                    .setColor('#1DB954')
                    .setTitle('🎵 فەرمانەکانی بەشی مۆسیقا')
                    .setDescription('لیستەی فەرمانە بەردەستەکان بۆ لێدانی دەنگ و مۆسیقا:')
                    .addFields(
                        { name: '`/play [ناو یان لینک]`', value: 'لێدانی گۆرانی ڕاستەوخۆ لە یوتیوبەوە.' },
                        { name: '`/skip`', value: 'پەڕینەوە بۆ گۆرانی داهاتوو لە ڕیزدا.' },
                        { name: '`/stop`', value: 'وەستاندنی بۆت و دەرچوونی لە ڤۆیس چات.' },
                        { name: '`/queue`', value: 'پیشاندانی ڕیزبەندی گۆرانییە چاوەڕوانکراوەکان.' }
                    )
                    .setTimestamp()
                    .setFooter({ text: 'HMB BOT • بەشی مۆسیقا' });

                await i.update({ embeds: [musicEmbed], components: [row1] });
            } 
            else if (value === 'general') {
                const generalEmbed = new EmbedBuilder()
                    .setColor('#3498DB')
                    .setTitle('⚙️ فەرمانە گشتییەکان')
                    .setDescription('فەرمانە بەسوودە گشتییەکانی سێروەر:')
                    .addFields(
                        { name: '`/ping`', value: 'پشکنی خێرایی و پینگی وەڵامدانەوەی بۆت.' },
                        { name: '`/help`', value: 'کردنەوەی ئەم مینیوی یارمەتییە.' },
                        { name: '`/botinfo`', value: 'زانیاری تەواو لەسەر ڤێرژن و بەڕێوەبەری بۆت.' }
                    )
                    .setTimestamp()
                    .setFooter({ text: 'HMB BOT • بەشی گشتی' });

                await i.update({ embeds: [generalEmbed], components: [row1] });
            }
            else if (value === 'mod') {
                const modEmbed = new EmbedBuilder()
                    .setColor('#E74C3C')
                    .setTitle('🛡️ فەرمانەکانی بەڕێوەبردن (Moderation)')
                    .setDescription('فەرمانە تایبەتەکان بۆ مۆدیرەیتەر و خاوەنی سێروەر:')
                    .addFields(
                        { name: '`/clear [ژمارە]`', value: 'سڕینەوەی چەند پەیامێک بەیەکجار.' },
                        { name: '`/kick [@user]`', value: 'دەرکردنی ئەندامێک لە سێروەر.' },
                        { name: '`/ban [@user]`', value: 'قەدەغەکردنی ئەندامێک لە سێروەر.' }
                    )
                    .setTimestamp()
                    .setFooter({ text: 'HMB BOT • بەشی پاسەوان' });

                await i.update({ embeds: [modEmbed], components: [row1] });
            }
        });

        collector.on('end', () => {
            const disabledMenu = StringSelectMenuBuilder.from(selectMenu).setDisabled(true);
            const disabledRow = new ActionRowBuilder().addComponents(disabledMenu);
            sentMessage.edit({ components: [disabledRow] }).catch(() => {});
        });
    }
};
