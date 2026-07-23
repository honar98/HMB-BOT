const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('دروستکردنی لینکی بانگێشتکردن بۆ سێروەرەکە')
        .setDefaultMemberPermissions(PermissionFlagsBits.CreateInstantInvite),

    async execute(interaction) {
        try {
            if (!interaction.guild) {
                return interaction.reply({ content: "❌ ئەم فەرمانە تەنها لە ناو سێروەردا کار دەکات.", ephemeral: true });
            }

            if (!interaction.channel || !interaction.channel.createInvite) {
                return interaction.reply({ content: "❌ من ناتوانم لەم کەناڵەدا لینکی بانگێشتکردن دروست بکەم.", ephemeral: true });
            }

            const invite = await interaction.channel.createInvite({
                maxAge: 0,
                maxUses: 0,
                unique: true,
                reason: `Invite created by ${interaction.user.tag}`,
            });

            const embed = new EmbedBuilder()
                .setColor(0x00AEFF)
                .setTitle("🔗 لینکی بانگێشتکردنی سێروەر")
                .setDescription(`[کلیک لێرە بکە بۆ جۆینبوون](${invite.url})`)
                .setFooter({
                    text: `داواکراوە لەلایەن ${interaction.user.tag}`,
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                })
                .setTimestamp();

            return interaction.reply({
                embeds: [embed],
            });

        } catch (err) {
            console.error(err);

            const errorEmbed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle("❌ سەرکەوتوو نەبوو لە دروستکردنی لینک")
                .setDescription(`\`\`\`${err.message}\`\`\``);

            if (interaction.replied || interaction.deferred) {
                return interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
            } else {
                return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }
        }
    },
};
