const Discord = require('discord.js');

module.exports = {
    description: "Shows you the bot's ping.",
    name: 'ping',
    options: [],

    run: async (client, interaction) => {
        const start = Date.now();
        interaction.reply('Please wait...').then(async() => {
        let last = Date.now();
            const embed = new Discord.MessageEmbed()
                .setColor('BLUE')
                .setTitle(client.user.username + " - Current Ping")
                .setThumbnail(client.user.displayAvatarURL({ format: 'png', size: 4096 }))
                .addField(`Message Latency (time till a message arrives):`, `\`${last - start}ms\` 🛰️`)
                .addField(`API Latency (time the API needs to do things):`, `\`${Math.round(client.ws.ping)}ms\` 🛰️`)
                .setTimestamp()
                .setFooter({ text: 'Music Bot - by ️CraftingShadowDE', iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });
            interaction.editReply({ content: null, embeds: [embed] }).catch(e => { });
        })
    },
};