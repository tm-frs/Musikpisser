module.exports = {
    description: "Skips the current track and starts the nest track in queue.",
    name: 'skip',
    options: [],
    voiceChannel: true,

    run: async (client, interaction) => {
        const queue = client.player.getQueue(interaction.guild.id);
 
        if (!queue || !queue.playing) return interaction.reply({ content: `No music currently playing! ❌`, ephemeral: true }).catch(e => { });

        const success = queue.skip();

        return interaction.reply({ content: success ? `**${queue.current.title}**, the song currently playing, has been skipped ✅` : `Something went wrong ❌` }).catch(e => { });
    },
};