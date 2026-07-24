const { PermissionsBitField, Events } = require('discord.js');

// خەزنکردنی کاتی پەیامی بەکارهێنەران بۆ ئەنتی سپام
const spamTracker = new Map();

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        // پشتگوێخستنی بۆت و پەیامی دەرەوەی سێرڤەر
        if (message.author.bot || !message.guild) return;

        // ==========================================
        // ١. سیستەمی ئەنتی سپام (Anti-Spam System)
        // ==========================================
        if (message.client.antiSpam !== false) {
            if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                const userId = message.author.id;
                const channel = message.channel;
                const currentTime = Date.now();

                if (!spamTracker.has(userId)) {
                    spamTracker.set(userId, []);
                }

                const timestamps = spamTracker.get(userId);
                timestamps.push(currentTime);

                const timeWindow = 4000; // 4 چرکە
                const recentMessages = timestamps.filter(time => currentTime - time < timeWindow);
                spamTracker.set(userId, recentMessages);

                // ئەگەر لە ماوەی ٤ چرکەدا ٥ پەیام یان زیاتری نارد
                if (recentMessages.length >= 5) {
                    spamTracker.set(userId, []);

                    try {
                        const member = await message.guild.members.fetch(userId);

                        // بێدەنگکردن بۆ ماوەی ٥ خولەک (Timeout)
                        if (member && member.moderatable) {
                            await member.timeout(5 * 60 * 1000, 'سپام کردن لە چاتدا (Anti-Spam System)');
                        }

                        // سڕینەوەی پەیامەکانی ئەو کەسە
                        const fetchedMessages = await channel.messages.fetch({ limit: 50 });
                        const userMessages = fetchedMessages.filter(m => m.author.id === userId);

                        if (userMessages.size > 0) {
                            await channel.bulkDelete(userMessages, true).catch(() => {});
                        }

                        const warningMsg = await channel.send({
                            content: `⚠️ <@${userId}> **سپام مەکرە!** پەیامەکانت سڕرانەوە و بۆ ماوەی ٥ خولەک بێدەنگکرایت.`
                        });

                        setTimeout(() => {
                            warningMsg.delete().catch(() => {});
                        }, 5000);

                        return; // ئەگەر سپام ئەنجام درا، ڕێگری لە بەردەوامبوونی کۆدەکە دەکەین بۆ ئەوەی بەدوای تگدا نەگەڕێت
                    } catch (error) {
                        console.error('هەڵە لە سیستەمی ئەنتی سپام:', error);
                    }
                }
            }
        }

        // ==========================================
        // ٢. وەڵامدانەوەی زیرەکی دەستکرد کاتێک بۆتەکە تگ دەکرێت
        // ==========================================
        if (message.mentions.has(message.client.user)) {
            // لابردنی تگەکە لە نامەکە بۆ ئەوەی تەنها پرسیارەکە بمێنێت
            const query = message.content
                .replace(`<@!${message.client.user.id}>`, '')
                .replace(`<@${message.client.user.id}>`, '')
                .trim();

            if (!query) return;

            try {
                // نیشاندانی دۆخی تایپکردن لە چاتەکەدا
                await message.channel.sendTyping();

                // ناردنی داواکاری بۆ OpenAI API
                const response = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
                    },
                    body: JSON.stringify({
                        model: 'gpt-3.5-turbo',
                        messages: [{ role: 'user', content: query }]
                    })
                });

                const data = await response.json();
                const replyText = data.choices?.[0]?.message?.content || "ببوورە، ناتوانم لەم پرسیارە تێبگەم.";

                // وەڵامدانەوە بۆ بەکارهێنەر لە دیسکۆرد
                await message.reply(replyText);

            } catch (error) {
                console.error("AI Error:", error);
                await message.reply("ببوورە، هەڵەیەک ڕوویدا لە پەیوەندیکردن بە زیرەکی دەستکردەوە.");
            }
        }
    },
};
