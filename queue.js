const playdl = require("play-dl");

const createQueue = async (client, interaction) => {
if (!client.config.opt.playDl.replaceYtdl) {
    const queue = await client.player.createQueue(interaction.guild, {
      leaveOnEnd: client.config.opt.voiceConfig.leaveOnEnd,
      autoSelfDeaf: client.config.opt.voiceConfig.autoSelfDeaf,
      metadata: interaction.channel,
      initialVolume: client.config.opt.discordPlayer.initialVolume,
      volumeSmoothness: client.config.opt.discordPlayer.volumeSmoothness
    });
    return queue;
} else {
    const queue = await client.player.createQueue(interaction.guild, {
      leaveOnEnd: client.config.opt.voiceConfig.leaveOnEnd,
      autoSelfDeaf: client.config.opt.voiceConfig.autoSelfDeaf,
      metadata: interaction.channel,
      initialVolume: client.config.opt.discordPlayer.initialVolume,
      volumeSmoothness: client.config.opt.discordPlayer.volumeSmoothness,
      async onBeforeCreateStream(track, source, _queue) {
        // only trap youtube source
        if (source === "youtube") {
            // track here would be youtube track
            return (await playdl.stream(track.url, { discordPlayerCompatibility : true })).stream;
            // we must return readable stream or void (returning void means telling discord-player to look for default extractor)
        } else {
            return undefined;
        }
      },
      spotifyBridge: !client.config.opt.playDl.disableSpotifyBridge
    });
    return queue;
}

}
module.exports = {
    createQueue
};
