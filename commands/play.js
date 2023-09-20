const createQueue = require(`../exports/queue.js`).createQueue;
const { ApplicationCommandOptionType } = require(`discord.js`);
const { QueryType } = require(`discord-player`);
const discordTools = require(`../exports/discordTools.js`);

module.exports = {
	description: `Adds a track/playlist to the queue.`,
	name: `play`,
	options: [{
		name: `query`,
		description: `Enter the name or the URL of the track/playlist you want to add.`,
		type: ApplicationCommandOptionType.String,
		required: true
	}, {
		name: `search-engine`,
		description: `Select a search engine you like (YouTube is chosen if this is left empty).`,
		type: ApplicationCommandOptionType.String,
		choices: [
			{name: `YouTube-Suche`, value: `youtubeSearch`},
			{name: `Spotify-Suche`, value: `spotifySearch`},
			{name: `Soundcloud-Suche`, value: `soundcloudSearch`},
			{name: `Apple Music-Suche`, value: `appleMusicSearch`},
			{name: `discord-player Standardsuche (Spotify)`, value: `autoSearch`}
		],
		required: false
	}],
	voiceChannel: true,

	run: async (client, interaction) => {
		await interaction.deferReply();

		const name = interaction.options.getString(`query`);
		const searchEngine = interaction.options.getString(`search-engine`);

		if (!name) return discordTools.reReply(interaction, `There was an issue! ❌`, { content: `Write the name of the music you want to play. ❌`, ephemeral: true });

		const res = await client.player.search(name, {
			requestedBy: interaction.member,
			searchEngine: QueryType.AUTO,
			fallbackSearchEngine: (searchEngine ? searchEngine : `youtubeSearch`)
		});

		if (!res || !res.tracks.length) return discordTools.reReply(interaction, `There was an issue! ❌`, { content: `No results found! ❌`, ephemeral: true });

		const queue = await createQueue(client, interaction);

		try {
			if (!queue.connection) await queue.connect(interaction.member.voice.channel);
		} catch {
			await queue.destroy();
			return discordTools.reReply(interaction, `There was an issue! ❌`, { content: `I can't join the audio channel. ❌`, ephemeral: true });
		}

		await interaction.editReply({ content: `Your ${res.playlist ? `Playlist` : `Track`} is loading now... 🎧` }).catch((e) => {}); // eslint-disable-line no-unused-vars

		res.playlist ? queue.addTrack(res.tracks) : queue.addTrack(res.tracks[0]); // im Normalfall Musik hinzufügen

		if (!queue.node.isPlaying()) await queue.node.play();
	}
};
