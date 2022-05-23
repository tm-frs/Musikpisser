const maxVol = require("../config.js").opt.maxVol;

module.exports = {
    description: "Allows you to change the volume of the music.",
    name: 'volume',
    options: [{
        name: 'volume',
        description: 'Type a number to adjust the volume (normal volume is 100).',
        type: 'INTEGER',
        required: true
    }],
    voiceChannel: true,

    run: async (client, interaction) => {
        const queue = client.player.getQueue(interaction.guild.id);
       if (!queue || !queue.playing) return interaction.reply({ content: `No music currently playing! ❌`, ephemeral: true }).catch(e => { })

        const vol = parseInt(interaction.options.getInteger('volume'));

        if (!vol && vol !== 0) return interaction.reply({ content: `Current volume: **${queue.volume}%** 🔊\n**To change the volume, type a number between \`0\` and \`${maxVol}\`.**`, ephemeral: true }).catch(e => { })

        if (queue.volume === vol) return interaction.reply({ content: `The volume you want to change to is already the current volume ❌`, ephemeral: true }).catch(e => { })

        if (vol < 0 || vol > maxVol) return interaction.reply({ content: `**Type a number from \`0\` to \`${maxVol}\` to change the volume .** ❌`, ephemeral: true }).catch(e => { })

        const success = queue.setVolume(vol);

        return interaction.reply({ content: success ? `Volume changed: **${vol}%**/**${maxVol}%** 🔊` : `Something went wrong. ❌` }).catch(e => { })
    },
};