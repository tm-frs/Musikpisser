module.exports = {
	description: `Clears the current queue`,
	name: `clear`,
	options: [],
	voiceChannel: true,

	run: async (client, interaction) => {
		const queue = client.player.nodes.get(interaction.guild.id);

		if (!queue || !queue.node.isPlaying()) return interaction.reply({ content: `No music currently playing! ❌`, ephemeral: true }).catch((e) => { }); // eslint-disable-line no-unused-vars

		if (!queue.tracks[0]) return interaction.reply({ content: `There is already no music in queue after the current one ❌`, ephemeral: true }).catch((e) => { }); // eslint-disable-line no-unused-vars

		await queue.tracks.clear();

		interaction.reply({ content: `The queue has just been cleared. 🗑️` }).catch((e) => { }); // eslint-disable-line no-unused-vars
	}
};
