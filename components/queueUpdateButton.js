const { Colors } = require(`discord.js`);
const { ButtonStyle } = require(`discord.js`);
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require(`discord.js`);
const { convertSecondsToString, reformatString } = require(`../exports/timeStrings.js`);

module.exports = {
	run: async (client, interaction, queue, othervoicechannel) => { // eslint-disable-line no-unused-vars
		if (!queue || !queue.node.isPlaying()) {
			return interaction.reply({ content: `No music currently playing. ❌`, ephemeral: true, components: [] });
		} else if (!queue.tracks.data[0]) {
			return interaction.reply({ content: `No music in queue after current. ❌`, ephemeral: true }).catch((e) => { });
		}

		const unixPlayingSince = Math.round((Date.now() - queue.node.streamTime) / 1000);
		const discordPlayingSince = `<t:${unixPlayingSince}:R> (<t:${unixPlayingSince}:d>, <t:${unixPlayingSince}:T>)`;
		const playingDuraionString = convertSecondsToString(Math.round(queue.node.streamTime / 1000));

		const options = [`📴 (Loop mode: Off)`, `🔂 (Loop mode: Track)`, `🔁 (Loop mode: Queue)`, `▶ (Loop mode: Autoplay)`];
		const loopMode = options[queue.repeatMode];

		const tracks = queue.tracks.data.map((track, i) => `**${i + 1}**. \`${track.title}\` | by \`${track.author}\` _(Duration: **${reformatString(track.duration)}**)_\n(requested by <@${track.requestedBy.id}>)`);

		const songs = queue.getSize();
		const nextSongs = songs > 5 ? `There ${((songs - 5) !== 1) ? `are` : `is`} **${songs - 5} other song${((songs - 5) !== 1) ? `s` : ``}** in the queue.` : `There are **no other songs** in the queue.`;

		const updateButton = new ButtonBuilder()
			.setLabel(`Update`)
			.setCustomId(`queueUpdateButton`)
			.setStyle(ButtonStyle.Success);

		const row = new ActionRowBuilder()
			.addComponents(updateButton);

		const embed = new EmbedBuilder()
			.setColor(Colors.Blue) // blue = 0x3498DB
			.setThumbnail(interaction.guild.iconURL({ size: 4096, format: `png`, dynamic: true }))
			.setTitle(`Server Music List - ${interaction.guild.name} ${loopMode}`)
			.setDescription(`Current session playtime: **${playingDuraionString}**\n*(playing since: ${discordPlayingSince})*\nDuration of the entire queue: **${convertSecondsToString(Math.round(queue.estimatedDuration / 1000))}**\n\n**Currently Playing:** \`${queue.currentTrack.title}\` | by \`${queue.currentTrack.author}\` _(Duration: **${reformatString(queue.currentTrack.duration)}**)_ (requested by <@${queue.currentTrack.requestedBy.id}>)\n\n${tracks.slice(0, 5).join(`\n`)}\n\n${nextSongs}`)

			.setTimestamp()
			.setFooter({text: `Musikpisser Music Bot`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

		interaction.message.edit({ embeds: [embed], row: [row] }).catch((e) => { });
		interaction.reply({ content: `**Success:** Queue data updated. ✅`, ephemeral: true }).catch((e) => { });
	}
};
