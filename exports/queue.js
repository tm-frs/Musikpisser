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
        // play-dl only supports youtube and soundcloud (which I don't understand so it's not implemented)
        if (source === "youtube" && track.raw.source !== "spotify") {
            return (await playdl.stream(track.url, { discordPlayerCompatibility : true })).stream;
		/*} else if (source === "soundcloud") {
            playdl.getFreeClientID().then((clientID) => playdl.setToken({
				 soundcloud : {
					 client_id : clientID
				 }
			}))
			playdl.authorization();

			return (await playdl.stream(track.url, { discordPlayerCompatibility : true })).stream;*/
        } else {
            return null;
        }
      },
      spotifyBridge: true
    });
    return queue;
}
}
module.exports = {
    createQueue
};
