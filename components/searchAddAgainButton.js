const createQueue = require(`../exports/queue.js`).createQueue;
const { ButtonStyle } = require(`discord.js`);
const { QueryType } = require(`discord-player`);
const discordTools = require(`../exports/discordTools.js`);

const addTrack = async (client, interaction, selectedResult, selectionNumber) => {
	const queue = await createQueue(client, interaction);
	const res = await client.player.search(selectedResult, {
		requestedBy: interaction.user,
		searchEngine: QueryType.AUTO
	});

	try {
		if (!queue.connection) await queue.connect(interaction.member.voice.channel);
	} catch {
		await client.player.deleteQueue(interaction.guildId);
		return discordTools.reReply(interaction, { content: `${interaction.user}, I can't join the audio channel. ❌`, ephemeral: true });
	}

	if (!res || !res.tracks.length) return discordTools.reReply(interaction, `There was an issue! ❌`, { content: `${interaction.user}, No search result was found. ❌\nWas the /search command executed a long time ago? If so, that might be the reason.\nYou could try searching again.`, ephemeral: true });

	await interaction.editReply({ content: `${interaction.user}, **Track ${selectionNumber + 1}** is loading again... 🎧` }).catch((e) => { });

	queue.addTrack(res.tracks[0]); // add music to queue

	if (!queue.node.isPlaying()) await queue.node.play();

	return true;
};

module.exports = {
	run: async (client, interaction, queue, othervoicechannel) => {
		await interaction.deferReply();

		if (othervoicechannel) return discordTools.reReply(interaction, `There was an issue! ❌`, { content: `You are not on the same audio channel as me. ❌`, ephemeral: true });
		if (!interaction.member.voice.channel) return discordTools.reReply(interaction, `There was an issue! ❌`, { content: `You are not connected to an audio channel. ❌`, ephemeral: true });

		const selection = parseInt(((interaction.message.embeds[0].description).substr(-20, 2)).replace(`*`, ``)) - 1;
		const resultArray = (interaction.message.embeds[0].description).split(`\n`);
		const resultCount = (resultArray.length - 2) / 2;
		const resultURLs = (() => {
			switch (resultCount) {
				case 1: return [(resultArray[1].substr(31, ((resultArray[1]).length) - 33))];
				case 2: return [(resultArray[1].substr(31, ((resultArray[1]).length) - 33)), (resultArray[3].substr(31, ((resultArray[3]).length) - 33))];
				case 3: return [(resultArray[1].substr(31, ((resultArray[1]).length) - 33)), (resultArray[3].substr(31, ((resultArray[3]).length) - 33)), (resultArray[5].substr(31, ((resultArray[5]).length) - 33))];
				case 4: return [(resultArray[1].substr(31, ((resultArray[1]).length) - 33)), (resultArray[3].substr(31, ((resultArray[3]).length) - 33)), (resultArray[5].substr(31, ((resultArray[5]).length) - 33)), (resultArray[7].substr(31, ((resultArray[7]).length) - 33))];
				case 5: return [(resultArray[1].substr(31, ((resultArray[1]).length) - 33)), (resultArray[3].substr(31, ((resultArray[3]).length) - 33)), (resultArray[5].substr(31, ((resultArray[5]).length) - 33)), (resultArray[7].substr(31, ((resultArray[7]).length) - 33)), (resultArray[9].substr(31, ((resultArray[9]).length) - 33))];
				case 6: return [(resultArray[1].substr(31, ((resultArray[1]).length) - 33)), (resultArray[3].substr(31, ((resultArray[3]).length) - 33)), (resultArray[5].substr(31, ((resultArray[5]).length) - 33)), (resultArray[7].substr(31, ((resultArray[7]).length) - 33)), (resultArray[9].substr(31, ((resultArray[9]).length) - 33)), (resultArray[11].substr(31, ((resultArray[11]).length) - 33))];
				case 7: return [(resultArray[1].substr(31, ((resultArray[1]).length) - 33)), (resultArray[3].substr(31, ((resultArray[3]).length) - 33)), (resultArray[5].substr(31, ((resultArray[5]).length) - 33)), (resultArray[7].substr(31, ((resultArray[7]).length) - 33)), (resultArray[9].substr(31, ((resultArray[9]).length) - 33)), (resultArray[11].substr(31, ((resultArray[11]).length) - 33)), (resultArray[13].substr(31, ((resultArray[13]).length) - 33))];
				case 8: return [(resultArray[1].substr(31, ((resultArray[1]).length) - 33)), (resultArray[3].substr(31, ((resultArray[3]).length) - 33)), (resultArray[5].substr(31, ((resultArray[5]).length) - 33)), (resultArray[7].substr(31, ((resultArray[7]).length) - 33)), (resultArray[9].substr(31, ((resultArray[9]).length) - 33)), (resultArray[11].substr(31, ((resultArray[11]).length) - 33)), (resultArray[13].substr(31, ((resultArray[13]).length) - 33)), (resultArray[15].substr(31, ((resultArray[15]).length) - 33))];
				case 9: return [(resultArray[1].substr(31, ((resultArray[1]).length) - 33)), (resultArray[3].substr(31, ((resultArray[3]).length) - 33)), (resultArray[5].substr(31, ((resultArray[5]).length) - 33)), (resultArray[7].substr(31, ((resultArray[7]).length) - 33)), (resultArray[9].substr(31, ((resultArray[9]).length) - 33)), (resultArray[11].substr(31, ((resultArray[11]).length) - 33)), (resultArray[13].substr(31, ((resultArray[13]).length) - 33)), (resultArray[15].substr(31, ((resultArray[15]).length) - 33)), (resultArray[17].substr(31, ((resultArray[17]).length) - 33))];
				case 10: return [(resultArray[1].substr(31, ((resultArray[1]).length) - 33)), (resultArray[3].substr(31, ((resultArray[3]).length) - 33)), (resultArray[5].substr(31, ((resultArray[5]).length) - 33)), (resultArray[7].substr(31, ((resultArray[7]).length) - 33)), (resultArray[9].substr(31, ((resultArray[9]).length) - 33)), (resultArray[11].substr(31, ((resultArray[11]).length) - 33)), (resultArray[13].substr(31, ((resultArray[13]).length) - 33)), (resultArray[15].substr(31, ((resultArray[15]).length) - 33)), (resultArray[17].substr(31, ((resultArray[17]).length) - 33)), (resultArray[19].substr(31, ((resultArray[19]).length) - 33))];
				default: return [];
			}
		})();
		const selectedResult = resultURLs[selection];

		await addTrack(client, interaction, selectedResult, selection);

		const uiDisabled = [{ type: 1, components: [{ style: ButtonStyle.Success, label: `Add it again`, custom_id: `searchAddAgainButton`, disabled: true, type: 2 }] }]; // eslint-disable-line camelcase
		interaction.message.edit({ components: uiDisabled }).catch((e) => { });

		setTimeout(() => {
			const uiEnabled = [{ type: 1, components: [{ style: ButtonStyle.Success, label: `Add it again`, custom_id: `searchAddAgainButton`, disabled: false, type: 2 }] }]; // eslint-disable-line camelcase
			interaction.message.edit({ components: uiEnabled }).catch((e) => { });
		}, 30000);
	}
};
