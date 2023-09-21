module.exports = {
	description: `Plays the previous song and moves the current one to queue.`,
	name: `back`,
	options: [],
	voiceChannel: true,

	run: async (client, interaction) => {
		const queue = client.player.nodes.get(interaction.guild.id);

		if (!queue || !queue.node.isPlaying()) return interaction.reply({ content: `No music currently playing! ❌`, ephemeral: true }).catch((e) => { }); // eslint-disable-line no-unused-vars

		if (!(queue.history.size > 0)) return interaction.reply({ content: `So far, no track has left the queue (or all were back-ed in again) ❌\n*(if the queue is looping so the tracks aren't actually removed, they don't count)*`, ephemeral: true }).catch((e) => { }); // eslint-disable-line no-unused-vars

		await queue.history.back();

		interaction.reply({ content: `Previous music started playing... ✅` }).catch((e) => { }); // eslint-disable-line no-unused-vars
	}
};
