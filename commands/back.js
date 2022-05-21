module.exports = {
    description: "Switches back to the previous song.",
    name: 'back',
    options: [],
    voiceChannel: true,

    run: async (client, interaction) => {
        const queue = client.player.getQueue(interaction.guild.id);

        if (!queue || !queue.playing) return interaction.reply({ content: `No music currently playing! ❌`, ephemeral: true }).catch(e => { });

        if (!queue.previousTracks[1]) return interaction.reply({ content: `There was no music playing before ❌`, ephemeral: true }).catch(e => { });

        await queue.back();

        interaction.reply({ content: `Previous music started playing... ✅`, ephemeral: true }).catch(e => { });
    },
};