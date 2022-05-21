const { QueryType } = require('discord-player');
const blacklist = require("../config.js").opt.blacklist;

module.exports = {
    description: "Adds a track/playlist to the queue.",
    name: 'play',
    options: [{
        name: 'target',
        description: "Enter the name or the URL of the track/playlist you want to add.",
        type: 'STRING',
        required: true
    }],
    voiceChannel: true,

    run: async (client, interaction) => {
		const name = interaction.options.getString('target')
if (!name) return interaction.reply({ content: `Write the name of the music you want to play. ❌`, ephemeral: true }).catch(e => { });

        const res = await client.player.search(name, {
            requestedBy: interaction.member,
            searchEngine: QueryType.AUTO
        });

        if (!res || !res.tracks.length) return interaction.reply({ content: `No results found! ❌`, ephemeral: true }).catch(e => { });

        const queue = await client.player.createQueue(interaction.guild, {
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

      const filter = res.tracks[0].title; // adds an variable that is used to check for the blacklist
      
//      console.log('RES TRACKS 0:\n'+filter); // info ausgabe der res (result) variable zum Filtern, nur Ergebnis 1
//      console.log('Blacklist detection:', blacklist.includes(filter)); // Test auf Blacklist mit Konsolenausgabe
      
        if (blacklist.includes(filter)) { // Filter
          return interaction.reply({ content: `Something went wrong :( ❌`, ephemeral: true }).catch(e => { }); // "Fehlermeldung"
        } else {
          res.playlist ? queue.addTracks(res.tracks) : queue.addTrack(res.tracks[0]); // im Normalfall Musik hinzufügen
        }

        if (!queue.playing) await queue.play();
    },
};