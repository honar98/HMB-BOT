const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder
} = require("discord.js");

const { QueryType } = require("discord-player");
const cache = require("../utils/searchCache");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("search")
        .setDescription("گەڕان بەدوای گۆرانییەکدا و هەڵبژاردنی لە لیستێک")
        .addStringOption(option =>
            option.setName("query")
                .setDescription("ناوی ئەو گۆرانییەی دەتەوێت بگەڕێیت بەدوایدا")
                .setRequired(true)
        ),

    async execute(interaction) {
        const query = interaction.options.getString("query");
        const player = interaction.client.player;

        try {
            const result = await player.search(query, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            });

            if (!result.hasTracks()) {
                return interaction.reply({ content: "❌ هیچ گۆرانییەک نەدۆزرایەوە.", ephemeral: true });
            }

            const tracks = result.tracks.slice(0, 10);

            cache.set(interaction.user.id, tracks);

            const embed = new EmbedBuilder()
                .setColor("#5865F2")
                .setTitle("🔎 ئەنجامەکانی گەڕان (Search Results)")
                .setDescription(
                    tracks
                        .map((track, index) =>
                            `**${index + 1}.** ${track.title}\n👤 ${track.author} • ⏱️ ${track.duration}`
                        )
                        .join("\n\n")
                )
                .setFooter({
                    text: "گۆرانییەک لە لیستی خوارەوە هەڵبژێرە."
                });

            const menu = new StringSelectMenuBuilder()
                .setCustomId("music-search")
                .setPlaceholder("🎵 گۆرانییەک هەڵبژێرە");

            tracks.forEach((track, index) => {
                menu.addOptions({
                    label: track.title.substring(0, 100),
                    description: track.author.substring(0, 100),
                    value: index.toString()
                });
            });

            const row = new ActionRowBuilder().addComponents(menu);

            return interaction.reply({
                embeds: [embed],
                components: [row]
            });

        } catch (err) {
            console.error(err);
            return interaction.reply({
                content: "❌ هەڵەیەک ڕوویدا لە کاتی گەڕان بەدوای گۆرانی.",
                ephemeral: true
            });
        }
    }
};
