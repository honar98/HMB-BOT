const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('giveaway')
        .setDescription('بەڕێوەبردنی سەکۆی گیوەیدەکان (Giveaways)')
        .addSubcommand(subcommand =>
            subcommand
                .setName('start')
                .setDescription('دەستپێکردنی گیوەیدێکی نوێ')
                .addStringOption(option =>
                    option.setName('duration')
                        .setDescription('ماوەی گیوەیدەکە (بۆ نموونە: 1h بۆ کاتژمێرێک، 1d بۆ ڕۆژێک)')
                        .setRequired(true)
                )
                .addIntegerOption(option =>
                    option.setName('winners')
                        .setDescription('ژمارەی براوەکان')
                        .setRequired(true)
                        .setMinValue(1)
                )
                .addStringOption(option =>
                    option.setName('prize')
                        .setDescription('دیاری یان خەڵاتی گیوەیدەکە')
                        .setRequired(true)
                )
                .addChannelOption(option =>
                    option.setName('channel')
                        .setDescription('ئەو کەناڵەی گیوەیدەکەی تێدا دابنرێت')
                        .addChannelTypes(ChannelType.GuildText)
                        .setRequired(false)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('reroll')
                .setDescription('دووبارە هەڵبژاردنەوەی براوە بۆ گیوەیدێک')
                .addStringOption(option =>
                    option.setName('message_id')
                        .setDescription('ئایدی پەیامی گیوەیدەکە')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('end')
                .setDescription('کۆتایی پێهێنانی گیوەیدێک پێش کاتی خۆی')
                .addStringOption(option =>
                    option.setName('message_id')
                        .setDescription('ئایدی پەیامی گیوەیدەکە')
                        .setRequired(true)
                )
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        const giveawaysManager = interaction.client.giveawaysManager;

        if (subcommand === 'start') {
            const duration = interaction.options.getString('duration');
            const winnerCount = interaction.options.getInteger('winners');
            const prize = interaction.options.getString('prize');
            const channel = interaction.options.getChannel('channel') || interaction.channel;

            await interaction.reply({ content: `✅ گیوەیدەکە لە کەناڵی ${channel} دەستپێکرد!`, ephemeral: true });

            await giveawaysManager.start(channel, {
                duration: duration,
                prize: prize,
                winnerCount: winnerCount,
                hostedBy: interaction.user,
                messages: {
                    giveaway: '🎉 **گیوەید (GIVEAWAY)** 🎉',
                    giveawayEnded: '🎉 **گیوەید کۆتایی هات** 🎉',
                    title: '{this.prize}',
                    drawing: 'کاتی ماوە: {timestamp}',
                    dropMessage: 'بە زووترین کات بەشداری بکە!',
                    inviteToParticipate: 'ریاکشن بکە بە 🎉 بۆ بەشداریکردن!',
                    winMessage: '🎊 پیرۆزە، {winners}! تۆ بردتەوە **{this.prize}**!',
                    embedFooter: 'گیوەیدەکان',
                    noWinner: 'گیوەیدەکە هەڵوەشایەوە، هیچ بەکارهێنەرێکی ڕاست نەدۆزرایەوە.',
                    hostedBy: 'لەلایەن: {this.hostedBy}',
                    winners: 'براوە(کان):',
                    endedAt: 'کۆتایی هات لە:'
                }
            });
        } 
        else if (subcommand === 'reroll') {
            const messageId = interaction.options.getString('message_id');

            giveawaysManager.reroll(messageId)
                .then(() => {
                    interaction.reply({ content: '✅ بە سەرکەوتوویی براوەی نوێ هەڵبژێردرا!', ephemeral: true });
                })
                .catch((err) => {
                    interaction.reply({ content: `❌ هەڵە: نەتوانرا گیوەیدەکە بدۆزرێتەوە یان هێشتا بەردەوامە.\n\`${err.message}\``, ephemeral: true });
                });
        } 
        else if (subcommand === 'end') {
            const messageId = interaction.options.getString('message_id');

            giveawaysManager.end(messageId)
                .then(() => {
                    interaction.reply({ content: '✅ گیوەیدەکە کۆتایی پێهێنرا!', ephemeral: true });
                })
                .catch((err) => {
                    interaction.reply({ content: `❌ هەڵە: نەتوانرا گیوەیدەکە بدۆزرێتەوە یان پێشتر کۆتایی هاتووە.\n\`${err.message}\``, ephemeral: true });
                });
        }
    },
};
