const { QueryType } = require('discord-player');

module.exports = {
    name: 'rasputin',
    aliases: ['rp'],
    utilisation: '{prefix}rasputin',
    voiceChannel: true,

    async execute(client, message, args) {

        const res = await client.player.search('https://www.youtube.com/watch?v=KT85z_tGZro', {
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
    },
};