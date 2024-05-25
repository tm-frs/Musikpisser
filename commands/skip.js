const { QueueRepeatMode } = require(`discord-player`);

module.exports = {
	description: `Skip the current track and go on to the next track in queue`,
	name: `skip`,
	options: [],
	voiceChannel: true,

	run: async (client, interaction) => {
		const queue = client.player.nodes.get(interaction.guild.id);

		if (!queue || !queue.node.isPlaying()) return interaction.reply({ content: `No music currently playing! ❌`, ephemeral: true }).catch((e) => { });
		if (!queue.tracks.data[0] && !(queue.repeatMode === 2 || queue.repeatMode === 3)) return interaction.reply({ content: `No music in queue after current so this would stop the music ❌`, ephemeral: true }).catch((e) => { });

		if (queue.repeatMode === 1) {
			queue.setRepeatMode(QueueRepeatMode.OFF);
			setTimeout(function() {
				const success = queue.node.skip();
				return interaction.reply({ content: success ? `**${queue.currentTrack.title}**, the song currently playing, has been skipped ✅` : `Something went wrong ❌` }).catch((e) => { });
			}, 500);
			setTimeout(function() {
				queue.setRepeatMode(QueueRepeatMode.TRACK);
			}, 1000);
		} else {
			const success = queue.node.skip();
			return interaction.reply({ content: success ? `**${queue.currentTrack.title}**, the song currently playing, has been skipped ✅` : `Something went wrong ❌` }).catch((e) => { });
		}
	}
};
