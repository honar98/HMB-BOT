const fs = require("fs");

const raidFile = "./raid.json";

let joins = {};

if (fs.existsSync(raidFile)) {
  joins = JSON.parse(fs.readFileSync(raidFile, "utf8"));
}

module.exports = (client) => {
  client.on("guildMemberAdd", async (member) => {
    const guildId = member.guild.id;
    const now = Date.now();

    if (!joins[guildId]) {
      joins[guildId] = [];
    }

    joins[guildId].push(now);

    joins[guildId] = joins[guildId].filter(
      (time) => now - time < 60000
    );

    fs.writeFileSync(
      raidFile,
      JSON.stringify(joins, null, 2)
    );

    if (joins[guildId].length >= 10) {
      const channel = member.guild.systemChannel;

      if (channel) {
        channel.send(
          "🚨 **Raid Alert!**\n10 ئەندام لە ماوەی یەک خولەکدا هاتنە ناو سێرڤەر."
        ).catch(() => {});
      }

      console.log(
        `[ANTI RAID] Raid detected in ${member.guild.name}`
      );
    }
  });
};
