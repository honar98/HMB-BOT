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
                console.error(e);
            }
        }

        // ئەگەر ئەنتی سپام چالاک بوو
        if (antiSpamEnabled) {
            // باج نەدان بە ئەدمنەکان
            if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                const userId = message.author.id;
                const channel = message.channel;
                const currentTime = Date.now();

                if (!spamTracker.has(userId)) {
                    spamTracker.set(userId, []);
                }

                const timestamps = spamTracker.get(userId);
                timestamps.push(currentTime);

                // ماوەی ٧ چرکە بۆ پشکنینی ٥ پەیام
                const timeWindow = 7000;
                const recentMessages = timestamps.filter(time => currentTime - time < timeWindow);
                spamTracker.set(userId, recentMessages);

                // ئەگەر ٥ پەیامی لەسەریەک نارد
                if (recentMessages.length >= 5) {
                    spamTracker.set(userId, []);

                    try {
                        const member = await message.guild.members.fetch(userId).catch(() => null);

                        // ١. مێوتکردنی بەکارهێنەر بۆ ماوەی ٥ خولەک
                        if (member && member.moderatable) {
                            await member.timeout(5 * 60 * 1000, 'سپام کردن و ناردنی ٥ پەیامی لەسەریەک');
                        }

                        // ٢. سڕینەوەی پەیامەکانی ئەو کەسە لە چاتەکەدا
                        const fetchedMessages = await channel.messages.fetch({ limit: 20 });
                        const userMessages = fetchedMessages.filter(m => m.author.id === userId);

                        for (const [id, msg] of userMessages) {
                            await msg.delete().catch(() => {});
                        }

                        // ٣. ناردنی ئاگاداری و پاشان سڕینەوەی خۆکارانەی پەیامی بۆتەکە دوای ٥ چرکە
                        const warningMsg = await channel.send({
                            content: `⚠️ <@${userId}> **سپام مەکرە!** سەرجەم پەیامەکانت سڕرانەوە و بۆ ماوەی **٥ خولەک** مێوتکرایت.`
                        });

                        setTimeout(() => {
                            warningMsg.delete().catch(() => {});
                        }, 5000);

                        return;
                    } catch (error) {
                        console.error('❌ هەڵە لە جێبەجێکردنی ئەنتی سپام:', error);
                    }
                }
            }
        }
    },
};
