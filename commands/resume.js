module.exports = {
	description: `Resumes paused music.`,
	name: `resume`,
	options: [],
	voiceChannel: true,

	run: async (client, interaction) => {
		const queue = client.player.nodes.get(interaction.guild.id);

		if (!queue) return interaction.reply({ content: `No music currently playing! ❌`, ephemeral: true }).catch((e) => { }); // eslint-disable-line no-unused-vars

		const success = queue.node.resume();

		return interaction.reply({ content: success ? `The current song, **${queue.currentTrack.title}**, isn't paused anymore and continues to play. ✅` : `Something went wrong. ❌` }).catch((e) => { }); // eslint-disable-line no-unused-vars
	}
};
