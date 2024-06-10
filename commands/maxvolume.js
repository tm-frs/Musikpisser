const botConfig = require(`../config.js`);
const maxVol = botConfig.opt.maxVol;

module.exports = {
	description: `Change the volume of the music to max volume (${maxVol}%)`,
	name: `maxvolume`,
	options: [],
	voiceChannel: true,

	run: async (client, interaction) => {
		const queue = client.player.nodes.get(interaction.guild.id);

		if (!queue || !queue.node.isPlaying()) return interaction.reply({ content: `No music currently playing! ❌`, ephemeral: true }).catch((e) => { });

		queue.node.setVolume(maxVol);

		return interaction.reply({ content: `Volume changed to max volume (**${maxVol}%**) 🔊` }).catch((e) => { });
	}
};
