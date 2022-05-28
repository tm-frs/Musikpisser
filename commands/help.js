const { MessageEmbed } = require('discord.js');
const DJ = require("../config.js").opt.DJ;

module.exports = {
    description: "Information about the bot and its commands.",
    name: 'help',
    options: [],
    showHelp: false,

    run: async (client, interaction) => {
        const commands = client.commands.filter(x => x.showHelp !== false);

        const embed = new MessageEmbed()
        .setColor('BLUE')
        .setTitle('Bot information')
        .setThumbnail(client.user.displayAvatarURL({ format: 'png', size: 4096 }))
        .setDescription(`${client.user.username} Bot Commands:`)
        .addField(`Available - ${commands.size} Commands`, commands.map(x => `\`/${x.name}\``).join(' | '))
//		.addField(`**DJ mode active:** `, DJ.enabled)
//		.addField(`**Available for everyone:** `, DJ.notAffected)
        .setTimestamp()
        .setFooter({ text: 'Music Bot - by ️CraftingShadowDE', iconURL:interaction.user.displayAvatarURL({ dynamic: true }) })
        interaction.reply({ embeds: [embed] }).catch(e => { })
    },
};