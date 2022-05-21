const { QueueRepeatMode } = require('discord-player');

module.exports = {
	description: "Shuffles the queue. (The current song and the next song won't be shuffled)",
    name: 'shuffle',
    options: [],
    voiceChannel: true,

    run: async (client, interaction) => {
        const queue = client.player.getQueue(interaction.guild.id);

 
if (!queue || !queue.playing) return interaction.reply({ content: `No music currently playing! ❌`, ephemeral: true }).catch(e => { });

        if (queue || queue.playing) {

            const success = queue.shuffle();

            return interaction.reply({ content: success ? `Queue has been shuffled! ✅` : `Something went wrong. ❌` }).catch(e => { });
        }
    },
};