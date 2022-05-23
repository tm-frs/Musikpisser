module.exports = {
    description: "Changes the volume of the music to normal volume (100%).",
    name: 'normalvolume',
    options: [],
    voiceChannel: true,

    run: async (client, interaction) => {
        const queue = client.player.getQueue(interaction.guild.id);

       if (!queue || !queue.playing) return interaction.reply({ content: `No music currently playing! ❌`, ephemeral: true }).catch(e => { });

		queue.setVolume(100);

        return interaction.reply({ content: `Volume changed to normal volume (**100%**) 🔊` }).catch(e => { }) ;
    },
};