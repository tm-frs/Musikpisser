const { Colors } = require(`discord.js`);
const { ButtonStyle } = require(`discord.js`);
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require(`discord.js`);
const { reformatString } = require(`../exports/timeStrings.js`);

module.exports = {
	run: async (client, interaction, queue, othervoicechannel) => { // eslint-disable-line no-unused-vars
		if (interaction.user.id !== interaction.message.interaction.user.id) {
			return interaction.reply({ content: `You aren't allowed to do this because you are not the person that executed the nowplaying-command! ❌`, ephemeral: true });
		}

		if (!queue || !queue.node.isPlaying()) return interaction.reply({ content: `No music currently playing! ❌`, ephemeral: true }).catch((e) => { });

		const track = queue.currentTrack;

		const options = [`📴 (Loop mode: Off)`, `🔂 (Loop mode: Track)`, `🔁 (Loop mode: Queue)`, `▶ (Loop mode: Autoplay)`];
		const loopMode = options[queue.repeatMode];

		const timestamp = queue.node.getTimestamp();
		const trackDuration = timestamp.progress === `Forever` ? `Endless (Live)` : reformatString(track.duration);
		const playlist = (typeof track.playlist === `undefined`) ? (`**Playlist:** \`none\``) : (`**Playlist:** [${track.playlist.title}](${track.playlist.url}) by \`${track.playlist.author.name}\``);


		const updateButton = new ButtonBuilder()
			.setLabel(`Update`)
			.setCustomId(`nowplayingUpdateButton`)
			.setStyle(ButtonStyle.Success);

		const saveButton = new ButtonBuilder()
			.setLabel(`Save Track`)
			.setCustomId(`nowplayingSaveTrackButton`)
			.setStyle(ButtonStyle.Success);

		const row = new ActionRowBuilder()
			.addComponents(updateButton)
			.addComponents(saveButton);

		const embed = new EmbedBuilder()
			.setColor(Colors.Blue) // blue = 0x3498DB
			.setThumbnail(track.thumbnail)
			.setTitle(`Currently playing track:`)
			.setDescription(`**Title:** \`${track.title}\`\n**Author:** \`${track.author}\`\n**URL:** ${track.url}\n${playlist}\n**Duration:** \`${trackDuration}\`\n**Loop Mode:** \`${loopMode}\`\n**Audio:** \`${queue.node.volume}%\`\n**Track added by:** ${track.requestedBy}`)
			.setTimestamp()
			.setFooter({ text: `Musikpisser Music Bot`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

		interaction.message.edit({ embeds: [embed], components: [row] }).catch((e) => { });
		interaction.reply({ content: `**Success:** Nowplaying data updated. ✅`, ephemeral: true }).catch((e) => { });
	}
};
