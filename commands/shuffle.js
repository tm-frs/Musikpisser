module.exports = {
	description: `Shuffle the queue (current and next track are excluded)`,
	name: `shuffle`,
	options: [],
	voiceChannel: true,

	run: async (client, interaction) => {
		const queue = client.player.nodes.get(interaction.guild.id);


		if (!queue || !queue.node.isPlaying()) return interaction.reply({ content: `No music currently playing! ❌`, ephemeral: true }).catch((e) => { });

		if (queue || queue.node.isPlaying()) {
			let tempStorage = [queue.tracks.data];
			await queue.tracks.shuffle();
			tempStorage[1] = queue.tracks.data;
			const success = (tempStorage[0] !== tempStorage[1]);

			return interaction.reply({ content: success ? `Queue has been shuffled! ✅` : `Something went wrong. ❌` }).catch((e) => { });
		}
	}
};
