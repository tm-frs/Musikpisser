const { Colors } = require(`discord.js`);
const { ButtonStyle } = require(`discord.js`);
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require(`discord.js`);
const { convertSecondsToString } = require(`../exports/timeStrings.js`);

module.exports = {
	run: async (client, interaction, queue, othervoicechannel) => { // eslint-disable-line no-unused-vars
		if (!queue || !queue.node.isPlaying()) return interaction.reply({ content: `No music currently playing! ❌`, ephemeral: true }).catch((e) => { });

		const progress = queue.node.createProgressBar();
		const timestamp = queue.node.getTimestamp();

		const unixPlayingSince = Math.round((Date.now() - queue.node.streamTime) / 1000);
		const discordPlayingSince = `<t:${unixPlayingSince}:R> (<t:${unixPlayingSince}:d>, <t:${unixPlayingSince}:T>)`;
		const playingDuraionString = convertSecondsToString(Math.round(queue.node.streamTime / 1000));

		if (timestamp.progress === `Infinity`) return interaction.reply({ content: `This song is live streaming, no duration data to display. 🎧`, ephemeral: true }).catch((e) => { });

		const updateButton = new ButtonBuilder()
			.setLabel(`Update`)
			.setCustomId(`timeUpdateButton`)
			.setStyle(ButtonStyle.Success);

		const row = new ActionRowBuilder()
			.addComponents(updateButton);

		const embed = new EmbedBuilder()
			.setColor(Colors.Blue) // blue = 0x3498DB
			.setTitle(queue.currentTrack.title)
			.setThumbnail(queue.currentTrack.thumbnail)
			.setTimestamp()
			.setDescription(`${progress} \nThe track is finished by **${timestamp.progress}%**.\nCurrent session playtime: **${playingDuraionString}**\n*(playing since: ${discordPlayingSince})*`)
			.setFooter({ text: `Musikpisser Music Bot️`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

		interaction.message.edit({ embeds: [embed], components: [row] }).catch((e) => { });
		interaction.reply({ content: `**Success:** Time data updated. ✅`, ephemeral: true }).catch((e) => { });
	}
};
