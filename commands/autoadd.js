const { ApplicationCommandOptionType } = require('discord.js');
const { QueryType } = require('discord-player');
const { QueueRepeatMode } = require('discord-player');
const maxVol = require("../config.js").opt.maxVol;
const wait = require('node:timers/promises').setTimeout;

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
		const chillplaylists = ['https://open.spotify.com/album/3oNO1P0Qlr4oSlMA2MIj67','https://open.spotify.com/album/0N0noai9OQs1rYEaS47vJw','https://open.spotify.com/album/4lBMa9JEuCSIs3NkPEIwvN'] // ['Zelda & Chill 1','Zelda & Chill 2','Poké & Chill']
    const target = interaction.options.getString('target') 
		
    const queue = await client.player.createQueue(interaction.guild, {
			leaveOnEnd: client.config.opt.voiceConfig.leaveOnEnd,
			autoSelfDeaf: client.config.opt.voiceConfig.autoSelfDeaf,
			metadata: interaction.channel,
			initialVolume: client.config.opt.discordPlayer.initialVolume,
			volumeSmoothness: client.config.opt.discordPlayer.volumeSmoothness
    });
    
    const addnotchill = async () => {
        const res = await client.player.search(target, {
            requestedBy: interaction.member,
            searchEngine: QueryType.AUTO
        });

        if (!res || !res.tracks.length) return interaction.reply({ content: `No results found! ❌`, ephemeral: true }).catch(e => { });

        try {
            if (!queue.connection) await queue.connect(interaction.member.voice.channel);
        } catch {
            await client.player.deleteQueue(interaction.guild.id);
            return interaction.reply({ content: `I can't join the audio channel. ❌`, ephemeral: true }).catch(e => { });
        }

        await interaction.reply({ content: `Your ${res.playlist ? 'Playlist' : 'Track'} is loading now... 🎧` }).catch(e => {});

        res.playlist ? queue.addTracks(res.tracks) : queue.addTrack(res.tracks[0]);

		if (playlists.includes(target)) { // prüfen auf playlist
			queue.setVolume(0); // volume auf 0, wenn playlist ausgewählt wurde
		}

//		console.log(playlists)
//		console.log(target)
//		console.log(playlists.includes(target))
    }
    
      const addchill = async (target) => {
        const res = await client.player.search(target, {
            requestedBy: interaction.member,
            searchEngine: QueryType.AUTO
        });

        if (!res || !res.tracks.length) return interaction.reply({ content: `No results found! ❌`, ephemeral: true }).catch(e => { });
      
        try {
            if (!queue.connection) await queue.connect(interaction.member.voice.channel);
        } catch {
            await client.player.deleteQueue(interaction.guild.id);
            return interaction.reply({ content: `I can't join the audio channel. ❌`, ephemeral: true }).catch(e => { });
        }

        await interaction.reply({ content: `Your ${res.playlist ? 'Playlist' : 'Track'} is loading now... 🎧` }).catch(e => {});

        res.playlist ? queue.addTracks(res.tracks) : queue.addTrack(res.tracks[0]);

		if (playlists.includes(target)) { // prüfen auf playlist
			queue.setVolume(0); // volume auf 0, wenn playlist ausgewählt wurde
		}

//		console.log(playlists)
//		console.log(target)
//		console.log(playlists.includes(target))
    await wait(100);
    }  
  
    if (target !== 'chill') await addnotchill();
    if (target === 'chill') {
      for (var i = 0; i < (chillplaylists.length); i++) {
        await addchill(chillplaylists[i]);
      }
    }

        if (!queue.playing) await queue.play();
      
		if (target==='https://www.youtube.com/watch?v=KT85z_tGZro') { //rasputin ----------------------------------------------------------------------------------------------------------------------
      const rasputinprep = async () => {
      await wait(4000); //Wait for 4 seconds
            // loop track:
				const success = queue.setRepeatMode(QueueRepeatMode.TRACK);
        interaction.channel.send({ content: success ? `Loop Mode: **${queue.repeatMode === 0 ? 'Inactive' : 'Active'}**, Current track will be repeated non-stop 🔂` : `${interaction.member.user}, Could not update loop mode! ❌` }).catch(e => {});
      
			  await wait(1); // Wait for 0.001 seconds
            // volume:
				queue.setVolume(250);
				interaction.channel.send({ content: `Volume changed to **250%** (maximum is **${maxVol}%**) 🔊` }).catch(e => {});
      }
      rasputinprep();
		} else if (target==='https://www.youtube.com/watch?v=RHRKu5mStNk') { //widepuin ---------------------------------------------------------------------------------------------------------------
			const wideputinprep = async () => {
        await wait(4000); // Wait for 4 seconds
            // loop track:
				const success = queue.setRepeatMode(QueueRepeatMode.TRACK);    
				interaction.channel.send({ content: success ? `Loop Mode: **${queue.repeatMode === 0 ? 'Inactive' : 'Active'}**, Current track will be repeated non-stop 🔂` : `${interaction.member.user}, Could not update loop mode! ❌` }).catch(e => {});

			  await wait(1); // Wait for 0.001 seconds
            // volume:
				queue.setVolume(200);    
			  interaction.channel.send({ content: `Volume changed to **200%** (maximum is **${maxVol}%**) 🔊` }).catch(e => {});
			}
      wideputinprep();
		} else if (playlists.includes(target)) { //Playlists ------------------------------------------------------------------------------------------------------------------------------------------
			const playlistprep = async () => {
        await wait(4000); // Wait for 4 seconds
				// shuffle:
				queue.shuffle();
				interaction.channel.send({ content: `Queue has been shuffled! ✅` }).catch(e => {});
        
			// Warten für 4 Sekunden (0 Sekunden danach)
			  await wait(1); // Wait for 0.001 seconds
				// loop queue:
				const success = queue.setRepeatMode(QueueRepeatMode.QUEUE);
				interaction.channel.send({ content: success ? `Loop Mode: **${queue.repeatMode === 0 ? 'Inactive' : 'Active'}**, The whole sequence will repeat non-stop 🔁` : `${interaction.member.user}, Something went wrong. ❌` }).catch(e => {});
      
			  await wait(1); // Wait for 0.001 seconds
				// skip:
				queue.skip();

        await wait(3998); // Wait for 3.998 seconds
				// skip:
				queue.skip();
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