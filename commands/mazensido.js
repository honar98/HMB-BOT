const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ComponentType } = require('discord.js');

// لیستی گۆرانی و دبکەکانی Mazen Assaf و Jano Sido
const mazenJanoTracks = [
    { label: "Mazen Assaf - البنت الأصيلة", value: "mj_1", query: "Mazen Assaf Al Bint Al Aseela" },
    { label: "Jano Sido - دبكة كردية حماسية", value: "mj_2", query: "Jano Sido Kurdish Dabke" },
    { label: "Mazen Assaf & Jano Sido - مكس حفلات دَبكة", value: "mj_3", query: "Mazen Assaf Jano Sido Dabke" },
    { label: "Mazen Assaf - يابا ليلى", value: "mj_4", query: "Mazen Assaf Yaba Layla" },
    { label: "Jano Sido - أغنية كردية تراثية", value: "mj_5", query: "Jano Sido Kurdish Song" }
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mazensido')
        .setDescription('مێنوی تایبەت بە گۆرانی و دبکەکانی مازن عەساف و ژانۆ سیدۆ 🎵'),

    async execute(interaction) {
        // پشکنین بۆ ئەوەی ئایا بەکارهێنەر لە کەناڵی دەنگیدایە یان نا
        const vc = interaction.member.voice.channel;
        if (!vc) {
            return interaction.reply({ 
                content: "❌ تکایە سەرەتا بچۆ ناو کەناڵێکی دەنگییەوە بۆ ئەوەی بۆتەکە گۆرانییەکان لێبدات.", 
                ephemeral: true 
            });
        }

        // دروستکردنی ئێمبێدی پرۆفیشناڵ
        const embed = new EmbedBuilder()
            .setColor('#E67E22')
            .setTitle('🎶 مێنوی گۆرانی و دبکەکانی Mazen Assaf & Jano Sido')
            .setDescription('تکایە لە مێنوی خوارەوە گۆرانی یان دبکەی دڵخوازت هەڵبژێرە بۆ لێدانی ڕاستەوخۆ:')
            .setTimestamp()
            .setFooter({ 
                text: `داواکراوە لەلایەن ${interaction.user.tag}`, 
                iconURL: interaction.user.displayAvatarURL({ dynamic: true }) 
            });

        // دروستکردنی مێنوی هەڵبژاردن (Dropdown Menu)
        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('mazen_jano_menu')
            .setPlaceholder('تراکێک لە لیستەکە هەڵبژێرە...')
            .addOptions(
                mazenJanoTracks.map(track => ({
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
            const track = mazenJanoTracks.find(t => t.value === selectedValue);

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
                await i.editReply({ content: "❌ هەڵەیەک ڕوویدا لە لێدانی ئەم گۆرانییە. دڵنیا ببەوە لەوەی ناوەکە ڕاست بێت.", embeds: [], components: [] });
            }

            collector.stop();
        });

        collector.on('end', async (collected, reason) => {
            if (reason === 'time') {
                const timeoutEmbed = new EmbedBuilder()
                    .setColor('#95A5A6')
                    .setTitle('⏰ کات بەسەرچوو')
                    .setDescription('مێنوی هەڵبژاردن بەسەرچوو، تکایە دیسان فەرمانی `/mazensido` بنووسەوە.');
                
                await interaction.editReply({ embeds: [timeoutEmbed], components: [] }).catch(() => {});
            }
        });
    },
};
