const { PermissionsBitField, Events } = require('discord.js');
const fs = require('fs');

// خەزنکردنی کاتی پەیامی بەکارهێنەران بۆ دیاریکردنی سپامی لەسەریەک
const spamTracker = new Map();

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.bot || !message.guild) return;

        // پشکنینی دۆخی ئەنتی سپام لە فایلی antispam.json
        const file = "./antispam.json";
        let antiSpamEnabled = false;

        if (fs.existsSync(file)) {
            try {
                const fileData = JSON.parse(fs.readFileSync(file, 'utf8'));
                antiSpamEnabled = fileData.enabled;
            } catch (e) {
                console.error("هەڵە لە خوێندنەوەی فایلی antispam.json:", e);
            }
        }

        // ئەگەر ئەنتی سپام چالاک بوو
        if (antiSpamEnabled) {
            // بەڕێوەبەران و ئەدمنەکان سزادەدرێنە دەرەوەی ئەم سیستەمە
            if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                const userId = message.author.id;
                const channel = message.channel;
                const currentTime = Date.now();

                if (!spamTracker.has(userId)) {
                    spamTracker.set(userId, []);
                }

                const timestamps = spamTracker.get(userId);
                timestamps.push(currentTime);

                // پشکنینی پەیامەکان لە ماوەی ٦ چرکەدا (بۆ ئەوەی دڵنیابین ٥ پەیامی لەسەریەکە)
                const timeWindow = 6000; 
                const recentMessages = timestamps.filter(time => currentTime - time < timeWindow);
                spamTracker.set(userId, recentMessages);

                // ئەگەر گەیشتە ٥ پەیام یان زیاتر لەسەریەک
                if (recentMessages.length >= 5) {
                    spamTracker.set(userId, []); // پاککردنەوەی لۆگەکە بۆ ڕێگری لە دوبارەبوونەوەی خێرا

                    try {
                        const member = await message.guild.members.fetch(userId);

                        // ١. بێدەنگکردنی بەکارهێنەر (Timeout) بۆ ماوەی تەواوی ٥ خولەک
                        if (member && member.moderatable) {
                            await member.timeout(5 * 60 * 1000, 'سپام کردن و ناردنی ٥ پەیامی لەسەریەک');
                        }

                        // ٢. سڕینەوەی پەیامەکانی ئەو کەسە لە کەناڵەکەدا
                        const fetchedMessages = await channel.messages.fetch({ limit: 50 });
                        const userMessages = fetchedMessages.filter(m => m.author.id === userId);

                        if (userMessages.size > 0) {
                            await channel.bulkDelete(userMessages, true).catch(() => {});
                        }

                        // ٣. ناردنی ئاگادارییەک و سڕینەوەی پاش ٥ چرکە
                        const warningMsg = await channel.send({
                            content: `⚠️ <@${userId}> **سپام قەدەغەیە!** ٥ پەیامت لەسەریەک نارد، بۆیە سەرجەم پەیامەکانت سڕرانەوە و بۆ ماوەی **٥ خولەک** بێدەنگکرایت.`
                        });

                        setTimeout(() => {
                            warningMsg.delete().catch(() => {});
                        }, 5000);

                        return;
                    } catch (error) {
                        console.error('هەڵە لە جێبەجێکردنی سیستەمی ئەنتی سپام:', error);
                    }
                }
            }
        }

        // وەڵامدانەوەی زیرەکی دەستکرد کاتێک بۆتەکە تگ دەکرێت
        if (message.mentions.has(message.client.user)) {
            const query = message.content
                .replace(`<@!${message.client.user.id}>`, '')
                .replace(`<@${message.client.user.id}>`, '')
                .trim();

            if (!query) return;

            try {
                await message.channel.sendTyping();

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

                await message.reply(replyText);

            } catch (error) {
                console.error("AI Error:", error);
                await message.reply("ببوورە، هەڵەیەک ڕوویدا لە پەیوەندیکردن بە زیرەکی دەستکردەوە.");
            }
        }
    },
};
