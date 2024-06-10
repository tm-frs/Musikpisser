const botConfig = require(`../config.js`);
const createQueue = async (client, interaction, initVolume) => {
	const queue = await client.player.nodes.create(interaction.guild, {
		metadata: {
			channel: interaction.channel,
			client: client,
			requestedBy: interaction.user
		},
		leaveOnEnd: botConfig.opt.voiceConfig.leaveOnEnd,
		selfDeaf: botConfig.opt.voiceConfig.selfDeaf,
		volume: ((initVolume !== undefined) ? initVolume : botConfig.opt.discordPlayer.initialVolume),
		volumeSmoothness: botConfig.opt.discordPlayer.volumeSmoothness
	});
	return queue;
};
module.exports = {
	createQueue
};
