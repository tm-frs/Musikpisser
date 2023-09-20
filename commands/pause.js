module.exports = {
	description: `Pauses the currently playing music.`,
	name: `pause`,
	options: [],
	voiceChannel: true,

	run: async (client, interaction) => {
		const queue = client.player.nodes.get(interaction.guild.id);

		if (!queue || !queue.node.isPlaying()) return interaction.reply({ content: `No music currently playing! ❌`, ephemeral: true }).catch((e) => { }); // eslint-disable-line no-unused-vars

		const success = queue.node.pause();

		return interaction.reply({ content: success ? `The song currently playing, **${queue.currentTrack.title}**, has been paused ✅` : `Something went wrong. ❌` }).catch((e) => { }); // eslint-disable-line no-unused-vars
	}
};
