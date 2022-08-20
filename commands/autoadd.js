const createQueue = require("../queue.js").createQueue;
const { ApplicationCommandOptionType } = require('discord.js');
const { QueryType } = require('discord-player');
const { QueueRepeatMode } = require('discord-player');
const maxVol = require("../config.js").opt.maxVol;
const wait = require('node:timers/promises').setTimeout;
// https://github.com/Androz2091/discord-player/issues/892 https://discord-player.js.org/docs/main/master/extractors/create_stream https://discord-player.js.org/docs/main/master/typedef/PlayerOptions
  /*
  * NEUEN TRACK/PLAYLIST ADDEN
  * ---------------------------
  * 1. Einfacher Track, keine Playlist
  * - neue Choice hinzufügen mit Name als name und URL als value
  * - Wenn gewollt, unten eine weitere Option (LoopMode, volume, ...) hinzufügen bzw. neuen Track irgendwo eingliedern mit logischem ODER
  * 
  * 2. Playlist bestehend aus einer URL
  * - neue Choice hinzufügen mit Name als name und URL als value
  * - im playlists-Array die URL hinzufügen
  * 
  * 3. Playlist/Tracks bestehend aus mehreren URLs
  * - neue Choice hinzufügen mit Name als name und internem Namen (nur Kleinbuchstaben) als value
  * - in der UrlMap-Map hinzufügen (mit "UrlMap.set([interner Name], [Array mit URLs (sie werden nach dieser Reihenfolge hinzugefügt)]);")
  * - Wenn gewollt, internen Namen zum playlists-Array hinzufügen oder unten eine eigene Option (LoopMode, volume, ...) hinzufügen bzw. irgendwo eingliedern mit logischem ODER
  */

module.exports = {
    description: "Adds a song/playlist that has been added to the bot's code.",
    name: 'autoadd',
	options: [ {
		type: ApplicationCommandOptionType.String,
		name: 'target',
		description: "What song/playlist should be added?",
		choices: [
		{name: "Toad Sings Ra Ra Rasputin", value: 'https://www.youtube.com/watch?v=KT85z_tGZro'}, //rasputin
		{name: "Song for Denise (Maxi Version) bass boosted 1 hour", value: 'https://www.youtube.com/watch?v=RHRKu5mStNk'}, //widepuin
		{name: "Undertale OST playlist (only boss fights)", value: 'https://www.youtube.com/playlist?list=PLvJE24xlovhuuhaQInNsjRyRF8QdFnh6V'}, //undertale
		{name: "Hypixel Skyblock OST", value: 'https://www.youtube.com/playlist?list=PLPYaA8L35a72GLLbbMKc2v8D-AHPDFXsV'}, //skyblock
		{name: "Chill Music (\"Poké & Chill\", \"Zelda & Chill\", \"Zelda & Chill 2\", ...)", value: 'chill'}, //chill
    {name: "Paper Mario 2 OST", value: 'https://youtube.com/playlist?list=PLZODI99P5wP9Qh_t4VNf4iRFEETG37Dhy'}, //papermario2
		],
		required: true
	} ],
    voiceChannel: true,

    run: async (client, interaction) => {
		const playlists = ['https://www.youtube.com/playlist?list=PLvJE24xlovhuuhaQInNsjRyRF8QdFnh6V','https://www.youtube.com/playlist?list=PLPYaA8L35a72GLLbbMKc2v8D-AHPDFXsV','chill','https://youtube.com/playlist?list=PLZODI99P5wP9Qh_t4VNf4iRFEETG37Dhy'] // undertale, skyblock, chill, papermario2
    const target = interaction.options.getString('target') 

    const UrlMap = new Map();
    UrlMap.set('chill', ['https://open.spotify.com/album/3oNO1P0Qlr4oSlMA2MIj67','https://open.spotify.com/album/0N0noai9OQs1rYEaS47vJw','https://open.spotify.com/album/4lBMa9JEuCSIs3NkPEIwvN']); // ['Zelda & Chill 1','Zelda & Chill 2','Poké & Chill']

    const isMultipleTargets = UrlMap.has(target);
		const targetArray = isMultipleTargets ? UrlMap.get(target) : [];

    await interaction.deferReply();

    const queue = await createQueue(client, interaction);
    
    const addSingle = async (target) => {
        const res = await client.player.search(target, {
            requestedBy: interaction.member,
            searchEngine: QueryType.AUTO
        });

        if (!res || !res.tracks.length) return interaction.editReply({ content: `No results found! ❌`, ephemeral: true }).catch(e => { });

        try {
            if (!queue.connection) await queue.connect(interaction.member.voice.channel);
        } catch {
            await client.player.deleteQueue(interaction.guild.id);
            return interaction.editReply({ content: `I can't join the audio channel. ❌`, ephemeral: true }).catch(e => { });
        }

        await interaction.editReply({ content: `Your ${res.playlist ? 'Playlist' : 'Track'} is loading now... 🎧` }).catch(e => {});

        res.playlist ? queue.addTracks(res.tracks) : queue.addTrack(res.tracks[0]);

		if (playlists.includes(target)) { // prüfen auf playlist
			queue.setVolume(0); // volume auf 0, wenn playlist ausgewählt wurde
		}

//		console.log(playlists)
//		console.log(target)
//		console.log(playlists.includes(target))
    }
    
      const addMultiple = async (target, targetInput, i) => {
        const res = await client.player.search(target, {
            requestedBy: interaction.member,
            searchEngine: QueryType.AUTO
        });

        if (!res || !res.tracks.length) if (i===0) return interaction.editReply({ content: `No results found! ❌`, ephemeral: true }).catch(e => { });
        if (!res || !res.tracks.length) if (i!==0) return interaction.followUp({ content: `No results found! ❌`, ephemeral: true }).catch(e => { });
      
        try {
            if (!queue.connection) await queue.connect(interaction.member.voice.channel);
        } catch {
            await client.player.deleteQueue(interaction.guild.id);
            if (i===0) return interaction.editReply({ content: `I can't join the audio channel. ❌`, ephemeral: true }).catch(e => { });
            if (i!==0) return interaction.followUp({ content: `I can't join the audio channel. ❌`, ephemeral: true }).catch(e => { });
        }

        if (i===0) await interaction.editReply({ content: `Your ${res.playlist ? 'Playlist' : 'Track'} is loading now... 🎧` }).catch(e => {});

        res.playlist ? queue.addTracks(res.tracks) : queue.addTrack(res.tracks[0]);

		if (playlists.includes(targetInput)) { // prüfen auf playlist
			queue.setVolume(0); // volume auf 0, wenn playlist ausgewählt wurde
		}

//		console.log(playlists)
//		console.log(target)
//		console.log(playlists.includes(target))
    await wait(100);
    }  
  
    if (!isMultipleTargets) await addSingle(target);
    if (isMultipleTargets) {
      for (var i = 0; i < (targetArray.length); i++) {
        await addMultiple(targetArray[i], target, i);
      }
    }

        if (!queue.playing) await queue.play();
      
		if (target==='https://www.youtube.com/watch?v=KT85z_tGZro') { //rasputin ----------------------------------------------------------------------------------------------------------------------
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
		} else if (target==='https://www.youtube.com/watch?v=RHRKu5mStNk') { //widepuin ---------------------------------------------------------------------------------------------------------------
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
		} else if (playlists.includes(target)) { //Playlists ------------------------------------------------------------------------------------------------------------------------------------------
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
		}
    }
};
