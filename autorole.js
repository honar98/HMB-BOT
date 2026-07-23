const { Events } = require("discord.js");
const fs = require("fs");

module.exports = (client) => {
  client.on(Events.GuildMemberAdd, async (member) => {
    if (!fs.existsSync("autorole.json")) return;

    const data = JSON.parse(fs.readFileSync("autorole.json", "utf8"));
    const roleId = data[member.guild.id];

    if (!roleId) return;

    const role = member.guild.roles.cache.get(roleId);
    if (!role) return;

    try {
      await member.roles.add(role);
      console.log(`Auto Role added to ${member.user.tag}`);
    } catch (err) {
      console.error(err);
    }
  });
};
