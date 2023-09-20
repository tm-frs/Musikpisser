module.exports = {
	description: `Music stops playing.`,
	name: `stop`,
	options: [],
	voiceChannel: true,

	run: async (client, interaction) => {
		const queue = client.player.nodes.get(interaction.guild.id);

		if (!queue || !queue.node.isPlaying()) return interaction.reply({ content: `No music currently playing! ❌`, ephemeral: true }).catch((e) => { }); // eslint-disable-line no-unused-vars

		queue.delete();

		interaction.reply({ content: `The music playing on this server has been turned off, see you next time! ✅` }).catch((e) => { }); // eslint-disable-line no-unused-vars
	}
};
