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
		{value: 'rasputin', name: "Toad Sings Ra Ra Rasputin" },
		{value: 'widepuin', name: "Song for Denise (Maxi Version) bass boosted 1 hour"},
		{value: 'undertale', name: "Undertale OST playlist (only boss fights)"},
		{value: 'skyblock', name: "Hypixel Skyblock OST"},
		{value: 'chill', name: "Chill Music (\"Poké & Chill\", \"Zelda & Chill\", \"Zelda & Chill 2\", ...)"}
		],
		required: true
	} ],
    voiceChannel: true,

    run: async (client, interaction) => {
		const target = interaction.options.getString('target') 
        const res = await {
			if (target='rasputin') {
				client.player.search('https://www.youtube.com/watch?v=KT85z_tGZro', {
					requestedBy: interaction.member,
					searchEngine: QueryType.AUTO
				});
			}, 
			if (target='wideputin') {
				client.player.search('https://www.youtube.com/watch?v=RHRKu5mStNk', {
					requestedBy: interaction.member,
					searchEngine: QueryType.AUTO
				});
			}, 
			if (target='undertale') {
				client.player.search('https://www.youtube.com/playlist?list=PLvJE24xlovhuuhaQInNsjRyRF8QdFnh6V', {
					requestedBy: interaction.member,
					searchEngine: QueryType.AUTO
				});
			}, 
			if (target='skyblock') {
				client.player.search('https://www.youtube.com/playlist?list=PLPYaA8L35a72GLLbbMKc2v8D-AHPDFXsV', {
					requestedBy: interaction.member,
					searchEngine: QueryType.AUTO
				});
			}, 
			if (target='chill') {
				client.player.search('https://www.youtube.com/playlist?list=PL7NAts7dexLtnzzdQ7DE22D1EX7ZQW81H', {
					requestedBy: interaction.member,
					searchEngine: QueryType.AUTO
				});
			}
		}

        if (!res || !res.tracks.length) return interaction.reply({ content: `No results found! ❌`, ephemeral: true }).catch(e => { });

        const queue = await client.player.createQueue(message.guild, {
			leaveOnEnd: client.config.opt.voiceConfig.leaveOnEnd,
			autoSelfDeaf: client.config.opt.voiceConfig.autoSelfDeaf,
			metadata: interaction.channel
        });
      
        try {
            if (!queue.connection) await queue.connect(interaction.member.voice.channel);
        } catch {
            await client.player.deleteQueue(interaction.guild.id);
            return interaction.reply({ content: `I can't join the audio channel. ❌`, ephemeral: true }).catch(e => { });
        }

        await interaction.reply({ content: `Your ${res.playlist ? 'Playlist' : 'Track'} is loading now... 🎧` }).catch(e => {});

        res.playlist ? queue.addTracks(res.tracks) : queue.addTrack(res.tracks[0]);

        if (!queue.playing) await queue.play();
      
		if (target='rasputin') {
            // Warten für 4 Sekunden
			setTimeout(function() {
            // loop track:
				const success = queue.setRepeatMode(queue.repeatMode === 0 ? QueueRepeatMode.TRACK : QueueRepeatMode.OFF);
            
				return interaction.reply({ content: success ? `Loop Mode: **${queue.repeatMode === 0 ? 'Inactive' : 'Active'}**, Current track will be repeated non-stop 🔂` : `${message.author}, Something went wrong ❌` }).catch(e => {});
        
            }, 4000);
      
			// Warten für 4 Sekunden (0 Sekunden danach)
			setTimeout(function() {
				queue.setVolume(250);
            
				return interaction.reply({ content: `Volume changed to **250%** (maximum is **${maxVol}%**) 🔊` }).catch(e => {});
            }, 4001);
		} else if (target='wideputin') {
            // Warten für 4 Sekunden
			setTimeout(function() {
            // loop track:
				const success = queue.setRepeatMode(queue.repeatMode === 0 ? QueueRepeatMode.TRACK : QueueRepeatMode.OFF);
            
				return interaction.reply({ content: success ? `Loop Mode: **${queue.repeatMode === 0 ? 'Inactive' : 'Active'}**, Current track will be repeated non-stop 🔂` : `${message.author}, Something went wrong ❌` }).catch(e => {});
        
			}, 4000);
      
			// Warten für 4 Sekunden (0 Sekunden danach)
			setTimeout(function() {
				queue.setVolume(200);
            
			return interaction.reply({ content: `Volume changed to **200%** (maximum is **${maxVol}%**) 🔊` }).catch(e => {});
			}, 4001);
		} else if (target='undertale') {
			// Warten für 4 Sekunden
			setTimeout(function() {
				// shuffle
				const success = queue.shuffle();
				return interaction.reply({ content: `Queue has been shuffled! ✅` }).catch(e => {});
			}, 4000);
      
			// Warten für 4 Sekunden (0 Sekunden danach)
			setTimeout(function() {
				// loop queue:
				const success = queue.setRepeatMode(queue.repeatMode === 0 ? QueueRepeatMode.QUEUE : QueueRepeatMode.OFF);

				return interaction.reply({ content: success ? `Loop Mode: **${queue.repeatMode === 0 ? 'Inactive' : 'Active'}**, The whole sequence will repeat non-stop 🔁` : `${message.author}, Something went wrong. ❌` }).catch(e => {});
        
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
		} else if (target='skyblock') {
			// Warten für 4 Sekunden
			setTimeout(function() {
				// shuffle
				const success = queue.shuffle();
				return interaction.reply({ content: `Queue has been shuffled! ✅` }).catch(e => {});
			}, 4000);
      
			// Warten für 4 Sekunden (0 Sekunden danach)
			setTimeout(function() {
				// loop queue:
				const success = queue.setRepeatMode(queue.repeatMode === 0 ? QueueRepeatMode.QUEUE : QueueRepeatMode.OFF);

				return interaction.reply({ content: success ? `Loop Mode: **${queue.repeatMode === 0 ? 'Inactive' : 'Active'}**, The whole sequence will repeat non-stop 🔁` : `${message.author}, Something went wrong. ❌` }).catch(e => {});
        
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
		} else if (target='chill') {
			// Warten für 4 Sekunden
			setTimeout(function() {
				// shuffle
				const success = queue.shuffle();
				return interaction.reply({ content: `Queue has been shuffled! ✅` }).catch(e => {});
			}, 4000);
      
			// Warten für 4 Sekunden (0 Sekunden danach)
			setTimeout(function() {
				// loop queue:
				const success = queue.setRepeatMode(queue.repeatMode === 0 ? QueueRepeatMode.QUEUE : QueueRepeatMode.OFF);

				return interaction.reply({ content: success ? `Loop Mode: **${queue.repeatMode === 0 ? 'Inactive' : 'Active'}**, The whole sequence will repeat non-stop 🔁` : `${message.author}, Something went wrong. ❌` }).catch(e => {});
        
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