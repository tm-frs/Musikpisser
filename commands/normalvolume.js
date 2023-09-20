module.exports = {
	description: `Changes the volume of the music to initial/normal volume (default is 100%).`,
	name: `normalvolume`,
	options: [],
	voiceChannel: true,

	run: async (client, interaction) => {
		const queue = client.player.nodes.get(interaction.guild.id);

		if (!queue || !queue.node.isPlaying()) return interaction.reply({ content: `No music currently playing! ❌`, ephemeral: true }).catch((e) => { }); // eslint-disable-line no-unused-vars

		queue.node.setVolume(client.config.opt.discordPlayer.initialVolume);

		return interaction.reply({ content: `Volume changed to initial/normal volume (**${client.config.opt.discordPlayer.initialVolume}%**) 🔊` }).catch((e) => { }); // eslint-disable-line no-unused-vars
	}
};
