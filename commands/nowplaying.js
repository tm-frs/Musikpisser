const { Colors } = require(`discord.js`);
const { ButtonStyle } = require(`discord.js`);
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require(`discord.js`);

module.exports = {
	description: `Provides information about the music currently being played.`,
	name: `nowplaying`,
	options: [],

	run: async (client, interaction) => {
		const queue = client.player.nodes.get(interaction.guild.id);

		if (!queue || !queue.node.isPlaying()) return interaction.reply({ content: `No music currently playing! ❌`, ephemeral: true }).catch((e) => { }); // eslint-disable-line no-unused-vars

		const track = queue.currentTrack;

		const embed = new EmbedBuilder();

		embed.setColor(Colors.Blue); // blue = 0x3498DB
		embed.setThumbnail(track.thumbnail);
		embed.setTitle(`Currently playing track:`);

		const options = [`📴 (Loop mode: Off)`, `🔂 (Loop mode: Track)`, `🔁 (Loop mode: Queue)`, `▶ (Loop mode: Autoplay)`];
		const loopMode = options[queue.repeatMode];

		const timestamp = queue.node.getTimestamp();
		const trackDuration = timestamp.progress === `Forever` ? `Endless (Live)` : track.duration;
		const playlist = (typeof track.playlist === `undefined`) ? (`**Playlist:** \`none\``) : (`**Playlist:** [${track.playlist.title}](${track.playlist.url}) by \`${track.playlist.author.name}\``);

		embed.setDescription(`**Title:** \`${track.title}\`\n**Author:** \`${track.author}\`\n**URL:** ${track.url}\n${playlist}\n**Duration:** \`${trackDuration}\`\n**Loop Mode:** \`${loopMode}\`\n**Audio:** \`${queue.node.volume}%\`\n**Track added by:** ${track.requestedBy}`);

		embed.setTimestamp();
		embed.setFooter({ text: `Music Bot - by CraftingShadowDE`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

		const updateButton = new ButtonBuilder();
		updateButton.setLabel(`Update`);
		updateButton.setCustomId(`nowplaying`);
		updateButton.setStyle(ButtonStyle.Success);

		const saveButton = new ButtonBuilder();
		saveButton.setLabel(`Save Song`);
		saveButton.setCustomId(`saveTrack`);
		saveButton.setStyle(ButtonStyle.Success);

		const row = new ActionRowBuilder()
			.addComponents(updateButton)
			.addComponents(saveButton);

		interaction.reply({ embeds: [embed], components: [row] }).catch((e) => { }); // eslint-disable-line no-unused-vars
	}
};
