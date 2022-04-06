const { QueryType } = require('discord-player');
const { QueueRepeatMode } = require('discord-player');

module.exports = {
    name: 'skyblock',
    aliases: ['sb'],
    utilisation: '{prefix}skyblock',
    voiceChannel: true,

    async execute(client, message, args) {
        
      // play
        const res = await client.player.search('https://www.youtube.com/playlist?list=PLPYaA8L35a72GLLbbMKc2v8D-AHPDFXsV', {
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

        res.playlist ? queue.addTracks(res.tracks) : queue.addTrack(res.tracks[0]);

        if (!queue.playing) await queue.play();
      
      // Warten für 10 Sekunden
          setTimeout(function() {

      // shuffle
      if (queue || queue.playing) {

            const success = queue.shuffle();

            return message.channel.send(`Queue has been shuffled! ✅`);
        
        
            // loop queue:
            queue.setRepeatMode(queue.repeatMode === 0 ? QueueRepeatMode.QUEUE : QueueRepeatMode.OFF);

            return message.channel.send(success ? `Loop Mode: **${queue.repeatMode === 0 ? 'Inactive' : 'Active'}**, The whole sequence will repeat non-stop 🔁` : `${message.author}, Something went wrong. ❌`);
        }
                }, 10000);
    },
};