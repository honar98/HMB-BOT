const { useMainPlayer } = require("discord-player");

module.exports = {
  name: "debug",

  async execute(message) {
    const player = useMainPlayer();

    console.log("========== PLAYER ==========");
    console.dir(player, { depth: 2 });

    if (message.member.voice.channel) {
      console.log("VOICE CHANNEL:", message.member.voice.channel.id);
    } else {
      console.log("VOICE CHANNEL: NONE");
    }

    await message.reply("✅ Debug printed to console.");
  },
};
