const { SlashCommandBuilder } = require('discord.js');
const { useMainPlayer } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('debug')
        .setDescription('پشکنینی دۆخی پلەیر و کەناڵی دەنگی بۆت'),

    async execute(interaction) {
        const player = useMainPlayer();

        console.log("========== PLAYER ==========");
        console.dir(player, { depth: 2 });

        console.log("VOICE:", interaction.member.voice.channel?.id || "NONE");

        return interaction.reply({ content: "✅ Debug OK", ephemeral: true });
    },
};
