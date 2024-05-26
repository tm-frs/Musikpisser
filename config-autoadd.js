const wait = require(`node:timers/promises`).setTimeout; // eslint-disable-line no-unused-vars
/* Information about afterAdd functions:
  *
  * - they don't have to return anything
  * - the arguments should be (client, interaction, queue, QueueRepeatMode)
  * - if no function is used, a default function will be used instead
  *
  */


/* Scheme of a proper object:
   *
   * {
   *     internalId: 'internalId', // STRING: an unique internal ID to identify this, 1-100 characters (necessary)
   *     isMix: false, // BOOLEAN: whether or not this is a mix (necassary)
   *     content: [], // ARRAY OF STRINGS: an array of URLs [for isMix=false] or of internal IDs [for isMix=true] (necessary)
   *     createCommand: true, // BOOLEAN: whether or not a command choice will be created, if false it can only be used in a mix (necessary)
   *     commandTitle: "commandTitle", // STRING: title of the command choice, 1-100 characters (necessary for createCommand=true)
   *     afterAdd: null // FUNCTION: function that is run after adding the tracks [for createCommand=true] (not necessary)
   * }
   *
   */

const playlistprep = async (client, interaction, queue, QueueRepeatMode) => {
	// shuffle:
	await queue.tracks.shuffle();
	interaction.followUp({ content: `Queue has been shuffled! ✅` }).catch((e) => {});

	// loop queue:
	await queue.setRepeatMode(QueueRepeatMode.QUEUE);
	const success = (queue.repeatMode === QueueRepeatMode.QUEUE);
	success ?
		interaction.followUp({ content: `Loop Mode: **${queue.repeatMode === 0 ? `Inactive` : `Active`}**, the whole queue will be repeated indefinetely 🔁` }).catch((e) => {}) :
		interaction.followUp({ content: `${interaction.member.user}, could not update loop mode! ❌`, ephemeral: true }).catch((e) => {});

	// skip:
	await queue.node.skip();

	// shuffle:
	await queue.tracks.shuffle();
};

const singleprep = async (client, interaction, queue, QueueRepeatMode) => {
	// loop track:
	await queue.setRepeatMode(QueueRepeatMode.TRACK);
	const success = (queue.repeatMode === QueueRepeatMode.TRACK);
	success ?
		interaction.followUp({ content: `Loop Mode: **${queue.repeatMode === 0 ? `Inactive` : `Active`}**, the current track will be repeated indefinetely 🔂` }).catch((e) => {}) :
		interaction.followUp({ content: `${interaction.member.user}, could not update loop mode! ❌`, ephemeral: true }).catch((e) => {});
};


module.exports = [
	{
		internalId: `toadSingsRasputin`,
		isMix: false,
		content: [`https://www.youtube.com/watch?v=KT85z_tGZro`],
		createCommand: true,
		commandTitle: `Toad Sings Ra Ra Rasputin`,
		afterAdd: singleprep
	},
	{
		internalId: `undertaleBossOst`,
		isMix: false,
		content: [`https://www.youtube.com/playlist?list=PLvJE24xlovhuuhaQInNsjRyRF8QdFnh6V`],
		createCommand: true,
		commandTitle: `Undertale OST (only boss fights)`,
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
		internalId: `undertaleBoth`,
		isMix: true,
		content: [`undertaleBossOst`, `undertaleRemixes`],
		createCommand: true,
		commandTitle: `Undertale (Boss OST & Remixes)`,
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
		internalId: `stardewValleySeasonThemes`,
		isMix: false,
		content: [`https://www.youtube.com/playlist?list=PLUJm0mJ_TgqoABH9idm_tX8eV1o0Jv4iG`],
		createCommand: true,
		commandTitle: `Stardew Valley Season Themes`,
		afterAdd: playlistprep
	},
	{
		internalId: `nintendoAndChill`, // https://open.spotify.com/intl-de/artist/1T7zBkQCOCacKjbnmFX7cp/discography/album
		isMix: false,
		content: [`https://open.spotify.com/intl-de/album/4lBMa9JEuCSIs3NkPEIwvN?si=z25t1nqmQEe78ttSvO9QyQ`, `https://open.spotify.com/intl-de/album/3oNO1P0Qlr4oSlMA2MIj67?si=ydDtluOOQr-RSAfIbocFag`, `https://open.spotify.com/intl-de/album/0N0noai9OQs1rYEaS47vJw?si=RAmn0gOGRBm9EexcGMjFPQ`, `https://open.spotify.com/intl-de/album/2a15PtLwMSfMVOWJUcM4Ia?si=E-pYcPWTQMOUW00HPIQIKg`], // [`https://soundcloud.com/mikeljakobi/sets/poke-chill`, `https://soundcloud.com/gamechops/sets/zelda-chill`, `https://soundcloud.com/daniel-egan-16/sets/zelda-and-chill-2`, `https://soundcloud.com/pokegamer05/sets/zelda-and-chill-3`],
		createCommand: true,
		commandTitle: `Nintendo and Chill (Poké & Chill, Zelda & Chill 1-3)`,
		afterAdd: playlistprep
	},
	{
		internalId: `undertale-hypixel-stardewvalley`,
		isMix: true,
		content: [`undertaleBoth`, `hypixelSkyblockOst`, `stardewValleySeasonThemes`],
		createCommand: true,
		commandTitle: `Undertale (both) + Hypixel Skyblock OST + Stardew Valley`,
		afterAdd: playlistprep
	},
	{
		internalId: `playlistAll`,
		isMix: true,
		content: [`undertaleBoth`, `hypixelSkyblockOst`, `nintendoAndChill`, `stardewValleySeasonThemes`],
		createCommand: true,
		commandTitle: `everything (Undertale, Hypixel Skyblock, ...)`,
		afterAdd: playlistprep
	}
];
