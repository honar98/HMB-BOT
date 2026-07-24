const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');

// دەتوانیت لێرەدا پرسیاری زیاتر زیاد بکەیت
const questions = [
    { question: "گەورەترین هەسارە لە کۆمەڵەی خۆردا کامەیە؟", options: ["زوحەل", "مەریخ", "موشتەری", "زهره"], correct: 2 },
    { question: "پایتەختی وڵاتی ژاپۆن کامەیە؟", options: ["کیۆتۆ", "تۆکیۆ", "ئۆساکا", "هێرۆشیما"], correct: 1 },
    { question: "خێرا ترین گیانلەبەر لە وشکاییدا کامەیە؟", options: ["شێر", "گورگ", "پڵنگ", "گورگڕسک (چیتە)"], correct: 3 },
    { question: "کام لەم توخمانە زۆرترین ڕێژەی لە گەردووندا هەیە؟", options: ["هایدرۆجین", "هێلیۆم", "ئۆکسجین", "کاربۆن"], correct: 0 },
    { question: "ئاو لە چ پلەیەکدا لە پەستانی ئاساییدا دەکوڵێت؟", options: ["٩٠ پلە", "٨٠ پلە", "١٠٠ پلە", "١٢٠ پلە"], correct: 2 },
    { question: "گەورەترین زەریای جیهان کامەیە؟", options: ["زەریای هێمن", "زەریای ئەتڵەسی", "زەریای هیند", "زەریای باکووری سارد"], correct: 0 },
    { question: "درێژترین ڕووبار لە جیهاندا کامەیە؟", options: ["ڕووباری ئەمەزۆن", "ڕووباری نیل", "ڕووباری میسیسیپی", "ڕووباری یانگسێ"], correct: 1 },
    { question: "کێ تیۆری نسبییەتی گشتی دۆزیەوە؟", options: ["سێر اسحاق نیوتن", "گالیلۆ گالیلی", "ئالبێرت ئەینشتاین", "ستیفن هایکنگ"], correct: 2 },
    { question: "زمانە فەرمییەکەی وڵاتی بەڕازیل کامەیە؟", options: ["ئیسپانی", "پورتوگالی", "فەرەنسی", "ئینگلیزی"], correct: 1 },
    { question: "ژمارەی ئێسکەکانی جەستەی مرۆڤی پێگەیشتوو چەندە؟", options: ["١٨٠", "٢٠٦", "٢٥٠", "٣٠٠"], correct: 1 }
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('quiz')
        .setDescription('یاری پرسیار و وەڵام بە شێوازی بەردەوام (خاڵ و وەستان) 🧠'),

    async execute(interaction) {
        let score = 0; // هەژمارکردنی خاڵەکان
        let questionCount = 0; // ژمارەی پرسیارەکان

        // دروستکردنی فەنکشنێک بۆ ناردنی پرسیارەکان بە شێوازی بازنەیی (Loop)
        const playRound = async (currentInteraction, isFirst = false) => {
            // هەڵبژاردنی پرسیارێکی هەڕەمەکی
            const q = questions[Math.floor(Math.random() * questions.length)];
            questionCount++;

            // ئێمبێدی پرسیارەکە
            const embed = new EmbedBuilder()
                .setColor('#3498DB')
                .setTitle(`🧠 یاری پرسیار و وەڵام | پرسیاری ${questionCount}`)
                .setDescription(`**${q.question}**\n\nتکایە یەکێک لە بژاردەکانی خوارەوە هەڵبژێرە:`)
                .setFooter({ text: `خاڵەکانت: ${score} | یاریزاکان: ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

            // دووگمەکانی وەڵامدانەوە
            const row = new ActionRowBuilder();
            q.options.forEach((option, index) => {
                row.addComponents(
                    new ButtonBuilder()
                        .setCustomId(`quiz_${index}`)
                        .setLabel(option)
                        .setStyle(ButtonStyle.Primary)
                );
            });

            // زیادکردنی دووگمەی وەستان بۆ کۆتایی هێنان بە یارییەکە
            const stopRow = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('quiz_stop')
                    .setLabel('وەستان و بینینی ئەنجام 🛑')
                    .setStyle(ButtonStyle.Danger)
            );

            let response;
            if (isFirst) {
                // ئەگەر یەکەم پرسیار بوو، ڕاستەوخۆ وەڵامی فەرمانەکە دەداتەوە
                response = await currentInteraction.reply({ embeds: [embed], components: [row, stopRow], fetchReply: true });
            } else {
                // ئەگەر پرسیارەکانی دواتر بوو، وەک پەیامێکی نوێ (FollowUp) دەینێرێت
                response = await currentInteraction.followUp({ embeds: [embed], components: [row, stopRow], fetchReply: true });
            }

            // وەرگرتنی وەڵام بۆ ماوەی 30 چرکە
            const collector = response.createMessageComponentCollector({ componentType: ComponentType.Button, time: 30000 });

            collector.on('collect', async i => {
                // تەنها ئەو کەسە دەتوانێت یاری بکات کە فەرمانەکەی داوە
                if (i.user.id !== interaction.user.id) {
                    return i.reply({ content: "❌ ئەم یارییە بۆ کەسێکی ترە، خۆت فەرمانی `/quiz` بنووسە!", ephemeral: true });
                }

                // ئەگەر کلیکی لە دووگمەی وەستان کرد
                if (i.customId === 'quiz_stop') {
                    embed.setColor('#9B59B6').setDescription(`🛑 **یارییەکە وەستێنرا.**\n\n📊 کۆی خاڵەکانت: **${score} لە ${questionCount - 1}** وەڵامی ڕاست.`);
                    await i.update({ embeds: [embed], components: [] });
                    collector.stop('stopped');
                    return;
                }

                const selectedIndex = parseInt(i.customId.split('_')[1]);
                
                // ڕەنگکردنی دووگمەکان (ڕاست بە سەوز و هەڵە بە سوور)
                const disabledRow = new ActionRowBuilder();
                q.options.forEach((option, index) => {
                    let style = ButtonStyle.Secondary;
                    if (index === q.correct) style = ButtonStyle.Success;
                    else if (index === selectedIndex) style = ButtonStyle.Danger;

                    disabledRow.addComponents(
                        new ButtonBuilder()
                            .setCustomId(`quiz_disabled_${index}`)
                            .setLabel(option)
                            .setStyle(style)
                            .setDisabled(true)
                    );
                });

                if (selectedIndex === q.correct) {
                    score++;
                    embed.setColor('#2ECC71').setDescription(`**${q.question}**\n\n🎉 **پیرۆزە! وەڵامەکەت ڕاستە.**\nخاڵەکانت بوو بە: **${score}**`);
                } else {
                    embed.setColor('#E74C3C').setDescription(`**${q.question}**\n\n❌ **وەڵامەکەت هەڵە بوو!**\nوەڵامی ڕاست ئەوە بوو: **${q.options[q.correct]}**`);
                }

                await i.update({ embeds: [embed], components: [disabledRow] });
                collector.stop('answered');
                
                // پاش ٢ چرکە (2000 میلی چرکە)، پرسیارێکی نوێ دەنێرێت
                setTimeout(() => {
                    playRound(i, false);
                }, 2000);
            });

            collector.on('end', async (collected, reason) => {
                // ئەگەر کاتەکەی بەسەرچوو و هیچ وەڵامێکی نەدایەوە
                if (reason === 'time') {
                    const timeoutRow = new ActionRowBuilder();
                    q.options.forEach((option, index) => {
                        timeoutRow.addComponents(
                            new ButtonBuilder()
                                .setCustomId(`quiz_timeout_${index}`)
                                .setLabel(option)
                                .setStyle(ButtonStyle.Secondary)
                                .setDisabled(true)
                        );
                    });
                    embed.setColor('#95A5A6').setDescription(`**${q.question}**\n\n⏰ **کات بەسەرچوو! یارییەکە کۆتایی هات.**\n📊 کۆی خاڵەکانت: **${score}**`);
                    
                    try {
                        if (isFirst) await interaction.editReply({ embeds: [embed], components: [timeoutRow] });
                        else await currentInteraction.editReply({ embeds: [embed], components: [timeoutRow] });
                    } catch(e) { console.error(e); }
                }
            });
        };

        // دەستپێکردنی یەکەم پرسیار
        await playRound(interaction, true);
    },
};
