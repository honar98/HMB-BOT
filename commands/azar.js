const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ComponentType } = require('discord.js');

// لیستی گۆرانی و تراکەکان (پێنج تراکی تێدایە)
const azarTracks = [
    { label: "MONTAGEM PEGADORA", value: "song_1", query: "MONTAGEM PEGADORA" },
    { label: "MONTAGEM FANTASY (Super Slowed)", value: "song_2", query: "MONTAGEM FANTASY Super Slowed" },
    { label: "سلام وعن بعد - سید سلام الحسيني", value: "song_3", query: "سلام وعن بعد سید سلام الحسيني عزاء الناصرية الموحد" },
    { label: "خلصن بجي عيوني - مسلم الوائلي", value: "song_4", query: "خلصن بجي عيوني مسلم الوائلي" },
    { label: "انا المركز الاول بالبطولات", value: "song_5", query: "انا المركز الاول بالبطولات" }
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('azar')
        .setDescription('مێنوی تایبەت بە گۆرانییەکانی ازهر الناطق و لێدانی ڕاستەوخۆ 🎵'),

    async execute(interaction) {
        const vc = interaction.member.voice.channel;
        if (!vc) {
            return interaction.reply({ 
                content: "❌ تکایە سەرەتا بچۆ ناو کەناڵێکی دەنگییەوە بۆ ئەوەی بۆتەکە گۆرانییەکان لێبدات.", 
                ephemeral: true 
            });
        }

        const embed = new EmbedBuilder()
            .setColor('#9B59B6')
            .setTitle('🎧 مێنوی دەنگپەخشی ازهر الناطق')
            .setDescription('تکایە لە مێنوی خوارەوە گۆرانی یان تراکی دەتەوێت هەڵیبژێرە:')
            .setTimestamp()
            .setFooter({ 
                text: `داواکراوە لەلایەن ${interaction.user.tag}`, 
                iconURL: interaction.user.displayAvatarURL({ dynamic: true }) 
            });

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('azar_menu')
            .setPlaceholder('تراکێک هەڵبژێرە...')
            .addOptions(
                azarTracks.map(track => ({
                    label: track.label,
                    value: track.value,
                    description: 'کلیک بکە بۆ لێدانی ڕاستەوخۆی ئەم تراکە'
                }))
            );

        const row = new ActionRowBuilder().addComponents(selectMenu);

        const response = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true });

        const collector = response.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time: 30000 });

        collector.on('collect', async i => {
            if (i.user.id !== interaction.user.id) {
                return i.reply({ content: "❌ ئەم مێنویە تەنها بۆ ئەو کەسەیە کە فەرمانەکەی نووسیوە!", ephemeral: true });
            }

            const selectedValue = i.values[0];
            const track = azarTracks.find(t => t.value === selectedValue);

            await i.deferUpdate();

            try {
                const player = i.client.player;
                
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
                await i.editReply({ content: "❌ هەڵەیەک ڕوویدا لە لێدانی ئەم تراکە. دڵنیا ببەوە لەوەی ناوەکە ڕاستە.", embeds: [], components: [] });
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
