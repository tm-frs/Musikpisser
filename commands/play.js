const createQueue = require("../exports/queue.js").createQueue;
const { ApplicationCommandOptionType } = require('discord.js');
const { QueryType } = require('discord-player');
const blacklist = require("../config.js").opt.blacklist;

module.exports = {
    description: "Adds a track/playlist to the queue.",
    name: 'play',
    options: [{
        name: 'target',
        description: "Enter the name or the URL of the track/playlist you want to add.",
        type: ApplicationCommandOptionType.String,
        required: true
    }],
    voiceChannel: true,

    run: async (client, interaction) => {
      await interaction.deferReply();

		const name = interaction.options.getString('target')
if (!name) return interaction.editReply({ content: `Write the name of the music you want to play. ❌`, ephemeral: true }).catch(e => { });

        const res = await client.player.search(name, {
            requestedBy: interaction.member,
            searchEngine: QueryType.AUTO
        });

        if (!res || !res.tracks.length) return interaction.editReply({ content: `No results found! ❌`, ephemeral: true }).catch(e => { });

        const queue = await createQueue(client, interaction);

        try {
            if (!queue.connection) await queue.connect(interaction.member.voice.channel);
        } catch {
            await client.player.deleteQueue(interaction.guild.id);
            return interaction.editReply({ content: `I can't join the audio channel. ❌`, ephemeral: true }).catch(e => { });
        }
      
        await interaction.editReply({ content: `Your ${res.playlist ? 'Playlist' : 'Track'} is loading now... 🎧` }).catch(e => {});

      const filter = res.tracks[0].title; // adds an variable that is used to check for the blacklist
      
//      console.log('RES TRACKS 0:\n'+filter); // info ausgabe der res (result) variable zum Filtern, nur Ergebnis 1
//      console.log('Blacklist detection:', blacklist.includes(filter)); // Test auf Blacklist mit Konsolenausgabe
      
        if (blacklist.includes(filter)) { // Filter
          return interaction.followUp({ content: `${interaction.member.user}, Something went wrong :( ❌`, ephemeral: true }).catch(e => { }); // "Fehlermeldung"
        } else {
          res.playlist ? queue.addTracks(res.tracks) : queue.addTrack(res.tracks[0]); // im Normalfall Musik hinzufügen
        }

        if (!queue.playing) await queue.play();
    },
};