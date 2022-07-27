const { ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    description: "Adds audio filter to ongoing music.",
    name: 'filter',
    options: [{
    name: 'filter-list_1',
    description: "The first part of the list of all available filters. Only choose one from one of the lists!",
    type: ApplicationCommandOptionType.String,
	choices: [
    {name: "Bassboost low (+15dB)", value: 'bassboost_low'},
	{name: "Bassboost normal (+20dB)", value: 'bassboost'},
    {name: "Bassboost high (+30dB)", value: 'bassboost_high'},
	{name: "8D", value: '8D'},
    {name: "Vaporwave", value: 'vaporwave'},
	{name: "Nightcore", value: 'nightcore'},
    {name: "Phaser", value: 'phaser'},
    {name: "Tremolo", value: 'tremolo'},
    {name: "Vibrato", value: 'vibrato'},
    {name: "Reverse", value: 'reverse'},
    {name: "Treble", value: 'treble'},
    {name: "Normalizer 1 (dynamic audio normalizer based)", value: 'normalizer'},
    {name: "Normalizer 2 (audio compressor based)", value: 'normalizer2'},
    {name: "Surrounding", value: 'surrounding'},
    {name: "Pulsator", value: 'pulsator'},
    {name: "Subboost", value: 'subboost'},
    {name: "Karaoke", value: 'karaoke'},
    {name: "Flanger", value: 'flanger'},
    {name: "Gate", value: 'gate'},
    {name: "Haas", value: 'haas'},
    {name: "Mcompand", value: 'mcompand'},
    {name: "Mono", value: 'mono'},
    {name: "Mstlr", value: 'mstlr'},
    {name: "Mstrr", value: 'mstrr'},
    {name: "Compressor", value: 'compressor'} //25
	],
    required: false
    },{
    name: 'filter-list_2',
    description: "The second part of the list of all available filters. Only choose one from one of the lists!",
    type: ApplicationCommandOptionType.String,
	choices: [
    {name: "Expander", value: 'expander'},
    {name: "Softlimiter", value: 'softlimiter'},
    {name: "Chorus", value: 'chorus'},
    {name: "Chorus 2D", value: 'chorus2d'},
    {name: "Chorus 3D", value: 'chorus3d'},
    {name: "Fadein", value: 'fadein'},
    {name: "Dim", value: 'dim'},
    {name: "Earrape", value: 'earrape'} //8
	],
    required: false
    }],
    voiceChannel: true,

    run: async (client, interaction) => {
        const queue = client.player.getQueue(interaction.guild.id);

   if (!queue || !queue.playing) return interaction.reply({ content: `No music currently playing! ❌`, ephemeral: true }).catch(e => { });
   const filterinput1 = interaction.options.getString('filter-list_1')
   const filterinput2 = interaction.options.getString('filter-list_2')
   
   if (filterinput1 && filterinput2) return interaction.reply({ content: `Only choose a filter from **one** list! ❌`, ephemeral: true }).catch(e => { });
   if (!filterinput1 && !filterinput2) return interaction.reply({ content: `Choose a filter from one of the lists! ❌`, ephemeral: true }).catch(e => { });
   const list1 = (filterinput1 && !filterinput2)
   const list2 = (!filterinput1 && filterinput2)
      
        const filterinput = list1 ? filterinput1 : list2 ? filterinput2 : '';
        
        const actualFilter = queue.getFiltersEnabled()[0];

        if (!filterinput) return interaction.reply({ content: `Please enter a valid filter name. ❌`, ephemeral: true }).catch(e => { });

        const filters = [];
        queue.getFiltersEnabled().map(x => filters.push(x));
        queue.getFiltersDisabled().map(x => filters.push(x));

        const filter = filters.find((x) => x.toLowerCase() === filterinput.toLowerCase());

        if (!filter) return interaction.reply({ content: `I couldn't find a filter with your name. ❌`, ephemeral: true }).catch(e => { });

        const filtersUpdated = {};

        filtersUpdated[filter] = queue.getFiltersEnabled().includes(filter) ? false : true;

        await queue.setFilters(filtersUpdated);

        interaction.reply({ content: `Changed: **${filter}**, New filter status: **${queue.getFiltersEnabled().includes(filter) ? 'Active' : 'Inactive'}** ✅\n**Remember, if the track is long, the filter application time may be long too.**` }).catch(e => { });
    },
};