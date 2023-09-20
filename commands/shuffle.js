module.exports = {
	description: `Shuffles the queue. (The current song and the next song won't be shuffled)`,
	name: `shuffle`,
	options: [],
	voiceChannel: true,

	run: async (client, interaction) => {
		const queue = client.player.nodes.get(interaction.guild.id);


		if (!queue || !queue.node.isPlaying()) return interaction.reply({ content: `No music currently playing! ❌`, ephemeral: true }).catch((e) => { }); // eslint-disable-line no-unused-vars

		if (queue || queue.node.isPlaying()) {
			const success = queue.tracks.shuffle();

			return interaction.reply({ content: success ? `Queue has been shuffled! ✅` : `Something went wrong. ❌` }).catch((e) => { }); // eslint-disable-line no-unused-vars
		}
	}
};
