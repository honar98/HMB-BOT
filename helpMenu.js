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
                title = "🤖 ناوەندی فەرمانەکان و یارمەتی بۆتی HMB";
                description = "بەخێربێیت بۆ سیستەمی یارمەتی پێشکەوتووی بۆتەکەمان! 🌟\n\n" +
                              "سەرتافەی فەرمانەکانی بۆت ئێستا بە شێوازی **Slash Commands (`/`)** کاردەکەن بۆ خێرایی و ئاسانکاری زیاتر.\n\n" +
                              "📌 **تکایە لە مێنوی خوارەوە یەکێک لە بەشەکان هەڵبژێرە بۆ بینینی فەرمانەکان:**";
                color = "#5865F2";
            } 
            else if (selected === "music") {
                title = "🎵 پڕۆگرامی مۆسیقا و دەنگ (Music Commands)";
                description = "لێرەدا تەواوی فەرمانەکانی لێدانی مۆسیقا و دەنگ بە شێوازی `/` هەن:\n\n" +
                              "• `/play <گۆرانی>` - لێدانی گۆرانی یان ناوی لە یوتیوب\n" +
                              "• `/skip` - پەڕینەوە بۆ گۆرانی داهاتوو لە ڕیزەکەدا\n" +
                              "• `/stop` - وەستاندنی بۆت و دەرچوونی لە ڤۆیس چەنڵ\n" +
                              "• `/queue` - پیشاندانی لیستی گۆرانییە چاوەڕوانکراوەکان\n" +
                              "• `/pause` - وەستاندنی کاتی گۆرانییەکە\n" +
                              "• `/resume` - دەستپێکردنەوەی گۆرانییەکە";
                color = "#1DB954";
            } 
            else if (selected === "moderation") {
                title = "🛡️ فەرمانەکانی پاسەوان و پاراستن (Moderation Commands)";
                description = "لێرەدا فەرمانەکانی بەڕێوەبردن و پاککردنەوەی سێرڤەر بە شێوازی `/` هەن:\n\n" +
                              "• `/clear <ژمارە>` - پاککردنەوەی بڕێکی دیاریکراو لە پەیامەکان\n" +
                              "• `/ban <ئەندام> <هۆکار>` - قەدەغەکردنی ئەندام لە سێرڤەر\n" +
                              "• `/kick <ئەندام> <هۆکار>` - دەرکردنی ئەندام لە سێرڤەر\n" +
                              "• `/mute <ئەندام>` - بێدەنگکردنی ئەندام لە چاتەکان\n" +
                              "• `/warn <ئەندام>` - تۆمارکردنی ئاگادارکردنەوە بۆ ئەندام";
                color = "#E74C3C";
            } 
            else if (selected === "ticket") {
                title = "🎫 فەرمانەکانی تیکێت و داواکاری (Ticket Commands)";
                description = "لێرەدا فەرمانەکانی دروستکردن و بەڕێوەبردنی تیکێت بە شێوازی `/` هەن:\n\n" +
                              "• `/ticket-setup` - دروستکردنی مێنوی تیکێتی فەرمی بە دوگمە\n" +
                              "• `/close` - داخستنی تیکێتەکە لەلایەن ستافەوە\n" +
                              "• `/add <ئەندام>` - زیادکردنی ئەندام بۆ ناو تیکێت\n" +
                              "• `/remove <ئەندام>` - دەرکردنی ئەندام لە تیکێت";
                color = "#F1C40F";
            } 
            else if (selected === "giveaway") {
                title = "🎉 فەرمانەکانی دیاری و گیوێوەی (Giveaway Commands)";
                description = "لێرەدا فەرمانەکانی سازکردنی سوپرایز و گیوێوەی بە شێوازی `/` هەن:\n\n" +
                              "• `/giveaway start` - دەستپێکردنی دیاری و گیوێوەی نوێ\n" +
                              "• `/giveaway end` - کۆتاییهێنانی پێشوەختەی گیوێوەیەک\n" +
                              "• `/giveaway reroll` - هەڵبژاردنەوەی براوەیەکی نوێ";
                color = "#E91E63";
            } 
            else if (selected === "general") {
                title = "⚙️ فەرمانە گشتییەکان (General Commands)";
                description = "لێرەدا فەرمانە گشتییەکانی بۆت بە شێوازی `/` هەن:\n\n" +
                              "• `/ping` - پشکنینی خێرایی کارکردن و پینگی بۆت\n" +
                              "• `/help` - پیشاندانی پێڕستی سەرەکی یارمەتی\n" +
                              "• گفتوگۆ و پرسیارکردن لە ڕێگەی تگ کردنی بۆتەوە";
                color = "#3498DB";
            }

            const row = new ActionRowBuilder().addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('help_menu')
                    .setPlaceholder('✨ تکایە بەشێکی مەبەست هەڵبژێرە...')
                    .addOptions([
                        { label: 'پەڕەی سەرەکی (Home)', description: 'گەڕانەوە بۆ ڕووبەری سەرەکی یارمەتی', value: 'home', emoji: '🏠', default: selected === 'home' },
                        { label: 'مۆسیقا (Music)', description: 'فەرمانەکانی لێدانی مۆسیقا و ستریم', value: 'music', emoji: '🎵', default: selected === 'music' },
                        { label: 'پاسەوان (Moderation)', description: 'فەرمانەکانی پاککردنەوە، بان و کیک', value: 'moderation', emoji: '🛡️', default: selected === 'moderation' },
                        { label: 'تیکێت (Ticket)', description: 'فەرمانەکانی تیکێت و ستاف', value: 'ticket', emoji: '🎫', default: selected === 'ticket' },
                        { label: 'دیاری (Giveaway)', description: 'فەرمانەکانی سوپرایز و دیاری', value: 'giveaway', emoji: '🎉', default: selected === 'giveaway' },
                        { label: 'گشتی (General)', description: 'فەرمانە گشتییەکان و زانیاری', value: 'general', emoji: '⚙️', default: selected === 'general' }
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
