const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

// لیستی پرسیارەکان بە شێوازێکی زۆر ڕێکخراو و پرۆفیشناڵ
const questions = [
    {
        question: "گەورەترین هەسارە لە کۆمەڵەی خۆردا کامەیە؟",
        options: ["زوحەل", "مەریخ", "موشتەری", "زهره"],
        correct: 2
    },
    {
        question: "پایتەختی وڵاتی ژاپۆن کامەیە؟",
        options: ["کیۆتۆ", "تۆکیۆ", "ئۆساکا", "هێرۆشیما"],
        correct: 1
    },
    {
        question: "خێرا ترین گیانلەبەر لە وشکاییدا کامەیە؟",
        options: ["شێر", "گورگ", "پڵنگ", "گورگڕسک (چیتە)"],
        correct: 3
    },
    {
        question: "کام لەم توخمانە زۆرترین ڕێژەی لە گەردووندا هەیە؟",
        options: ["هایدرۆجین", "هێلیۆم", "ئۆکسجین", "کاربۆن"],
        correct: 0
    },
    {
        question: "ئاو لە چ پلەیەکدا لە پەستانی ئاساییدا دەکوڵێت؟",
        options: ["٩٠ پلە", "٨٠ پلە", "١٠٠ پلە", "١٢٠ پلە"],
        correct: 2
    },
    {
        question: "گەورەترین زەریای جیهان کامەیە؟",
        options: ["زەریای هێمن", "زەریای ئەتڵەسی", "زەریای هیند", "زەریای باکووری سارد"],
        correct: 0
    },
    {
        question: "درێژترین ڕووبار لە جیهاندا کامەیە؟",
        options: ["ڕووباری ئەمەزۆن", "ڕووباری نیل", "ڕووباری میسیسیپی", "ڕووباری یانگسێ"],
        correct: 1
    },
    {
        question: "کێ تیۆری نسبییەتی گشتی دۆزیەوە؟",
        options: ["سێر اسحاق نیوتن", "گالیلۆ گالیلی", "ئالبێرت ئەینشتاین", "ستیفن هایکنگ"],
        correct: 2
    },
    {
        question: "زمانە فەرمییەکەی وڵاتی بەڕازیل کامەیە؟",
        options: ["ئیسپانی", "پورتوگالی", "فەرەنسی", "ئینگلیزی"],
        correct: 1
    },
    {
        question: "ژمارەی ئێسکەکانی جەستەی مرۆڤی پێگەیشتوو چەندە؟",
        options: ["١٨٠", "٢٠٦", "٢٥٠", "٣٠٠"],
        correct: 1
    },
    {
        question: "پایتەختی وڵاتی فەرەنسا کامەیە؟",
        options: ["لەندەن", "بەرلین", "پاریس", "مادرید"],
        correct: 2
    },
    {
        question: "گەورەترین کیشوەر لە ڕووی رووبەرەوە لە جیهاندا کامەیە؟",
        options: ["ئەفریقا", "ئەمریکای باکوور", "ئاسیا", "ئەوروپا"],
        correct: 2
    },
    {
        question: "کامیان یەکەی پێوانەکردنی بەرگری کارەباییە؟",
        options: ["ڤۆڵت", "ئەمپێر", "ئۆهم", "وات"],
        correct: 2
    },
    {
        question: "خێراترین باڵندە لە جیهاندا کامەیە؟",
        options: ["داڵ", "باز (Peregrine Falcon)", "عقاب", "پەرەسێلکە"],
        correct: 1
    },
    {
        question: "بچووکترین هەسارە لە کۆمەڵەی خۆردا کامەیە؟",
        options: ["مەریخ", "عەتارد (مێرکوری)", "زهره", "پلوتۆ"],
        correct: 1
    }
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('quiz')
        .setDescription('یاری پرسیار و وەڵام لەگەڵ چەندین پرسیاری سەرنجڕکێش و دووگمەی کارا 🧠'),

    async execute(interaction) {
        try {
            // هەڵبژاردنی پرسیارێکی هەڕەمەکی لەناو لیستەکە
            const q = questions[Math.floor(Math.random() * questions.length)];

            // دروستکردنی ئێمبێدی پرۆفیشناڵ
            const embed = new EmbedBuilder()
                .setColor('#3498DB')
                .setTitle('🧠 یاری پرسیار و وەڵام (Quiz)')
                .setDescription(`**${q.question}**\n\nتکایە یەکێک لە بژاردەکانی خوارەوە هەڵبژێرە بۆ وەڵامدانەوە:`)
                .setFooter({ text: `داواکراوە لەلایەن ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                .setTimestamp();

            // دروستکردنی دووگمەکان بۆ بژاردەکان
            const row = new ActionRowBuilder();
            q.options.forEach((option, index) => {
                row.addComponents(
                    new ButtonBuilder()
                        .setCustomId(`quiz_${index}`)
                        .setLabel(option)
                        .setStyle(ButtonStyle.Primary)
                );
            });

            // ناردنی پەیامەکە لەگەڵ دووگمەکان
            const response = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true });

            // دروستکردنی کۆلێکتۆر بۆ وەرگرتنی کرتەی بەکارهێنەر (بۆ ماوەی 30 چرکە)
            const collector = response.createMessageComponentCollector({ time: 30000 });

            collector.on('collect', async i => {
                if (i.user.id !== interaction.user.id) {
                    return i.reply({ content: "❌ ئەم یارییە بۆ کەسێکی ترە، تکایە خۆت فەرمانی `/quiz` بنووسە!", ephemeral: true });
                }

                const selectedIndex = parseInt(i.customId.split('_')[1]);
                
                // نوێکردنەوەی دووگمەکان (ڕاست سەوز دەبێت، هەڵە سوور دەبێت)
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
                    embed.setColor('#2ECC71').setDescription(`**${q.question}**\n\n🎉 **پیرۆزە! وەڵامەکەت ڕاستە.**`);
                } else {
                    embed.setColor('#E74C3C').setDescription(`**${q.question}**\n\n❌ **وەڵامەکەت هەڵە بوو!**\nوەڵامی ڕاست ئەوە بوو: **${q.options[q.correct]}**`);
                }

                await i.update({ embeds: [embed], components: [disabledRow] });
                collector.stop();
            });

            collector.on('end', async collected => {
                if (collected.size === 0) {
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
                    embed.setColor('#95A5A6').setDescription(`**${q.question}**\n\n⏰ **کات بەسەرچوو! کەس وەڵامی نەداوە.**`);
                    await interaction.editReply({ embeds: [embed], components: [timeoutRow] }).catch(() => {});
                }
            });

        } catch (error) {
            console.error(error);
            if (!interaction.replied) {
                await interaction.reply({ content: "❌ هەڵەیەک ڕوویدا لە جێبەجێکردنی ئەم فەرمانە.", ephemeral: true });
            }
        }
    },
};
