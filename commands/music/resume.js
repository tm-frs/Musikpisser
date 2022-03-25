module.exports = {
    name: 'resume',
    aliases: ['rs'],
    utilisation: '{prefix}resume',
    voiceChannel: true,

    execute(client, message) {
        const queue = client.player.getQueue(message.guild.id);

        if (!queue) return message.channel.send(`${message.author}, There is no music currently playing!. ❌`);

        const success = queue.setPaused(false);

        return message.channel.send(success ? `The current song, **${queue.current.title}**, isn't paused anymore and continues to play. ✅` : `${message.author}, Something went wrong. ❌`);
    },
};