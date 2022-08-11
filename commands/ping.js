const Discord = require('discord.js');

module.exports = {
    description: "Shows you the bot's ping.",
    name: 'ping',
    options: [],

    run: async (client, interaction) => {
        const start = Date.now();
        interaction.reply('Please wait...').then(async() => {
        let last = Date.now();
            const embed = new Discord.EmbedBuilder()
                .setColor(Colors.Blue) // blue = 0x3498DB
                .setTitle(client.user.username + " - Current Ping")
                .setThumbnail(client.user.displayAvatarURL({ format: 'png', size: 4096 }))
                .addFields([{ name: `Message Latency (time till a message arrives):`, value: `\`${last - start}ms\` 🛰️` },
                    { name: `API Latency (time the API needs to do things):`, value: `\`${Math.round(client.ws.ping)}ms\` 🛰️` }])
                .setTimestamp()
                .setFooter({ text: 'Music Bot - by CraftingShadowDE', iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });
            interaction.editReply({ content: null, embeds: [embed] }).catch(e => { });
        })
    },
};