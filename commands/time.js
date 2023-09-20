const { Colors } = require(`discord.js`);
const { ButtonStyle } = require(`discord.js`);
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require(`discord.js`);
const { SnowflakeUtil } = require(`discord.js`);

module.exports = {
	description: `Shows you how long the current track is and how much time is remaining.`,
	name: `time`,
	options: [],
	voiceChannel: true,

	run: async (client, interaction) => {
		const queue = client.player.nodes.get(interaction.guild.id);

		if (!queue || !queue.node.isPlaying()) return interaction.reply({ content: `No music currently playing! ❌`, ephemeral: true }).catch((e) => { }); // eslint-disable-line no-unused-vars

		const progress = queue.node.createProgressBar();
		const timestamp = queue.getPlayerTimestamp();
		const unixPlayingSince = parseInt((parseInt(SnowflakeUtil.deconstruct(queue.id).timestamp)) / 1000);
		const discordPlayingSince = `<t:${unixPlayingSince}:R> (<t:${unixPlayingSince}:d>, <t:${unixPlayingSince}:T>)`;

		if (timestamp.progress === `Infinity`) return interaction.reply({ content: `This song is live streaming, no duration data to display. 🎧`, ephemeral: true }).catch((e) => { }); // eslint-disable-line no-unused-vars

		const saveButton = new ButtonBuilder();

		saveButton.setLabel(`Update`);
		saveButton.setCustomId(`time`);
		saveButton.setStyle(ButtonStyle.Success);

		const row = new ActionRowBuilder().addComponents(saveButton);

		const embed = new EmbedBuilder()
			.setColor(Colors.Blue) // blue = 0x3498DB
			.setTitle(queue.currentTrack.title)
			.setThumbnail(queue.currentTrack.thumbnail)
			.setTimestamp()
			.setDescription(`${progress} \nThe track is finished by **${timestamp.progress}%**.\nThe bot is playing since: *${discordPlayingSince}*.`)
			.setFooter({ text: `Music Bot - by CraftingShadowDE️`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });
		interaction.reply({ embeds: [embed], components: [row]}).catch((e) => { }); // eslint-disable-line no-unused-vars
	}
};
