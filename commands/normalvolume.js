const botConfig = require(`../config.js`);
const initialVolume = botConfig.opt.discordPlayer.initialVolume;

module.exports = {
	description: `Change the volume of the music to normal/initial volume (${initialVolume}%)`,
	name: `normalvolume`,
	options: [],
	voiceChannel: true,

	run: async (client, interaction) => {
		const queue = client.player.nodes.get(interaction.guild.id);

		if (!queue || !queue.node.isPlaying()) return interaction.reply({ content: `No music currently playing! ❌`, ephemeral: true }).catch((e) => { });

		queue.node.setVolume(initialVolume);

		return interaction.reply({ content: `Volume changed to initial/normal volume (**${initialVolume}%**) 🔊` }).catch((e) => { });
	}
};
