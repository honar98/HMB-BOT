const { Events } = require('discord.js');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        // ئەگەر نامەکە لەلایەن بۆتێکی ترەوە نێردرابوو، وەڵامی مەدەرەوە
        if (message.author.bot) return;

        // پشکنین بۆ ئەوەی ئایا بۆتەکە تگ (Mention) کراوە
        if (message.mentions.has(message.client.user)) {
            // لابردنی تگەکە لە نامەکە بۆ ئەوەی تەنها پرسیارەکە بنێرین
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
