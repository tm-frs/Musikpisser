const { QueryType } = require('discord-player');

module.exports = {
    name: 'play',
    aliases: ['p'],
    utilisation: '{prefix}play [song name/URL]',
    voiceChannel: true,

    async execute(client, message, args) {
if (!args[0]) return message.channel.send(`${message.author}, Write the name of the music you want to play. ❌`);

        const res = await client.player.search(args.join(' '), {
            requestedBy: message.member,
            searchEngine: QueryType.AUTO
        });

        if (!res || !res.tracks.length) return message.channel.send(`${message.author}, No results found! ❌`);

        const queue = await client.player.createQueue(message.guild, {
            metadata: message.channel
        });

        try {
            if (!queue.connection) await queue.connect(message.member.voice.channel);
        } catch {
            await client.player.deleteQueue(message.guild.id);
            return message.channel.send(`${message.author}, I can't join the audio channel. ❌`);
        }
      
        await message.channel.send(`Your ${res.playlist ? 'Playlist' : 'Track'} is loading now... 🎧`);
//      console.log(`${res.tracks[0]}`); // info ausgabe der res (result) variable zum Filtern, nur Ergebnis 1
        if ((res.tracks[0]!='grandson - Blood // Water (Official Audio) by grandson') && (res.tracks[0]!='grandson - Blood // Water (Official Audio) by GrandsonVEVO')) { // Filter (mehrere Filter sind nicht mit logischem ODER [||], sondern mit logischem UND [&&] zu verbinden)
          res.playlist ? queue.addTracks(res.tracks) : queue.addTrack(res.tracks[0]); // im Normalfall Musik hinzufügen
        } else {
        return message.channel.send(`${message.author}, Something went wrong :( ❌`); // "Fehlermeldung"
        }

        if (!queue.playing) await queue.play();
    },
};