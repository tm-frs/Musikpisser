const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    description: "Shows you how long the current track is and how much time is remaining.",
    name: 'time',
    options: [],
    voiceChannel: true,

    run: async (client, interaction) => {

        const queue = client.player.getQueue(interaction.guild.id);

        if (!queue || !queue.playing) return interaction.reply({ content: `No music currently playing! ❌`, ephemeral: true }).catch(e => { })

        const progress = queue.createProgressBar();
        const timestamp = queue.getPlayerTimestamp();

        if (timestamp.progress == 'Infinity') return interaction.reply({ content: `This song is live streaming, no duration data to display. 🎧`, ephemeral: true }).catch(e => { })

        const saveButton = new MessageButton();

        saveButton.setLabel('Update');
        saveButton.setCustomId('time');
        saveButton.setStyle('SUCCESS');

        const row = new MessageActionRow().addComponents(saveButton);

        const embed = new MessageEmbed()
        .setColor('BLUE')
        .setTitle(queue.current.title)
        .setThumbnail(client.user.displayAvatarURL())
        .setTimestamp()
        .setDescription(`${progress} \nThe track is finished by **${timestamp.progress}%**.`)
        .setFooter({ text: 'Music Bot - by CraftingShadowDE️', iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });
        interaction.reply({ embeds: [embed], components: [row]}).catch(e => { })
    },
};