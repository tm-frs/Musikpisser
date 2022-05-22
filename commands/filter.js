module.exports = {
    description: "Adds audio filter to ongoing music.",
    name: 'filter',
    options: [ {
        name: 'filterinput',
        description: "Choose the filter you want to apply.",
        type: 'STRING',
		choices: [
		{value: 'bassboost', name: "Bassboost"},
		{value: '8D', name: "8D"},
		{value: 'nightcore', name: "Nightcore"}
		],
        required: true
    }],
    voiceChannel: true,

    run: async (client, interaction) => {
        const queue = client.player.getQueue(interaction.guild.id);

   if (!queue || !queue.playing) return interaction.reply({ content: `No music currently playing! ❌`, ephemeral: true }).catch(e => { });
   const filterinput = interaction.options.getString('filterinput')
        const actualFilter = queue.getFiltersEnabled()[0];

        if (!filterinput) return interaction.reply({ content: `Please enter a valid filter name. ❌\n\`bassboost, 8D, nightcore\``, ephemeral: true }).catch(e => { });

        const filters = [];
        queue.getFiltersEnabled().map(x => filters.push(x));
        queue.getFiltersDisabled().map(x => filters.push(x));

        const filter = filters.find((x) => x.toLowerCase() === filterinput.toLowerCase());

        if (!filter) return interaction.reply({ content: `I couldn't find a filter with your name. ❌\n\`bassboost, 8D, nightcore\``, ephemeral: true }).catch(e => { });

        const filtersUpdated = {};

        filtersUpdated[filter] = queue.getFiltersEnabled().includes(filter) ? false : true;

        await queue.setFilters(filtersUpdated);

        interaction.reply({ content: `Applied: **${filter}**, Filter Status: **${queue.getFiltersEnabled().includes(filter) ? 'Active' : 'Inactive'}** ✅\n **Remember, if the music is long, the filter application time may be long.**` }).catch(e => { });
    },
};