const { Events } = require("discord.js");

module.exports = (client) => {

  client.on(Events.GuildMemberAdd, async (member) => {
    const channel = member.guild.systemChannel;
    if (!channel) return;

    channel.send(
`🎉 Welcome ${member}!

👋 Welcome to **${member.guild.name}**
📊 Member #${member.guild.memberCount}

Enjoy your stay ❤️`
    );
  });

  client.on(Events.GuildMemberRemove, async (member) => {
    const channel = member.guild.systemChannel;
    if (!channel) return;

    channel.send(
`😢 ${member.user.tag} left the server.

📊 Members: ${member.guild.memberCount}`
    );
  });

};
