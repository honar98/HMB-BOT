const { Events } = require('discord.js');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        // پشکنین بۆ ئەوەی دڵنیابین کە نێرەری نامەکە بۆتە
        if (message.author.bot) {
            try {
                // ڕاستەوخۆ سڕینەوەی نامەی بۆتەکە بۆ ڕێگریکردن لە سپام
                await message.delete();
                
                console.log(`نامەی سپامی بۆتێک لەلایەن ${message.author.tag}ـەوە سڕایەوە.`);
            } catch (error) {
                console.error("هەڵە ڕوویدا لە کاتی سڕینەوەی نامەی بۆتەکە:", error);
            }
        }
    },
};
