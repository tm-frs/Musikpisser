module.exports = {
	description: `Switches back to the previous song.`,
	name: `back`,
	options: [],
	voiceChannel: true,

	run: async (client, interaction) => {
		const queue = client.player.nodes.get(interaction.guild.id);

		if (!queue || !queue.node.isPlaying()) return interaction.reply({ content: `No music currently playing! ❌`, ephemeral: true }).catch((e) => { }); // eslint-disable-line no-unused-vars

		if (!queue.previousTracks[1]) return interaction.reply({ content: `There was no music playing before ❌`, ephemeral: true }).catch((e) => { }); // eslint-disable-line no-unused-vars

		await queue.history.back();

		interaction.reply({ content: `Previous music started playing... ✅` }).catch((e) => { }); // eslint-disable-line no-unused-vars
	}
};
