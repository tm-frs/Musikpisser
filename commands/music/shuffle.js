const { QueueRepeatMode } = require('discord-player');

module.exports = {
    name: 'shuffle',
    aliases: ['sf'],
    utilisation: '{prefix}shuffle',
    voiceChannel: true,

    execute(client, message, args) {
        const queue = client.player.getQueue(message.guild.id);

 
if (!queue || !queue.playing) return message.channel.send(`${message.author}, There is no music currently playing!. ❌`);

        if (queue || queue.playing) {

            const success = queue.shuffle();

            return message.channel.send(`Queue has been shuffled! ✅`);
        }
    },
};