const { MessageEmbed, MessageActionRow, MessageSelectMenu, MessageButton } = require('discord.js');
const { QueryType } = require('discord-player');

module.exports = {
    description: "Lets you search for a track and choose from multiple options.",
    name: 'search',
    options: [{
        name: 'name',
        description: 'The name of the track you want to search for.',
        type: 'STRING',
        required: true
    }],
    voiceChannel: true,

    run: async (client, interaction) => {
      const name = interaction.options.getString('name')
if (!name) return interaction.reply({ content: `Please enter a valid song name. ❌`, ephemeral: true }).catch(e => { });

        const res = await client.player.search(name, {
            requestedBy: interaction.member,
            searchEngine: QueryType.AUTO
        });

        if (!res || !res.tracks.length) return interaction.reply({ content: `No search results were found. ❌`, ephemeral: true }).catch(e => { });

        const embed = new MessageEmbed();

        embed.setColor('BLUE');
        embed.setTitle(`Searched Music: "${name}"`);

        const maxTracks = res.tracks.slice(0, 10);

        embed.setDescription(`${maxTracks.map((track, i) => `**${i + 1}**. \`${track.title}\` | \n by \`${track.author}\``).join('\n')}\n\nChoose a song from **1** to **${maxTracks.length}** by selecting it in the menu or press the **Cancel**-button to cancel the selection.⬇️ _If you choose long after this was sent, this might not work._`);

        embed.setTimestamp();
        embed.setFooter({ text: 'Music Bot - by CraftingShadowDE', iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

        const ui = maxTracks.length===1 ? [ {type: 1, components: [{custom_id: `trackMenu`, placeholder: `Click here to select a track!`, options: [{label: `Track 1`, value: `t1`, default: false}], min_values: 1, max_values: 1, type: 3}]}, {type: 1, components: [{style: 4, label: `Cancel`, custom_id: `cancelButton`, disabled: false, type: 2}]} ] : maxTracks.length===2 ? [ {type: 1, components: [{custom_id: `trackMenu`, placeholder: `Click here to select a track!`, options: [{label: `Track 1`, value: `t1`, default: false},{label: `Track 2`, value: `t2`, default: false}], min_values: 1, max_values: 1, type: 3}]}, {type: 1, components: [{style: 4, label: `Cancel`, custom_id: `cancelButton`, disabled: false, type: 2}]} ] : maxTracks.length===3 ? [ {type: 1, components: [{custom_id: `trackMenu`, placeholder: `Click here to select a track!`, options: [{label: `Track 1`, value: `t1`, default: false},{label: `Track 2`, value: `t2`, default: false},{label: `Track 3`, value: `t3`, default: false},], min_values: 1, max_values: 1, type: 3}]}, {type: 1, components: [{style: 4, label: `Cancel`, custom_id: `cancelButton`, disabled: false, type: 2}]} ] : maxTracks.length===4 ? [ {type: 1, components: [{custom_id: `trackMenu`, placeholder: `Click here to select a track!`, options: [{label: `Track 1`, value: `t1`, default: false},{label: `Track 2`, value: `t2`, default: false},{label: `Track 3`, value: `t3`, default: false},{label: `Track 4`, value: `t4`, default: false}], min_values: 1, max_values: 1, type: 3}]}, {type: 1, components: [{style: 4, label: `Cancel`, custom_id: `cancelButton`, disabled: false, type: 2}]} ] : maxTracks.length===5 ? [ {type: 1, components: [{custom_id: `trackMenu`, placeholder: `Click here to select a track!`, options: [{label: `Track 1`, value: `t1`, default: false},{label: `Track 2`, value: `t2`, default: false},{label: `Track 3`, value: `t3`, default: false},{label: `Track 4`, value: `t4`, default: false},{label: `Track 5`, value: `t5`, default: false}], min_values: 1, max_values: 1, type: 3}]}, {type: 1, components: [{style: 4, label: `Cancel`, custom_id: `cancelButton`, disabled: false, type: 2}]} ] : maxTracks.length===6 ? [ {type: 1, components: [{custom_id: `trackMenu`, placeholder: `Click here to select a track!`, options: [{label: `Track 1`, value: `t1`, default: false},{label: `Track 2`, value: `t2`, default: false},{label: `Track 3`, value: `t3`, default: false},{label: `Track 4`, value: `t4`, default: false},{label: `Track 5`, value: `t5`, default: false},{label: `Track 6`, value: `t6`, default: false}], min_values: 1, max_values: 1, type: 3}]}, {type: 1, components: [{style: 4, label: `Cancel`, custom_id: `cancelButton`, disabled: false, type: 2}]} ] : maxTracks.length===7 ? [ {type: 1, components: [{custom_id: `trackMenu`, placeholder: `Click here to select a track!`, options: [{label: `Track 1`, value: `t1`, default: false},{label: `Track 2`, value: `t2`, default: false},{label: `Track 3`, value: `t3`, default: false},{label: `Track 4`, value: `t4`, default: false},{label: `Track 5`, value: `t5`, default: false},{label: `Track 6`, value: `t6`, default: false},{label: `Track 7`, value: `t7`, default: false}], min_values: 1, max_values: 1, type: 3}]}, {type: 1, components: [{style: 4, label: `Cancel`, custom_id: `cancelButton`, disabled: false, type: 2}]} ] : maxTracks.length===8 ? [ {type: 1, components: [{custom_id: `trackMenu`, placeholder: `Click here to select a track!`, options: [{label: `Track 1`, value: `t1`, default: false},{label: `Track 2`, value: `t2`, default: false},{label: `Track 3`, value: `t3`, default: false},{label: `Track 4`, value: `t4`, default: false},{label: `Track 5`, value: `t5`, default: false},{label: `Track 6`, value: `t6`, default: false},{label: `Track 7`, value: `t7`, default: false},{label: `Track 8`, value: `t8`, default: false}], min_values: 1, max_values: 1, type: 3}]}, {type: 1, components: [{style: 4, label: `Cancel`, custom_id: `cancelButton`, disabled: false, type: 2}]} ] : maxTracks.length===9 ? [ {type: 1, components: [{custom_id: `trackMenu`, placeholder: `Click here to select a track!`, options: [{label: `Track 1`, value: `t1`, default: false},{label: `Track 2`, value: `t2`, default: false},{label: `Track 3`, value: `t3`, default: false},{label: `Track 4`, value: `t4`, default: false},{label: `Track 5`, value: `t5`, default: false},{label: `Track 6`, value: `t6`, default: false},{label: `Track 7`, value: `t7`, default: false},{label: `Track 8`, value: `t8`, default: false},{label: `Track 9`, value: `t9`, default: false}], min_values: 1, max_values: 1, type: 3}]}, {type: 1, components: [{style: 4, label: `Cancel`, custom_id: `cancelButton`, disabled: false, type: 2}]} ] : maxTracks.length===10 ? [ {type: 1, components: [{custom_id: `trackMenu`, placeholder: `Click here to select a track!`, options: [{label: `Track 1`, value: `t1`, default: false},{label: `Track 2`, value: `t2`, default: false},{label: `Track 3`, value: `t3`, default: false},{label: `Track 4`, value: `t4`, default: false},{label: `Track 5`, value: `t5`, default: false},{label: `Track 6`, value: `t6`, default: false},{label: `Track 7`, value: `t7`, default: false},{label: `Track 8`, value: `t8`, default: false},{label: `Track 9`, value: `t9`, default: false},{label: `Track 10`, value: `t10`, default: false}], min_values: 1, max_values: 1, type: 3}]}, {type: 1, components: [{style: 4, label: `Cancel`, custom_id: `cancelButton`, disabled: false, type: 2}]} ] : []
        
        interaction.reply({ embeds: [embed], components: ui }).catch(e => { })
    },
};