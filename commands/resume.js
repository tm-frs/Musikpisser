module.exports = {
    description: "Resumes paused music.",
    name: 'resume',
    options: [],
    voiceChannel: true,

    run: async (client, interaction) => {
        const queue = client.player.getQueue(interaction.guild.id);

        if (!queue) return interaction.reply({ content: `No music currently playing! ❌`, ephemeral: true }).catch(e => { });

        const success = queue.setPaused(false);

        return interaction.reply({ content: success ? `The current song, **${queue.current.title}**, isn't paused anymore and continues to play. ✅` : `Something went wrong. ❌` }).catch(e => { });
    },
};