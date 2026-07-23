const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");

module.exports = (client) => {
    client.on("interactionCreate", async (interaction) => {
        if (!interaction.isStringSelectMenu()) return;
        if (interaction.customId !== "help_menu") return;

        try {
            const selected = interaction.values[0].toLowerCase();
            let description = "";
            let title = "";
            let color = "#5865F2";

            if (selected === "home" || selected === "main") {
                title = "🤖 ناوەندی یارمەتی بۆتی HMB";
                description = "بەخێربێیت بۆ سیستەمی یارمەتی بۆتەکەت!\n\nتکایە لە خوارەوە لە مێنوی هەڵبژاردن یەکێک لە بەشەکان دیاری بکە بۆ بینینی فەرمانەکان:";
                color = "#5865F2";
            } 
            else if (selected === "music") {
                title = "🎵 Music Commands";
                description = "لێرەدا فەرمانەکانی مۆسیقا دەبینیت:\n\n" +
                              "• `$play <ناوی گۆرانی>` - لێدانی گۆرانی یان لینکی یوتیوب\n" +
                              "• `$skip` - پەڕینەوە بۆ گۆرانی داهاتوو\n" +
                              "• `$stop` - وەستاندنی بۆت و دەرچوونی لە ڤۆیس\n" +
                              "• `$queue` - پیشاندانی ڕیزبەندی گۆرانییەکان\n" +
                              "• `$pause / $resume` - وەستاندن و هەڵبژاردنەوەی کاتی";
                color = "#1DB954";
            } 
            else if (selected === "moderation") {
                title = "🛡️ Moderation Commands";
                description = "لێرەدا فەرمانەکانی پاسەوان و بەڕێوەبردن دەبینیت:\n\n" +
                              "• `clear <ژمارە>` - پاککردنەوەی پەیامەکان\n" +
                              "• `ban <ئەندام>` - قەدەغەکردنی ئەندام لە سێرڤەر\n" +
                              "• `kick <ئەندام>` - دەرکردنی ئەندام لە سێرڤەر\n" +
                              "• `mute <ئەندام>` - بێدەنگکردنی ئەندام\n" +
                              "• `warn <ئەندام>` - ئاگادارکردنەوەی ئەندام";
                color = "#E74C3C";
            } 
            else if (selected === "ticket") {
                title = "🎫 Ticket Commands";
                description = "لێرەدا فەرمانەکانی تیکێت دەبینیت:\n\n" +
                              "• دروستکردنی مێنوی تیکێت بە دوگمە بۆ پەیوەندیکردن بە ستافەوە.\n" +
                              "• داواکردنی یارمەتی ڕاستەوخۆ لە ڕێگەی تیکێتی تایبەت.";
                color = "#F1C40F";
            } 
            else if (selected === "giveaway") {
                title = "🎉 Giveaway Commands";
                description = "لێرەدا فەرمانەکانی گیوێوەی دەبینیت:\n\n" +
                              "• سازکردنی سوپرایز و دیاری ئۆتۆماتیکی لە سێرڤەرەکەتدا.";
                color = "#E91E63";
            } 
            else if (selected === "general") {
                title = "⚙️ General Commands";
                description = "لێرەدا فەرمانە گشتییەکان دەبینیت:\n\n" +
                              "• `/ping` - پشکنینی خێرایی و پینگی بۆت\n" +
                              "• تگ کردنی بۆت و گفتوگۆ لەگەڵ زیرەکی دەستکرد";
                color = "#3498DB";
            }

            // دروستکردنەوەی مێنوەکە لەگەڵ دیاریکردنی بەشی هەڵبژاردراو بۆ ئەوەی دووبارە نەبێتەوە
            const row = new ActionRowBuilder().addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('help_menu')
                    .setPlaceholder('📌 تکایە بەشێک هەڵبژێرە...')
                    .addOptions([
                        { label: 'سەرەکی (Home)', description: 'گەڕانەوە بۆ پەڕەی سەرەکی', value: 'home', emoji: '🏠', default: selected === 'home' },
                        { label: 'مۆسیقا (Music)', description: 'فەرمانەکانی مۆسیقا', value: 'music', emoji: '🎵', default: selected === 'music' },
                        { label: 'پاسەوان (Moderation)', description: 'فەرمانەکانی پاسەوان', value: 'moderation', emoji: '🛡️', default: selected === 'moderation' },
                        { label: 'تیکێت (Ticket)', description: 'فەرمانەکانی تیکێت', value: 'ticket', emoji: '🎫', default: selected === 'ticket' },
                        { label: 'دیاری (Giveaway)', description: 'فەرمانەکانی گیوێوەی', value: 'giveaway', emoji: '🎉', default: selected === 'giveaway' },
                        { label: 'گشتی (General)', description: 'فەرمانە گشتییەکان', value: 'general', emoji: '⚙️', default: selected === 'general' }
                    ])
            );

            const embed = new EmbedBuilder()
                .setTitle(title)
                .setDescription(description)
                .setColor(color)
                .setTimestamp()
                .setFooter({ text: `داواکراوە لەلایەن ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });

            await interaction.update({ embeds: [embed], components: [row] });

        } catch (error) {
            console.error("Help Menu Error:", error);
        }
    });
};
