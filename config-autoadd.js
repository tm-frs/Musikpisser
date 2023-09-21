const wait = require(`node:timers/promises`).setTimeout; // eslint-disable-line no-unused-vars
/* Information about afterAdd functions:
  *
  * - they don't have to return anything
  * - the arguments should be (client, interaction, queue, QueueRepeatMode)
  * - if no function is used, a default function will be used instead
  *
  */


/* Example of an item:
   *
   * {
   *     internalId: 'internalId', // STRING: an unique internal ID to identify this, 1-100 characters (necessary)
   *     isMix: false, // BOOLEAN: whether or not this is a mix (necassary)
   *     content: [], // ARRAY OF STRINGS: an array of URLs [for isMix=false] or of internal IDs [for isMix=true] (necessary)
   *     createCommand: true, // BOOLEAN: whether or not a command choice will be created, if false it can only be used in a mix (necessary)
   *     commandTitle: "commandTitle", // STRING: title of the command choice, 1-100 characters (necessary for createCommand=true)
   *     afterAdd: null // FUNCTION: function that is run after adding the tracks [for createCommand=true] (not necessary at all)
   * }
   *
   */

const playlistprep = async (client, interaction, queue, QueueRepeatMode) => { // eslint-disable-line no-unused-vars
	// shuffle:
	await queue.tracks.shuffle();
	interaction.followUp({ content: `Queue has been shuffled! ✅` }).catch((e) => {}); // eslint-disable-line no-unused-vars

	// loop queue:
	await queue.setRepeatMode(QueueRepeatMode.QUEUE);
	const success = (queue.repeatMode === QueueRepeatMode.QUEUE);
	success ? interaction.followUp({ content: `Loop Mode: **${queue.repeatMode === 0 ? `Inactive` : `Active`}**, The whole sequence will repeat non-stop 🔁` }).catch((e) => {}) : // eslint-disable-line no-unused-vars
		interaction.followUp({ content: `${interaction.member.user}, Could not update loop mode! ❌`, ephemeral: true }).catch((e) => {}); // eslint-disable-line no-unused-vars

	// skip:
	await queue.node.skip();

	// shuffle:
	await queue.tracks.shuffle();
};

const singleprep = async (client, interaction, queue, QueueRepeatMode) => { // eslint-disable-line no-unused-vars
	// loop track:
	await queue.setRepeatMode(QueueRepeatMode.TRACK);
	const success = (queue.repeatMode === QueueRepeatMode.TRACK);
	success ? interaction.followUp({ content: `Loop Mode: **${queue.repeatMode === 0 ? `Inactive` : `Active`}**, Current track will be repeated non-stop 🔂` }).catch((e) => {}) : // eslint-disable-line no-unused-vars
		interaction.followUp({ content: `${interaction.member.user}, Could not update loop mode! ❌`, ephemeral: true }).catch((e) => {}); // eslint-disable-line no-unused-vars
};


module.exports = [
	{
		internalId: `rasputin`,
		isMix: false,
		content: [`https://www.youtube.com/watch?v=KT85z_tGZro`],
		createCommand: true,
		commandTitle: `Toad Sings Ra Ra Rasputin`,
		afterAdd: singleprep
	},
	{
		internalId: `wideputin`,
		isMix: false,
		content: [`https://www.youtube.com/watch?v=RHRKu5mStNk`],
		createCommand: true,
		commandTitle: `Song for Denise (Maxi Version) bass boosted 1 hour`,
		afterAdd: singleprep
	},
	{
		internalId: `undertaleBossOst`,
		isMix: false,
		content: [`https://www.youtube.com/playlist?list=PLvJE24xlovhuuhaQInNsjRyRF8QdFnh6V`],
		createCommand: true,
		commandTitle: `Undertale OST Playlist (only boss fights)`,
		afterAdd: playlistprep
	},
	{
		internalId: `undertaleRemixes`,
		isMix: false,
		content: [`https://soundcloud.com/gamechops/sets/undertale`],
		createCommand: true,
		commandTitle: `Undertale Remix Playlist`,
		afterAdd: playlistprep
	},
	{
		internalId: `hypixelSkyblockOst`,
		isMix: false,
		content: [`https://www.youtube.com/playlist?list=PLPYaA8L35a72GLLbbMKc2v8D-AHPDFXsV`],
		createCommand: true,
		commandTitle: `Hypixel Skyblock OST`,
		afterAdd: playlistprep
	},
	{
		internalId: `chill`,
		isMix: false,
		content: [`https://soundcloud.com/gamechops/sets/zelda-chill`, `https://soundcloud.com/daniel-egan-16/sets/zelda-and-chill-2`, `https://soundcloud.com/pokegamer05/sets/zelda-and-chill-3`, `https://soundcloud.com/mikeljakobi/sets/poke-chill`],
		createCommand: true,
		commandTitle: `Chill Music ("Poké & Chill", "Zelda & Chill", "Zelda & Chill 2", ...)`,
		afterAdd: playlistprep
	},
	{
		internalId: `splatoon3Ost`,
		isMix: false,
		content: [`https://www.youtube.com/playlist?list=PLxGVeb0fxoSjiSkrp8x6CsdYdzCnDD4WD`],
		createCommand: true,
		commandTitle: `Splatoon 3 OST`,
		afterAdd: playlistprep
	},
	{
		internalId: `mix1`,
		isMix: true,
		content: [`undertaleBossOst`, `undertaleRemixes`, `hypixelSkyblockOst`, `splatoon3Ost`],
		createCommand: true,
		commandTitle: `Mix 1 (Undertale (both), Hypixel Skyblock, Chill, Splatoon 3)`,
		afterAdd: playlistprep
	}
];
