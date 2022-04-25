module.exports = {
    name: 'url',
    aliases: ['link'],
    utilisation: '{prefix}url',
    voiceChannel: true,

    execute(client, message) {
        const queue = client.player.getQueue(message.guild.id);

 if (!queue || !queue.playing) return message.channel.send(`${message.author}, There is no music currently playing!. ❌`);

        const track = queue.current;
        console.log(track);
      
        return message.channel.send('The now playing track, `'+track.title+'` by `'+track.author+'`, has the following URL:\n<'+track.url+'>'); 
      
    },
};