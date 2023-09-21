const maxVol = require(`../config.js`).opt.maxVol;

module.exports = {
	description: `Changes the volume of the music to max volume (${maxVol}%).`,
	name: `maxvolume`,
	options: [],
	voiceChannel: true,

	run: async (client, interaction) => {
		const queue = client.player.nodes.get(interaction.guild.id);

		if (!queue || !queue.node.isPlaying()) return interaction.reply({ content: `No music currently playing! ❌`, ephemeral: true }).catch((e) => { }); // eslint-disable-line no-unused-vars

		queue.node.setVolume(maxVol);

		return interaction.reply({ content: `Volume changed to max volume (**${maxVol}%**) 🔊` }).catch((e) => { }); // eslint-disable-line no-unused-vars
	}
};
