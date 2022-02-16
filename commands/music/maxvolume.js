const maxVol = require("../../config.js").opt.maxVol;

module.exports = {
    name: 'maxvolume',
    aliases: ['maxvol','mvol','mv'],
    utilisation: `{prefix}maxvolume`,
    voiceChannel: true,

    execute(client, message, args) {
        const queue = client.player.getQueue(message.guild.id);

       if (!queue || !queue.playing) return message.channel.send(`${message.author}, There is no music currently playing!. ❌`);

		queue.setVolume(maxVol);

        return message.channel.send(`Volume changed to max volume (**${maxVol}**) 🔊`) ;
    },
};