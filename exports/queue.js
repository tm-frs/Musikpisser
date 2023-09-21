const createQueue = async (client, interaction, initVolume) => {
	const queue = await client.player.nodes.create(interaction.guild, {
		metadata: {
			channel: interaction.channel,
			client: client,
			requestedBy: interaction.user
		},
		leaveOnEnd: client.config.opt.voiceConfig.leaveOnEnd,
		selfDeaf: client.config.opt.voiceConfig.selfDeaf,
		volume: ((initVolume !== undefined) ? initVolume : client.config.opt.discordPlayer.initialVolume),
		volumeSmoothness: client.config.opt.discordPlayer.volumeSmoothness
	});
	return queue;
};
module.exports = {
	createQueue
};
