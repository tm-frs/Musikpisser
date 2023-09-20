const createQueue = require(`../exports/queue.js`).createQueue;
const { ApplicationCommandOptionType } = require(`discord.js`);
const { QueryType } = require(`discord-player`);
const { QueueRepeatMode } = require(`discord-player`);
const wait = require(`node:timers/promises`).setTimeout;
const discordTools = require(`../exports/discordTools.js`);

const autoaddItemsArray = require(`../config.js`).autoadd;
const maxOptionsPerCommand = 25; // one command can only have 25 options. If this ever changes, change this value
const maxChoicesPerOption = 25; // one option can only have 25 choices. If this ever changes, change this value

function filterCommandOptions(autoaddItems) {
	var commandTrue = [];

	for (let i = 0; i < autoaddItems.length; i++) {
		if (autoaddItems[i].createCommand) commandTrue.push(autoaddItems[i]);
	}

	return commandTrue;
}

function getAmountOfOptions(commandTrue) {
	let optionsAmount = Math.ceil(commandTrue.length / maxChoicesPerOption); // one option can't have infinite choices. this calculates the amount of options needed to fit all choices
	if (optionsAmount > maxOptionsPerCommand) optionsAmount = maxOptionsPerCommand; // if the result is higher than maxOptionsPerCommand (one command can't have infinite options), set it to maxOptionsPerCommand so everything else will be cut off
	return optionsAmount;
}

function getCommandOptions(commandTrue) {
	if (commandTrue.length === 0) return [];

	var commandOptions = [];
	const optionsAmount = getAmountOfOptions(commandTrue);
	var currentChoiceNumber = 0;
	for (let currentOption = 1; currentOption < (optionsAmount + 1); currentOption++) {
		const choicesExisting = (commandTrue.length - ((currentOption - 1) * maxChoicesPerOption));
		let choicesOfOption = [];
		for (let currentChoiceOfOption = 1; currentChoiceOfOption < (choicesExisting + 1); currentChoiceOfOption++) {
			currentChoiceNumber++;
			const currentChoice = commandTrue[currentChoiceNumber - 1];
			choicesOfOption.push({name: currentChoice.commandTitle, value: currentChoice.internalId});
		}
		commandOptions.push({type: ApplicationCommandOptionType.String, name: `targetlist-${currentOption}`, description: `List ${currentOption} with things. Please only select from one list.`, choices: choicesOfOption, required: false});
	}
	return commandOptions;
}

const amountOfOptions = getAmountOfOptions(filterCommandOptions(autoaddItemsArray));

const processInput = async (chosenItem, autoaddItems) => {
	var combinedArray = [];

	if (!chosenItem.isMix) {
		combinedArray = combinedArray.concat(chosenItem.content);
	} else if (chosenItem.isMix) {
		for (let i = 0; i < chosenItem.content.length; i++) {
			const mixOriginItem = autoaddItems.find((item) => { return item.internalId === chosenItem.content[i]; });
			combinedArray = combinedArray.concat(await processInput(mixOriginItem, autoaddItems));
		}
	}

	return combinedArray;
};

const defaultAfterAdd = async (client, interaction, queue, QueueRepeatMode) => { // eslint-disable-line no-unused-vars
	queue.node.setVolume(client.config.opt.discordPlayer.initialVolume);
};

module.exports = {
	description: `Adds a song/playlist that has been added to the bot's code.`,
	name: `autoadd`,
	  options: getCommandOptions(filterCommandOptions(autoaddItemsArray)),
	voiceChannel: true,

	run: async (client, interaction) => {
		let userInput = [];
		for (let i = 1; i < (amountOfOptions + 1); i++) {
			userInput.push(interaction.options.getString(`targetlist-${i}`));
		}
		let userInputNotNull = [];
		for (let i = 0; i < userInput.length; i++) {
			const foundItem = autoaddItemsArray.find((item) => { return item.internalId === userInput[i]; });
			if (userInput[i]) userInputNotNull.push(foundItem ? foundItem : null);
		}
		if (userInputNotNull.length === 0) {
			return interaction.reply({ content: `Choose a filter from one of the lists! ❌`, ephemeral: true }).catch((e) => { }); // eslint-disable-line no-unused-vars
		} else if (userInputNotNull.length > 1) {
			return interaction.reply({ content: `Only choose a filter from **one** list! ❌`, ephemeral: true }).catch((e) => { }); // eslint-disable-line no-unused-vars
		}

		let chosenItem = userInputNotNull[0];
		const targetArray = await processInput(chosenItem, autoaddItemsArray);

		await interaction.deferReply();

		const queue = await createQueue(client, interaction);

		const addTracks = async (target, trackIndex, trackAmount) => {
			const res = await client.player.search(target, {
				requestedBy: interaction.member,
				searchEngine: QueryType.AUTO
			});

			if (!res || !res.tracks.length) if (trackIndex === 0) return discordTools.reReply(interaction, `There was an issue! ❌`, { content: `No results found! ❌`, ephemeral: true });
			if (!res || !res.tracks.length) if (trackIndex !== 0) return interaction.followUp({ content: `No results found! ❌`, ephemeral: true }).catch((e) => { }); // eslint-disable-line no-unused-vars

			try {
				if (!queue.connection) await queue.connect(interaction.member.voice.channel);
			} catch {
				await client.player.deleteQueue(interaction.guild.id);
				if (trackIndex === 0) return discordTools.reReply(interaction, `There was an issue! ❌`, { content: `I can't join the audio channel. ❌`, ephemeral: true });
				if (trackIndex !== 0) return interaction.followUp({ content: `I can't join the audio channel. ❌`, ephemeral: true }).catch((e) => { }); // eslint-disable-line no-unused-vars
			}

			if (trackIndex === 0) await interaction.editReply({ content: `Your ${((trackAmount > 1) ? true : res.playlist) ? `Playlist` : `Track`} is loading now... 🎧` }).catch((e) => { }); // eslint-disable-line no-unused-vars

			res.playlist ? queue.addTrack(res.tracks) : function() {
				let toAdd = res.tracks[0];
				toAdd.dontSendAddedMessage = true;
				queue.addTrack(toAdd);
			}();

			queue.node.setVolume(0); // volume to 0

			if (trackAmount !== (trackIndex + 1)) await wait(100);
		};

		if (targetArray.length <= 0) return discordTools.reReply(interaction, `There was an issue! ❌`, { content: `Something went completely wrong! ❌`, ephemeral: true });
		if (targetArray.length !== 0) {
			for (var i = 0; i < (targetArray.length); i++) {
				await addTracks(targetArray[i], i, targetArray.length);
			}
		}

		if (!queue.node.isPlaying()) await queue.node.play();

		if (!chosenItem.afterAdd) chosenItem.afterAdd = defaultAfterAdd;
		chosenItem.afterAdd(client, interaction, queue, QueueRepeatMode);
	}
};
