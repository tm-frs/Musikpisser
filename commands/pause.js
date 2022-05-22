module.exports = {
    description: "Pauses the currently playing music.",
    name: 'pause',
    options: [],
    voiceChannel: true,

    run: async (client, interaction) => {
        const queue = client.player.getQueue(interaction.guild.id);

       if (!queue || !queue.playing) return interaction.reply({ content: `No music currently playing! ❌`, ephemeral: true }).catch(e => { });

        const success = queue.setPaused(true);

        return interaction.reply({ content: success ? `The song currently playing, **${queue.current.title}**, has been paused ✅` : `Something went wrong. ❌` }).catch(e => { });
    },
};