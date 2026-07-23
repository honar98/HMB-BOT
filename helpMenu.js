const { EmbedBuilder } = require("discord.js");

module.exports = (client) => {
    client.on("interactionCreate", async (interaction) => {
        if (!interaction.isStringSelectMenu()) return;
        if (interaction.customId !== "help_menu") return;

        try {
            const selected = interaction.values[0];
            let description = "";
            let title = "";
            let color = "#5865F2";

            if (selected === "home" || selected === "main") {
                title = "🤖 ناوەندی یارمەتی بۆتی HMB";
                description = "بەخێربێیت بۆ سیستەمی یارمەتی!\n\nلێرەدا دەتوانیت بە ئاسانی بە ناو فەرمانەکاندا بگەڕێیت و زانیاری لەسەر چۆنیەتی بەکارهێنانیان بەدەستبهێنیت.\n\n📍 تکایە خوارەوە هەڵبژێرە بۆ بینینی بەشەکان:";
                color = "#5865F2";
            } else if (selected === "music") {
                title = "🎵 Music Commands";
                description = "• `$play` - لێدانی گۆرانی و مۆسیقا\n• `$skip` - پەڕینەوە لە گۆرانی\n• `$stop` - وەستاندنی بۆت";
                color = "#1DB954";
            } else if (selected === "general") {
                title = "⚙️ General Commands";
                description = "• فەرمانە گشتییەکان و خزمەتگوزارییەکان و `/ping`";
                color = "#3498DB";
            } else if (selected === "moderation") {
                title = "🛡️ Moderation Commands";
                description = "• فەرمانەکانی بەڕێوەبردن و پاککردنەوەی پەیام و سێرڤەر.";
                color = "#E74C3C";
            } else if (selected === "ticket") {
                title = "🎫 Ticket Commands";
                description = "• فەرمانەکانی دروستکردن و پەیوەندیکردن بە ئادمینەکانەوە.";
                color = "#F1C40F";
            } else if (selected === "giveaway") {
                title = "🎉 Giveaway Commands";
                description = "• فەرمانەکانی سازکردنی سوپرایز و دیاری بە شێوەیەکی ئۆتۆماتیکی.";
                color = "#E91E63";
            } else if (selected === "utility") {
                title = "⚙️ Utility Commands";
                description = "• زانیاری و فەرمانە سوودبەخشەکان.";
                color = "#3498DB";
            } else if (selected === "admin") {
                title = "👑 Admin Commands";
                description = "• فەرمانە تایبەتەکان بۆ کۆنتڕۆڵکردنی زیاتری سێرڤەرەکە.";
                color = "#9B59B6";
            } else if (selected === "info") {
                title = "ℹ️ Information Commands";
                description = "• زانیاری تەواو دەربارەی بۆتەکە و خاوەنەکەی.";
                color = "#1ABC9C";
            }

            const embed = new EmbedBuilder()
                .setTitle(title)
                .setDescription(description)
                .setColor(color)
                .setTimestamp()
                .setFooter({ text: `داواکراوە لەلایەن ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });

            await interaction.update({ embeds: [embed] });

        } catch (error) {
            console.error("Help Menu Error:", error);
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({ content: "❌ هەڵەیەک ڕوویدا.", ephemeral: true }).catch(() => {});
            }
        }
    });
};
