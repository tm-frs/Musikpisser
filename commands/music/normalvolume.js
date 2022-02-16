module.exports = {
    name: 'normalvolume',
    aliases: ['normvol','nvol','nv'],
    utilisation: `{prefix}normalvolume`,
    voiceChannel: true,

    execute(client, message, args) {
        const queue = client.player.getQueue(message.guild.id);

       if (!queue || !queue.playing) return message.channel.send(`${message.author}, There is no music currently playing!. ❌`);

		queue.setVolume(100);

        return message.channel.send(`Volume changed to normal volume (100) 🔊`) ;
    },
};