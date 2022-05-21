const maxVol = require("../config.js").opt.maxVol;

module.exports = {
    description: "Changes the volume of the music to max volume.",
    name: 'maxvolume',
    options: [],
    voiceChannel: true,

    run: async (client, interaction) => {
        const queue = client.player.getQueue(message.guild.id);

       if (!queue || !queue.playing) return interaction.reply({ content: `No music currently playing! ❌`, ephemeral: true }).catch(e => { });

		queue.setVolume(maxVol);

        return interaction.reply({ content: `Volume changed to max volume (**${maxVol}**) 🔊` }).catch(e => { }) ;
    },
};