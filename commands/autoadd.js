const { QueryType } = require('discord-player');
const { QueueRepeatMode } = require('discord-player');
const maxVol = require("../config.js").opt.maxVol;

module.exports = {
    description: "Adds a song/playlist that has been added to the bot's code.",
    name: 'autoadd',
	options: [ {
		type: 'STRING',
		name: 'target',
		description: "What song/playlist should be added?",
		choices: [
		{name: "Toad Sings Ra Ra Rasputin", value: 'https://www.youtube.com/watch?v=KT85z_tGZro'}, //rasputin
		{name: "Song for Denise (Maxi Version) bass boosted 1 hour", value: 'https://www.youtube.com/watch?v=RHRKu5mStNk'}, //widepuin
		{name: "Undertale OST playlist (only boss fights)", value: 'https://www.youtube.com/playlist?list=PLvJE24xlovhuuhaQInNsjRyRF8QdFnh6V'}, //undertale
		{name: "Hypixel Skyblock OST", value: 'https://www.youtube.com/playlist?list=PLPYaA8L35a72GLLbbMKc2v8D-AHPDFXsV'}, //skyblock
		{name: "Chill Music (\"Poké & Chill\", \"Zelda & Chill\", \"Zelda & Chill 2\", ...)", value: 'https://www.youtube.com/playlist?list=PL7NAts7dexLtnzzdQ7DE22D1EX7ZQW81H'} //chill
		],
		required: true
	} ],
    voiceChannel: true,

    run: async (client, interaction) => {
		const playlists = ['https://www.youtube.com/playlist?list=PLvJE24xlovhuuhaQInNsjRyRF8QdFnh6V','https://www.youtube.com/playlist?list=PLPYaA8L35a72GLLbbMKc2v8D-AHPDFXsV','https://www.youtube.com/playlist?list=PL7NAts7dexLtnzzdQ7DE22D1EX7ZQW81H'] // undertale, skyblock, chill
		const target = interaction.options.getString('target') 
		
        const res = await client.player.search(target, {
            requestedBy: interaction.member,
            searchEngine: QueryType.AUTO
        });

        if (!res || !res.tracks.length) return interaction.reply({ content: `No results found! ❌`, ephemeral: true }).catch(e => { });

        const queue = await client.player.createQueue(interaction.guild, {
			leaveOnEnd: client.config.opt.voiceConfig.leaveOnEnd,
			autoSelfDeaf: client.config.opt.voiceConfig.autoSelfDeaf,
			metadata: interaction.channel,
			initialVolume: client.config.opt.discordPlayer.initialVolume,
			volumeSmoothness: client.config.opt.discordPlayer.volumeSmoothness
        });
      
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

        if (!queue.playing) await queue.play();
      
		if (target==='https://www.youtube.com/watch?v=KT85z_tGZro') { //rasputin ----------------------------------------------------------------------------------------------------------------------
            // Warten für 4 Sekunden
			setTimeout(function() {
            // loop track:
				const success = queue.setRepeatMode(QueueRepeatMode.TRACK);
            
				return interaction.channel.send({ content: success ? `Loop Mode: **${queue.repeatMode === 0 ? 'Inactive' : 'Active'}**, Current track will be repeated non-stop 🔂` : `${interaction.member.user}, Could not update loop mode! ❌` }).catch(e => {});
        
            }, 4000);
      
			// Warten für 4 Sekunden (0 Sekunden danach)
			setTimeout(function() {
				queue.setVolume(250);
            
				return interaction.channel.send({ content: `Volume changed to **250%** (maximum is **${maxVol}%**) 🔊` }).catch(e => {});
            }, 4001);
		} else if (target==='https://www.youtube.com/watch?v=RHRKu5mStNk') { //widepuin ---------------------------------------------------------------------------------------------------------------
            // Warten für 4 Sekunden
			setTimeout(function() {
            // loop track:
				const success = queue.setRepeatMode(QueueRepeatMode.TRACK);
            
				return interaction.channel.send({ content: success ? `Loop Mode: **${queue.repeatMode === 0 ? 'Inactive' : 'Active'}**, Current track will be repeated non-stop 🔂` : `${interaction.member.user}, Could not update loop mode! ❌` }).catch(e => {});
        
			}, 4000);
      
			// Warten für 4 Sekunden (0 Sekunden danach)
			setTimeout(function() {
				queue.setVolume(200);
            
			return interaction.channel.send({ content: `Volume changed to **200%** (maximum is **${maxVol}%**) 🔊` }).catch(e => {});
			}, 4001);
		} else if (playlists.includes(target)) { //Playlists ------------------------------------------------------------------------------------------------------------------------------------------
			// Warten für 4 Sekunden
			setTimeout(function() {
				// shuffle
				const success = queue.shuffle();
				return interaction.channel.send({ content: `Queue has been shuffled! ✅` }).catch(e => {});
			}, 4000);
      
			// Warten für 4 Sekunden (0 Sekunden danach)
			setTimeout(function() {
				// loop queue:
				const success = queue.setRepeatMode(QueueRepeatMode.QUEUE);

				return interaction.channel.send({ content: success ? `Loop Mode: **${queue.repeatMode === 0 ? 'Inactive' : 'Active'}**, The whole sequence will repeat non-stop 🔁` : `${interaction.member.user}, Something went wrong. ❌` }).catch(e => {});
        
			}, 4001);
      
			// Warten für 4 Sekunden (0 Sekunden danach)
			setTimeout(function() {
				// skip
				const success = queue.skip();
			}, 4002);
            // Warten für 8 Sekunden (4 Sekunden danach)
			setTimeout(function() {
				// skip
				const success = queue.skip();
				queue.setVolume(100);
			}, 8000);

            // Warten für 9 Sekunden (1 Sekunde danach)
			setTimeout(function() {
				// shuffle
				const success = queue.shuffle();
			}, 9000);
		}
    }
};