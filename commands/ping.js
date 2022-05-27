const Discord = require('discord.js');

module.exports = {
    description: "Shows you the bot's ping.",
    name: 'ping',
    options: [],

    run: async (client, interaction) => {
        const start = Date.now();
        interaction.reply('Pong!').then(async() => {
        let last = Date.now();
            const embed = new Discord.MessageEmbed()
                .setColor('BLUE')
                .setTitle(client.user.username + " - Pong!")
                .setThumbnail(client.user.displayAvatarURL({ format: 'png', size: 4096 }))
                .addField(`Message Ping`, `\`${Date.now() - start}ms\` 🛰️`)
                .addField(`Message Latency`, `\`${last - start}ms\` 🛰️`)
                .addField(`API Latency`, `\`${Math.round(client.ws.ping)}ms\` 🛰️`)
                .setTimestamp()
                .setFooter({ text: 'Music Bot - by ️CraftingShadowDE', iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });
            interaction.editReply({ embeds: [embed] }).catch(e => { });
        })
    },
};