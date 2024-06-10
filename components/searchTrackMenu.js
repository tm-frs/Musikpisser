const createQueue = require(`../exports/queue.js`).createQueue;
const { Colors } = require(`discord.js`);
const { ButtonStyle } = require(`discord.js`);
const { EmbedBuilder } = require(`discord.js`);
const { QueryType } = require(`discord-player`);
const discordTools = require(`../exports/discordTools.js`);

const resetMenu = async (interaction) => {
	const interactionComponents = interaction.message.components;

	await interaction.message.edit({ components: [] });
	await interaction.message.edit({ components: interactionComponents });
};

const addTrack = async (client, interaction, selectedResult) => {
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

	if (!res || !res.tracks.length) return discordTools.reReply(interaction, `There was an issue! ❌`, { content: `${interaction.user}, No search result was found. ❌\nWas the /search command executed a long time ago? If so, that might be the reason.\nYou could try searching again or using another option.`, ephemeral: true });

	await interaction.editReply({ content: `${interaction.user}, Your chosen track is loading again... 🎧` }).catch((e) => { });

	queue.addTrack(res.tracks[0]); // add music to queue

	if (!queue.node.isPlaying()) await queue.node.play();

	return true;
};

module.exports = {
	run: async (client, interaction, queue, othervoicechannel) => {
		await interaction.deferReply();

		if (interaction.user.id !== interaction.message.interaction.user.id) {
			discordTools.reReply(interaction, `There was an issue! ❌`, { content: `You aren't allowed to do this because you are not the person that executed the search-command! ❌`, ephemeral: true });
			resetMenu(interaction);
		}

		if (!interaction.member.voice.channel) {
			discordTools.reReply(interaction, `There was an issue! ❌`, { content: `You are not connected to an audio channel. ❌`, ephemeral: true });
			resetMenu(interaction);
		}

		if (othervoicechannel) return discordTools.reReply(interaction, `There was an issue! ❌`, { content: `You are not on the same audio channel as me. ❌`, ephemeral: true });

		const chosenTrack = interaction.values[0];
		const selection = (() => {
			switch (chosenTrack) {
				case `t1`: return 0;
				case `t2`: return 1;
				case `t3`: return 2;
				case `t4`: return 3;
				case `t5`: return 4;
				case `t6`: return 5;
				case `t7`: return 6;
				case `t8`: return 7;
				case `t9`: return 8;
				case `t10`: return 9;
				default: return `error`;
			}
		})();
		const name = ((interaction.message.embeds[0].title).substr(17, ((interaction.message.embeds[0].title).length) - 18));
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

		await addTrack(client, interaction, selectedResult);

		const res = await client.player.search(selectedResult, {
			requestedBy: interaction.user,
			searchEngine: QueryType.AUTO
		});
		if (!res || !res.tracks.length) return;

		const description = resultCount === 10 ? (((interaction.message.embeds[0].description).substring(0, ((interaction.message.embeds[0].description).length) - 183)) + `Selection stopped because track **${selection + 1}** was selected. ✅`) : (((interaction.message.embeds[0].description).substring(0, ((interaction.message.embeds[0].description).length) - 182)) + `Selection stopped because track **${selection + 1}** was selected. ✅`);

		const ui = [{ type: 1, components: [{ style: ButtonStyle.Success, label: `Add it again`, custom_id: `searchAddAgainButton`, disabled: false, type: 2 }] }]; // eslint-disable-line camelcase

		const embed = new EmbedBuilder()
			.setColor(Colors.Blue) // blue = 0x3498DB
			.setTitle(`Searched Music: "${name}"`)
			.setDescription(description)
			.setTimestamp()
			.setFooter({ text: `Musikpisser Music Bot`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

		interaction.message.edit({ embeds: [embed], components: ui }).catch((e) => { });
	}
};
