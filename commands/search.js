const { MessageEmbed } = require('discord.js');
const { QueryType } = require('discord-player');
const blacklist = require("../config.js").opt.blacklist;

module.exports = {
    description: "Lets you search for a track and choose from multiple options.",
    name: 'search',
    options: [{
        name: 'name',
        description: 'The name of the track you want to search for.',
        type: 'STRING',
        required: true
    }],
    voiceChannel: true,

    run: async (client, interaction) => {
      const name = interaction.options.getString('name')
if (!name) return interaction.reply({ content: `Please enter a valid song name. ❌`, ephemeral: true }).catch(e => { });

        const res = await client.player.search(name, {
            requestedBy: interaction.member,
            searchEngine: QueryType.AUTO
        });

        if (!res || !res.tracks.length) return interaction.reply({ content: `No search results were found. ❌`, ephemeral: true }).catch(e => { });

        const queue = await client.player.createQueue(interaction.guild, {
            leaveOnEnd: client.config.opt.voiceConfig.leaveOnEnd,
            autoSelfDeaf: client.config.opt.voiceConfig.autoSelfDeaf,
            metadata: interaction.channel,
			initialVolume: client.config.opt.discordPlayer.initialVolume,
			volumeSmoothness: client.config.opt.discordPlayer.volumeSmoothness
        });

        const embed = new MessageEmbed();

        embed.setColor('BLUE');
        embed.setTitle(`Searched Music: "${name}"`);

        const maxTracks = res.tracks.slice(0, 10);

        embed.setDescription(`${maxTracks.map((track, i) => `**${i + 1}**. \`${track.title}\` | \`${track.author}\``).join('\n')}\n\nChoose a song from **1** to **${maxTracks.length}** by writing the number or **cancel** to cancel the selection.⬇️`);

        embed.setTimestamp();
        embed.setFooter({ text: 'Music Bot - by CraftingShadowDE', iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

        interaction.reply({ embeds: [embed] }).catch(e => { })

        const collector = interaction.channel.createMessageCollector({
            time: 15000,
            errors: ['time'],
            filter: m => m.author.id === interaction.user.id
        });

       collector.on('collect', async (query) => {
            if (query.content.toLowerCase() === 'cancel') return interaction.reply({ content: `Searching has been cancelled. ✅`, ephemeral: true }).catch(e => { }) && collector.stop();

            const value = parseInt(query.content);

            if (!value || value <= 0 || value > maxTracks.length) return interaction.reply({ content: `Please choose a song from **1** to **${maxTracks.length}** by writing the number or **cancel** to cancel the selection. ❌`, ephemeral: true }).catch(e => { })
;

            collector.stop();

            try {
                if (!queue.connection) await queue.connect(interaction.member.voice.channel);
            } catch {
                await client.player.deleteQueue(interaction.guild.id);
                return interaction.reply({ content: `I can't join the audio channel. ❌`, ephemeral: true }).catch(e => { });
            }

            await interaction.reply({ content: `Your choosen track is loading now... 🎧` }).catch(e => { });

         
      const filter = res.tracks[Number(query.content)-1].title; // adds an variable that is used to check for the blacklist
      
//      console.log('RES TRACKS 0:\n'+filter); // info ausgabe der res (result) variable zum Filtern, gewähltes Ergebnis
//      console.log('Blacklist detection:', blacklist.includes(filter)); // Test auf Blacklist mit Konsolenausgabe
      
        if (blacklist.includes(filter)) { // Filter
          return interaction.reply({ content: `Something went wrong :( ❌`, ephemeral: true }).catch(e => { }); // "Fehlermeldung"
        } else {
          queue.addTrack(res.tracks[Number(query.content)-1]); // im Normalfall Musik hinzufügen
        }
            if (!queue.playing) await queue.play();
           
        });

        collector.on('end', (msg, reason) => {
            if (reason === 'time') return interaction.reply({ content: `Song search time expired ❌`, ephemeral: true }).catch(e => { });
        });
    },
};