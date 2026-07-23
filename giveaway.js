const ms = require("ms");

module.exports = {
  name: "giveaway",
  aliases: ["gstart"],

  async execute(message, args) {
    if (!message.member.permissions.has("ManageGuild")) {
      return message.reply("❌ You don't have permission.");
    }

    const duration = args.shift();
    if (!duration) {
      return message.reply("Usage: $giveaway <time> <prize>");
    }

    const prize = args.join(" ");
    if (!prize) {
      return message.reply("Please provide a prize.");
    }

    client.giveawaysManager.start(message.channel, {
      duration: ms(duration),
      prize: prize,
      winnerCount: 1,
      hostedBy: message.author,

      messages: {
        giveaway: "🎉 **GIVEAWAY** 🎉",
        giveawayEnded: "🎉 **GIVEAWAY ENDED** 🎉",
        drawing: "Ends: {timestamp}",
        inviteToParticipate: "React with 🎉 to enter!",
        winMessage: "🎊 Congratulations {winners}! You won **{this.prize}**!",
        embedFooter: "HMB BOT",
        noWinner: "❌ No valid entries.",
        hostedBy: "Hosted by: {this.hostedBy}",
        winners: "Winner(s)",
        endedAt: "Ended at"
      }
    });

    return message.reply("✅ Giveaway started!");
  }
};


