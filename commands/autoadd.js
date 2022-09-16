const createQueue = require("../exports/queue.js").createQueue;
const TypeMap = require("../exports/TypeMap.js").TypeMap;
const { ApplicationCommandOptionType } = require('discord.js');
const { QueryType } = require('discord-player');
const { QueueRepeatMode } = require('discord-player');
const maxVol = require("../config.js").opt.maxVol;
const wait = require('node:timers/promises').setTimeout;

  /*
  * NEUEN TRACK/NEUE PLAYLIST ADDEN
  * ---------------------------
  * 1. Einfacher Track, keine Playlist
  * - neue Choice hinzufügen mit Name als name und internem Namen (nur Kleinbuchstaben) als value
  * - in der UrlMap-Map hinzufügen (mit "UrlMap.set([interner Name], [Array mit URL]);")
  * - Wenn gewollt, unten eine weitere Option (LoopMode, volume, ...) hinzufügen bzw. neuen Track irgendwo eingliedern
  * 
  * 2. Playlist bestehend aus einer URL
  * - neue Choice hinzufügen mit Name als name und internem Namen (nur Kleinbuchstaben) als value
  * - in der UrlMap-Map hinzufügen (mit "UrlMap.set([interner Name], [Array mit URL]);")
  * - im playlists-Array den internen Namen hinzufügen
  * 
  * 3. Playlist/Tracks bestehend aus mehreren URLs
  * - neue Choice hinzufügen mit Name als name und internem Namen (nur Kleinbuchstaben) als value
  * - in der UrlMap-Map hinzufügen (mit "UrlMap.set([interner Name], [Array mit URLs (sie werden nach dieser Reihenfolge hinzugefügt)]);")
  * - Wenn gewollt, internen Namen zum playlists-Array hinzufügen oder unten eine eigene Option (LoopMode, volume, ...) hinzufügen bzw. irgendwo eingliedern
  */

module.exports = {
    description: "Adds a song/playlist that has been added to the bot's code.",
    name: 'autoadd',
	options: [ {
		type: ApplicationCommandOptionType.String,
		name: 'target',
		description: "What song/playlist should be added?",
		choices: [
		{name: "Toad Sings Ra Ra Rasputin", value: 'rasputin'}, //Ra Ra Rasputin (Toad version) loop
		{name: "Song for Denise (Maxi Version) bass boosted 1 hour", value: 'wideputin'}, //Widepuin music loop
		{name: "Undertale OST playlist (only boss fights)", value: 'undertale'}, //Undertale OST (boss fights only)
		{name: "Hypixel Skyblock OST", value: 'skyblock'}, //Hypixel Skyblock OST
		{name: "Chill Music (\"Poké & Chill\", \"Zelda & Chill\", \"Zelda & Chill 2\", ...)", value: 'chill'}, //Chill Music (by Mikel)
    {name: "Paper Mario 2 OST", value: 'papermario2'}, //Paper Mario 2 OST
    {name: "Splatoon 3 OST", value: 'splatoon3'}, //Splatoon 3 OST
		],
		required: true
	} ],
    voiceChannel: true,

    run: async (client, interaction) => {
		const playlists = ['undertale','skyblock','chill','papermario2','splatoon3']
    const target = interaction.options.getString('target') 

    const UrlMap = new TypeMap('string','object');
    UrlMap.set('rasputin', ['https://www.youtube.com/watch?v=KT85z_tGZro']);
    UrlMap.set('wideputin', ['https://www.youtube.com/watch?v=RHRKu5mStNk']);
    UrlMap.set('undertale', ['https://www.youtube.com/playlist?list=PLvJE24xlovhuuhaQInNsjRyRF8QdFnh6V']);
    UrlMap.set('skyblock', ['https://www.youtube.com/playlist?list=PLPYaA8L35a72GLLbbMKc2v8D-AHPDFXsV']);
    UrlMap.set('chill', ['https://open.spotify.com/album/3oNO1P0Qlr4oSlMA2MIj67','https://open.spotify.com/album/0N0noai9OQs1rYEaS47vJw','https://open.spotify.com/album/4lBMa9JEuCSIs3NkPEIwvN']); // ['Zelda & Chill 1','Zelda & Chill 2','Poké & Chill']
    UrlMap.set('papermario2', ['https://youtube.com/playlist?list=PLZODI99P5wP9Qh_t4VNf4iRFEETG37Dhy']);
    UrlMap.set('splatoon3',['https://www.youtube.com/playlist?list=PLxGVeb0fxoSjiSkrp8x6CsdYdzCnDD4WD'])

    const isInMap = UrlMap.has(target);
		const targetArray = isInMap ? UrlMap.get(target) : [];

    await interaction.deferReply();

    const queue = await createQueue(client, interaction);
    
      const addTracks = async (target, targetInput, trackIndex, trackAmount) => {
        const res = await client.player.search(target, {
            requestedBy: interaction.member,
            searchEngine: QueryType.AUTO
        });

        if (!res || !res.tracks.length) if (trackIndex===0) return interaction.editReply({ content: `No results found! ❌`, ephemeral: true }).catch(e => { });
        if (!res || !res.tracks.length) if (trackIndex!==0) return interaction.followUp({ content: `No results found! ❌`, ephemeral: true }).catch(e => { });
      
        try {
            if (!queue.connection) await queue.connect(interaction.member.voice.channel);
        } catch {
            await client.player.deleteQueue(interaction.guild.id);
            if (trackIndex===0) return interaction.editReply({ content: `I can't join the audio channel. ❌`, ephemeral: true }).catch(e => { });
            if (trackIndex!==0) return interaction.followUp({ content: `I can't join the audio channel. ❌`, ephemeral: true }).catch(e => { });
        }

        if (trackIndex===0) await interaction.editReply({ content: `Your ${res.playlist ? 'Playlist' : 'Track'} is loading now... 🎧` }).catch(e => {});

        res.playlist ? queue.addTracks(res.tracks) : queue.addTrack(res.tracks[0]);

		if (playlists.includes(targetInput)) { // prüfen auf playlist
			queue.setVolume(0); // volume auf 0, wenn playlist ausgewählt wurde
		}

//		console.log(playlists)
//		console.log(target)
//		console.log(playlists.includes(target))
    if (trackAmount!==(trackIndex + 1)) await wait(100);
    }  
  
    if (!isInMap) return interaction.editReply({ content: `Something went completely wrong! ❌`, ephemeral: true }).catch(e => { });
    if (isInMap) {
      for (var i = 0; i < (targetArray.length); i++) {
        await addTracks(targetArray[i], target, i, targetArray.length);
      }
    }

        if (!queue.playing) await queue.play();
      
		if (target==='rasputin') { //----------------------------------------------------------------------------------------------------------------------------------------------------------------------
      const rasputinprep = async () => {
      await wait(4000); //Wait for 4 seconds
            // loop track:
				const success = queue.setRepeatMode(QueueRepeatMode.TRACK);
        success ? interaction.followUp({ content: `Loop Mode: **${queue.repeatMode === 0 ? 'Inactive' : 'Active'}**, Current track will be repeated non-stop 🔂` }).catch(e => {}) :
        interaction.followUp({ content: `${interaction.member.user}, Could not update loop mode! ❌`, ephemeral: true }).catch(e => {});
        
      
			  await wait(1); // Wait for 0.001 seconds
            // volume:
				queue.setVolume(250);
				interaction.followUp({ content: `Volume changed to **250%** (maximum is **${maxVol}%**) 🔊` }).catch(e => {});
      }
      rasputinprep();
		} else if (target==='wideputin') { //--------------------------------------------------------------------------------------------------------------------------------------------------------------
			const wideputinprep = async () => {
        await wait(4000); // Wait for 4 seconds
            // loop track:
				const success = queue.setRepeatMode(QueueRepeatMode.TRACK);    
				success ? interaction.followUp({ content: `Loop Mode: **${queue.repeatMode === 0 ? 'Inactive' : 'Active'}**, Current track will be repeated non-stop 🔂` }).catch(e => {}) :
        interaction.followUp({ content: `${interaction.member.user}, Could not update loop mode! ❌`, ephemeral: true }).catch(e => {});

			  await wait(1); // Wait for 0.001 seconds
            // volume:
				queue.setVolume(200);    
			  interaction.followUp({ content: `Volume changed to **200%** (maximum is **${maxVol}%**) 🔊` }).catch(e => {});
			}
      wideputinprep();
		} else if (playlists.includes(target)) { //playlists-----------------------------------------------------------------------------------------------------------------------------------------------
			const playlistprep = async () => {
        await wait(4000); // Wait for 4 seconds
				// shuffle:
				queue.shuffle();
				interaction.followUp({ content: `Queue has been shuffled! ✅` }).catch(e => {});
        
			// Warten für 4 Sekunden (0 Sekunden danach)
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
    playlistprep();
		} //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    }
};
