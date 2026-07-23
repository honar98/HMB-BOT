const { useMainPlayer, QueryType } = require("discord-player");

module.exports = {
    name: "play",

    async execute(message, args) {
        const voiceChannel = message.member.voice.channel;

        if (!voiceChannel) {
            return message.reply("❌ تۆ دەبێت لە Voice Channel بیت.");
        }

        const query = args.join(" ");

        if (!query) {
            return message.reply("❌ تکایە ناوی گۆرانی بنووسە.");
        }

        try {
            const player = useMainPlayer();

            const result = await player.search(query, {
                requestedBy: message.author,
                searchEngine: query.startsWith("http")
                    ? QueryType.YOUTUBE_VIDEO
                    : QueryType.AUTO
            });

            if (!result.hasTracks()) {
                return message.reply("❌ هیچ گۆرانییەک نەدۆزرایەوە.");
            }

            await player.play(voiceChannel, result, {
                nodeOptions: {
                    metadata: message.channel,
                },
            });

            return message.reply(
                `🎵 ئێستا پەخش دەکرێت: **${result.tracks[0].title}**`
            );
        } catch (err) {
            console.error(err);
            return message.reply("❌ هەڵەیەک ڕوویدا لە کاتی پەخشکردنی گۆرانی.");
        }
    },
};
