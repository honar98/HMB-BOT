module.exports = (client) => {
  client.distube
    .on("playSong", (queue, song) => {
      queue.textChannel?.send(
        `🎵 **Now Playing:** ${song.name}\n👤 Requested by: ${song.user}`
      );
    })
    .on("addSong", (queue, song) => {
      queue.textChannel?.send(
        `➕ Added to queue: **${song.name}**`
      );
    })
    .on("finish", (queue) => {
      queue.textChannel?.send("✅ Playlist finished.");
    })
    .on("error", (error, queue) => {
      console.error("DISTUBE ERROR:", error);

      if (queue?.textChannel) {
        queue.textChannel.send(
          `❌ ${error?.message || "Unknown Error"}`
        );
      }
    });
};
