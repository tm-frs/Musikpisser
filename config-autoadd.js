const wait = require('node:timers/promises').setTimeout;
 /* Information about afterAdd functions:
  *
  * - they don't have to return anything
  * - the arguments should be (client, interaction, queue, QueueRepeatMode)
  * - it should change the volume to something with `queue.setVolume(volume);`
  * - default volume can be used by pasting `queue.setVolume(client.config.opt.discordPlayer.initialVolume);` at the end
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

const playlistprep = async (client, interaction, queue, QueueRepeatMode) => {
    await wait(4000); // Wait for 4 seconds
        // shuffle:
        queue.shuffle();
        interaction.followUp({ content: `Queue has been shuffled! ✅` }).catch(e => {});
    
    await wait(1); // Wait for 0.001 seconds
        // loop queue:
        const success = queue.setRepeatMode(QueueRepeatMode.QUEUE);
        success ? interaction.followUp({ content: `Loop Mode: **${queue.repeatMode === 0 ? 'Inactive' : 'Active'}**, The whole sequence will repeat non-stop 🔁` }).catch(e => {}) :
            interaction.followUp({ content: `${interaction.member.user}, Could not update loop mode! ❌`, ephemeral: true }).catch(e => {});
  
    await wait(1); // Wait for 0.001 seconds
        // skip:
        queue.skip();

    await wait(998); // Wait for 0.998 seconds
        // volume:
        queue.setVolume(client.config.opt.discordPlayer.initialVolume);

    await wait(1000) // Wait for 1 second
        // shuffle:
        queue.shuffle();
}

const rasputinprep = async (client, interaction, queue, QueueRepeatMode) => {
    await wait(4000); //Wait for 4 seconds
        // loop track:
        const success = queue.setRepeatMode(QueueRepeatMode.TRACK);
        success ? interaction.followUp({ content: `Loop Mode: **${queue.repeatMode === 0 ? 'Inactive' : 'Active'}**, Current track will be repeated non-stop 🔂` }).catch(e => {}) :
            interaction.followUp({ content: `${interaction.member.user}, Could not update loop mode! ❌`, ephemeral: true }).catch(e => {});
      
    await wait(1); // Wait for 0.001 seconds
        // volume:
        queue.setVolume(250);
        interaction.followUp({ content: `Volume changed to **250%** (maximum is **${client.config.opt.maxVol}%**) 🔊` }).catch(e => {});
}

const wideputinprep = async (client, interaction, queue, QueueRepeatMode) => {
    await wait(4000); // Wait for 4 seconds
        // loop track:
        const success = queue.setRepeatMode(QueueRepeatMode.TRACK);    
        success ? interaction.followUp({ content: `Loop Mode: **${queue.repeatMode === 0 ? 'Inactive' : 'Active'}**, Current track will be repeated non-stop 🔂` }).catch(e => {}) :
            interaction.followUp({ content: `${interaction.member.user}, Could not update loop mode! ❌`, ephemeral: true }).catch(e => {});

    await wait(1); // Wait for 0.001 seconds
        // volume:
        queue.setVolume(200);    
        interaction.followUp({ content: `Volume changed to **200%** (maximum is **${client.config.opt.maxVol}%**) 🔊` }).catch(e => {});
}


module.exports = [
    {
        internalId: 'rasputin',
        isMix: false,
        content: ['https://www.youtube.com/watch?v=KT85z_tGZro'],
        createCommand: true,
        commandTitle: "Toad Sings Ra Ra Rasputin",
        afterAdd: rasputinprep
    },
    {
        internalId: 'wideputin',
        isMix: false,
        content: ['https://www.youtube.com/watch?v=RHRKu5mStNk'],
        createCommand: true,
        commandTitle: "Song for Denise (Maxi Version) bass boosted 1 hour",
        afterAdd: wideputinprep
    },
    {
        internalId: 'undertale',
        isMix: false,
        content: ['https://www.youtube.com/playlist?list=PLvJE24xlovhuuhaQInNsjRyRF8QdFnh6V'],
        createCommand: true,
        commandTitle: "Undertale OST playlist (only boss fights)",
        afterAdd: playlistprep
    },
    {
        internalId: 'skyblock',
        isMix: false,
        content: ['https://www.youtube.com/playlist?list=PLPYaA8L35a72GLLbbMKc2v8D-AHPDFXsV'],
        createCommand: true,
        commandTitle: "Hypixel Skyblock OST",
        afterAdd: playlistprep
    },
    {
        internalId: 'chill',
        isMix: false,
        content: ['https://soundcloud.com/gamechops/sets/zelda-chill','https://soundcloud.com/daniel-egan-16/sets/zelda-and-chill-2','https://soundcloud.com/mikeljakobi/sets/poke-chill'],
        createCommand: true,
        commandTitle: "Chill Music (\"Poké & Chill\", \"Zelda & Chill\", \"Zelda & Chill 2\", ...)",
        afterAdd: playlistprep
    },
    {
        internalId: 'splatoon3',
        isMix: false,
        content: ['https://www.youtube.com/playlist?list=PLxGVeb0fxoSjiSkrp8x6CsdYdzCnDD4WD'],
        createCommand: true,
        commandTitle: "Splatoon 3 OST",
        afterAdd: playlistprep
    },
    {
        internalId: 'mix1',
        isMix: true,
        content: ['undertale','skyblock','splatoon3'],
        createCommand: true,
        commandTitle: "Mix 1 (Undertale, Hypixel Skyblock, Splatoon 3)",
        afterAdd: playlistprep
    }
];