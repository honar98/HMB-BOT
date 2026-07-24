const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ComponentType } = require('discord.js');

// لیستی تراکەکان بە ناونیشان (بێ پێویست بوون بە لینکی ڕەق)
const azarTracks = [
    { label: "تراکی یەکەم - ازهر الناطق", value: "azar_1", query: "ازهر الناطق" },
    { label: "تراکی دووەم - ازهر الناطق", value: "azar_2", query: "ازهر الناطق" },
    { label: "تراکی سێیەم - ازهر الناطق", value: "azar_3", query: "ازهر الناطق" },
    { label: "تراکی چوارەم - ازهر الناطق", value: "azar_4", query: "ازهر الناطق" }
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('azar')
        .setDescription('مێنوی تایبەت بە گۆرانییەکانی ازهر الناطق و لێدانی ڕاستەوخۆ 🎵'),

    async execute(interaction) {
        // پشکنین بۆ ئەوەی ئایا بەکارهێنەر لە کەناڵی دەنگیدایە یان نا
        const vc = interaction.member.voice.channel;
        if (!vc) {
            return interaction.reply({ 
                content: "❌ تکایە سەرەتا بچۆ ناو کەناڵێکی دەنگییەوە بۆ ئەوەی بۆتەکە گۆرانییەکان لێبدات.", 
                ephemeral: true 
            });
        }

        // دروستکردنی ئێمبێدی ڕەنگاوڕەنگ و پرۆفیشناڵ
        const embed = new EmbedBuilder()
            .setColor('#9B59B6')
            .setTitle('🎧 مێنوی تایبەتی ازهر الناطق')
            .setDescription('تکایە لە مێنوی خوارەوە ئەو تراکەی دەتەوێت هەڵیبژێرە بۆ ئەوەی ڕاستەوخۆ بۆت لێبدرێت:')
            .setTimestamp()
            .setFooter({ 
                text: `داواکراوە لەلایەن ${interaction.user.tag}`, 
                iconURL: interaction.user.displayAvatarURL({ dynamic: true }) 
            });

        // دروستکردنی مێنوی هەڵبژاردن (Dropdown Menu)
        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('azar_menu')
            .setPlaceholder('تراکێک لە مێنوی ازهر الناطق هەڵبژێرە...')
            .addOptions(
                azarTracks.map(track => ({
                    label: track.label,
                    value: track.value,
                    description: 'کلیک بکە بۆ لێدانی ڕاستەوخۆی ئەم تراکە'
                }))
            );

        const row = new ActionRowBuilder().addComponents(selectMenu);

        // ناردنی پەیامەکە لەگەڵ مێنوەکە
        const response = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true });

        // کۆلێکتۆر بۆ وەرگرتنی هەڵبژاردنی بەکارهێنەر (بۆ ماوەی ٣٠ چرکە)
        const collector = response.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time: 30000 });

        collector.on('collect', async i => {
            if (i.user.id !== interaction.user.id) {
                return i.reply({ content: "❌ ئەم مێنویە تەنها بۆ ئەو کەسەیە کە فەرمانەکەی نووسیوە!", ephemeral: true });
            }

            const selectedValue = i.values[0];
            const track = azarTracks.find(t => t.value === selectedValue);

            // نیشاندانی بارودۆخی چاوەڕوانی
            await i.deferUpdate();

            try {
                const player = i.client.player;
                
                // لێدانی ڕاستەوخۆی گۆرانییەکە بەپێی ناونیشانەکەی
                const { track: playedTrack } = await player.play(vc, track.query, {
                    nodeOptions: {
                        metadata: i.channel,
                        leaveOnEmpty: true,
                        leaveOnEmptyCooldown: 30000,
                        leaveOnEnd: true,
                        leaveOnEndCooldown: 30000,
                    }
                });

                const successEmbed = new EmbedBuilder()
                    .setColor('#2ECC71')
                    .setTitle('🎶 دەنگپەخش کراوە')
                    .setDescription(`بۆتەکە سەرکەوتووانە دەستیکرد بە لێدانی:\n✨ **${playedTrack.title}**`)
                    .setTimestamp()
                    .setFooter({ text: `هەڵبژێردرا لەلایەن ${i.user.tag}`, iconURL: i.user.displayAvatarURL({ dynamic: true }) });

                await i.editReply({ embeds: [successEmbed], components: [] });
            } catch (error) {
                console.error(error);
                await i.editReply({ content: "❌ هەڵەیەک ڕوویدا لە لێدانی ئەم تراکە. دڵنیا ببەوە لەوەی ناونیشانەکە ڕاستە.", embeds: [], components: [] });
            }

            collector.stop();
        });

        collector.on('end', async (collected, reason) => {
            if (reason === 'time') {
                const timeoutEmbed = new EmbedBuilder()
                    .setColor('#95A5A6')
                    .setTitle('⏰ کات بەسەرچوو')
                    .setDescription('مێنوی هەڵبژاردن بەسەرچوو، تکایە دیسان فەرمانی `/azar` بنووسەوە.');
                
                await interaction.editReply({ embeds: [timeoutEmbed], components: [] }).catch(() => {});
            }
        });
    },
};
