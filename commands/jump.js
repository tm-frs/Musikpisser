const { ApplicationCommandOptionType } = require(`discord.js`);
const discordTools = require(`../exports/discordTools.js`);
const { convertSecondsToString, convertStringToSeconds } = require(`../exports/timeStrings.js`);


module.exports = {
	description: `Allows you to jump to a specific part of the current track.`,
	name: `jump`,
	options: [{
		name: `second`,
		description: `Type in what second (+ minutes + hours) you want to jump to.`,
		type: ApplicationCommandOptionType.Integer,
		required: false
	}, {
		name: `minute`,
		description: `Type in what minute (+ seconds + hours) you want to jump to.`,
		type: ApplicationCommandOptionType.Number,
		required: false
	}, {
		name: `hour`,
		description: `Type in what hour (+ seconds + minutes) you want to jump to.`,
		type: ApplicationCommandOptionType.Number,
		required: false
	}],
	voiceChannel: true,

	run: async (client, interaction) => {
		await interaction.deferReply();

		const queue = client.player.nodes.get(interaction.guild.id);
		if (!queue || !queue.node.isPlaying()) return discordTools.reReply(interaction, `There was an issue! ❌`, { content: `No music currently playing! ❌`, ephemeral: true });

		const secondsInput = interaction.options.getInteger(`second`);
		const minutesInput = interaction.options.getNumber(`minute`);
		const hoursInput = interaction.options.getNumber(`hour`);
		const secondsJumpTo = (secondsInput + parseInt((minutesInput + (hoursInput * 60)) * 60));
		const jumpToString = convertSecondsToString(secondsJumpTo);

		const currentProgressSeconds = Math.round(((await queue.node.getTimestamp()).current.value) / 1000);
		const currentProgressString = convertSecondsToString(currentProgressSeconds);

		const trackDurationString = convertStringToSeconds(await queue.currentTrack.duration);
		const trackDurationSeconds = convertSecondsToString(trackDurationString);

		if (!secondsInput && !minutesInput && !hoursInput) return discordTools.reReply(interaction, `There was an issue! ❌`, { content: `You need to specify where you want to jump to. ❌`, ephemeral: true });
		if ((secondsInput < 0) || (minutesInput < 0) || (hoursInput < 0)) return discordTools.reReply(interaction, `There was an issue! ❌`, { content: `You can't jump to a negative time! ❌`, ephemeral: true });
		if (secondsJumpTo > trackDurationString) return discordTools.reReply(interaction, `There was an issue! ❌`, { content: `The current track is only **${trackDurationSeconds}** long but you wanted to jump to **${jumpToString}**. ❌`, ephemeral: true });

		const success = queue.node.seek(secondsJumpTo * 1000);

		return success ?
			interaction.editReply({ content: `Jumped from **${currentProgressString}** to **${jumpToString}** (the track is **${trackDurationSeconds}** long). ✅` }).catch((e) => { }) :
			discordTools.reReply(interaction, `There was an issue! ❌`, { content: `Something went wrong. ❌`, ephemeral: true }).catch((e) => { });
	}
};
