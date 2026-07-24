const { PermissionsBitField, Events } = require('discord.js');
const fs = require('fs');

const spamTracker = new Map();

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.bot || !message.guild) return;

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
            if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                const userId = message.author.id;
                const channel = message.channel;
                const currentTime = Date.now();

                if (!spamTracker.has(userId)) {
                    spamTracker.set(userId, []);
                }

                const timestamps = spamTracker.get(userId);
                timestamps.push(currentTime);

                const timeWindow = 7000; 
                const recentMessages = timestamps.filter(time => currentTime - time < timeWindow);
                spamTracker.set(userId, recentMessages);

                // ئەگەر ٥ پەیامی لەسەریەک نارد
                if (recentMessages.length >= 5) {
                    spamTracker.set(userId, []);

                    try {
                        const member = await message.guild.members.fetch(userId).catch(() => null);

                        // ١. هەوڵدان بۆ مێوتکردن و چاپکردنی هۆکارەکە ئەگەر سەرکەوتوو نەبوو
                        if (member) {
                            if (member.moderatable) {
                                await member.timeout(5 * 60 * 1000, 'سپام کردن و ناردنی ٥ پەیامی لەسەریەک');
                                console.log(`✅ سەرکەوتوو بوو لە مێوتکردنی بەکارهێنەر: ${message.author.tag}`);
                            } else {
                                console.log(`❌ ناتوانرێت ئەم بەکارهێنەرە مێوت بکرێت! هۆکار: ڕۆڵی بۆت لە خوار ڕۆڵی ئەم کەسەوەیە یان ئەم کەسە ئەدمنە.`);
                            }
                        }

                        // ٢. سڕینەوەی پەیامەکان یەک بە یەک و نیشاندانی هەڵە ئەگەر هەبێت
                        const fetchedMessages = await channel.messages.fetch({ limit: 30 });
                        const userMessages = fetchedMessages.filter(m => m.author.id === userId);

                        for (const [id, msg] of userMessages) {
                            await msg.delete().catch(err => {
                                console.log(`❌ هەڵە لە سڕینەوەی پەیام:`, err.message);
                            });
                        }

                        // ٣. ناردنی ئاگاداری
                        const warningMsg = await channel.send({
                            content: `⚠️ <@${userId}> **سپام قەدەغەیە!** ٥ پەیامت لەسەریەک نارد، سەرجەم پەیامەکانت سڕرانەوە و بۆ ماوەی **٥ خولەک** مێوتکرایت.`
                        });

                        setTimeout(() => {
                            warningMsg.delete().catch(() => {});
                        }, 5000);

                        return;
                    } catch (error) {
                        console.error('❌ هەڵە لە جێبەجێکردنی سیستەمی ئەنتی سپام:', error);
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
