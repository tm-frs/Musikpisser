const { QueueRepeatMode } = require('discord-player');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    description: "Turns the music loop mode on or off.",
    name: 'loop',
    options: [ {
		name: 'mode',
		type: 'STRING',
		description: 'Loop type',
		required: true,
		choices: [
		{name: "Info", value: 'info'}, //INFO
		{name: "📴 Off", value: 'off'}, //OFF
		{name: "🔂 Track", value: 'track'}, //TRACK
		{name: "🔁 Queue", value: 'queue'}, //QUEUE
		{name: "▶ Autoplay", value: 'autoplay'} //AUTOPLAY
		],
		required: true
	} ],

    run: async (client, interaction) => {
		const loopMode = interaction.options.getString('mode') 

		if (loopMode==='off') { //LOOP OFF ------------------------------------------------------------------------------------------------------------------------------------------------------------
        const queue = client.player.getQueue(interaction.guild.id);
if (!queue || !queue.playing) return interaction.reply({ content: `No music currently playing! ❌`, ephemeral: true }).catch(e => { })  
        const success = queue.setRepeatMode(QueueRepeatMode.OFF);
		const options = ['📴 (Loop mode: Off)','🔂 (Loop mode: Track)','🔁 (Loop mode: Queue)','▶ (Loop mode: Autoplay)']
        const mode = options[0];
		
        const embed = new MessageEmbed();

        embed.setColor('BLUE');
        embed.setThumbnail(client.user.displayAvatarURL({ format: 'png', size: 4096 }));
        embed.setTitle('Loop Mode')

        embed.setDescription(`**Loop mode:** ${mode}\n**Changed by:** ${interaction.member.user}\n \n**Explanations:**\n📴: No loop mode is active.\n🔂: The current track will be repeated.\n🔁: The entire queue will be repeated.\n▶: After the queue is finished, the bot will start playing some random music.`);

        embed.setTimestamp();
        embed.setFooter({ text: 'Music Bot - by CraftingShadowDE', iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });
		
        interaction.reply(success ? { embeds: [embed] } : { content: 'Could not update loop mode! ❌' }).catch(e => { })
		} else if (loopMode==='track') { //LOOP TRACK -------------------------------------------------------------------------------------------------------------------------------------------------
        const queue = client.player.getQueue(interaction.guild.id);
if (!queue || !queue.playing) return interaction.reply({ content: `No music currently playing! ❌`, ephemeral: true }).catch(e => { })  
        const success = queue.setRepeatMode(QueueRepeatMode.TRACK);
		const options = ['📴 (Loop mode: Off)','🔂 (Loop mode: Track)','🔁 (Loop mode: Queue)','▶ (Loop mode: Autoplay)']
        const mode = options[1];
		
        const embed = new MessageEmbed();

        embed.setColor('BLUE');
        embed.setThumbnail(client.user.displayAvatarURL({ format: 'png', size: 4096 }));
        embed.setTitle('Loop Mode')

        embed.setDescription(`**Loop mode:** ${mode}\n**Changed by:** ${interaction.member.user}\n \n**Explanations:**\n📴: No loop mode is active.\n🔂: The current track will be repeated.\n🔁: The entire queue will be repeated.\n▶: After the queue is finished, the bot will start playing some random music.`);

        embed.setTimestamp();
        embed.setFooter({ text: 'Music Bot - by CraftingShadowDE', iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });
		
        interaction.reply(success ? { embeds: [embed] } : { content: 'Could not update loop mode! ❌' }).catch(e => { })
		} else if (loopMode==='queue') { //LOOP QUEUE -------------------------------------------------------------------------------------------------------------------------------------------------
        const queue = client.player.getQueue(interaction.guild.id);
if (!queue || !queue.playing) return interaction.reply({ content: `No music currently playing! ❌`, ephemeral: true }).catch(e => { })  
        const success = queue.setRepeatMode(QueueRepeatMode.QUEUE);
		const options = ['📴 (Loop mode: Off)','🔂 (Loop mode: Track)','🔁 (Loop mode: Queue)','▶ (Loop mode: Autoplay)']
        const mode = options[2];
		
        const embed = new MessageEmbed();

        embed.setColor('BLUE');
        embed.setThumbnail(client.user.displayAvatarURL({ format: 'png', size: 4096 }));
        embed.setTitle('Loop Mode')

        embed.setDescription(`**Loop mode:** ${mode}\n**Changed by:** ${interaction.member.user}\n \n**Explanations:**\n📴: No loop mode is active.\n🔂: The current track will be repeated.\n🔁: The entire queue will be repeated.\n▶: After the queue is finished, the bot will start playing some random music.`);

        embed.setTimestamp();
        embed.setFooter({ text: 'Music Bot - by CraftingShadowDE', iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });
		
        interaction.reply(success ? { embeds: [embed] } : { content: 'Could not update loop mode! ❌' }).catch(e => { })
		} else if (loopMode==='autoplay') { //LOOP AUTOPLAY -------------------------------------------------------------------------------------------------------------------------------------------
      const queue = client.player.getQueue(interaction.guild.id);
if (!queue || !queue.playing) return interaction.reply({ content: `No music currently playing! ❌`, ephemeral: true }).catch(e => { })  
        const success = queue.setRepeatMode(QueueRepeatMode.AUTOPLAY);
		const options = ['📴 (Loop mode: Off)','🔂 (Loop mode: Track)','🔁 (Loop mode: Queue)','▶ (Loop mode: Autoplay)']
        const mode = options[3];
		
        const embed = new MessageEmbed();

        embed.setColor('BLUE');
        embed.setThumbnail(client.user.displayAvatarURL({ format: 'png', size: 4096 }));
        embed.setTitle('Loop Mode')

        embed.setDescription(`**Loop mode:** ${mode}\n**Changed by:** ${interaction.member.user}\n \n**Explanations:**\n📴: No loop mode is active.\n🔂: The current track will be repeated.\n🔁: The entire queue will be repeated.\n▶: After the queue is finished, the bot will start playing some random music.`);

        embed.setTimestamp();
        embed.setFooter({ text: 'Music Bot - by CraftingShadowDE', iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });
		
        interaction.reply(success ? { embeds: [embed] } : { content: 'Could not update loop mode! ❌' }).catch(e => { })
		} else if (loopMode==='info') { //LOOP INFO ---------------------------------------------------------------------------------------------------------------------------------------------------
        const queue = client.player.getQueue(interaction.guild.id);
const noqueue = (!queue || !queue.playing)
		  const options = ['📴 (Loop mode: Off)','🔂 (Loop mode: Track)','🔁 (Loop mode: Queue)','▶ (Loop mode: Autoplay)']
        const mode = noqueue ? '❌ _(No music currently playing!)_' : options[queue.repeatMode];
		
        const embed = new MessageEmbed();

        embed.setColor('BLUE');
        embed.setThumbnail(client.user.displayAvatarURL({ format: 'png', size: 4096 }));
        embed.setTitle('Loop Mode')

        embed.setDescription(`**Loop mode:** ${mode}\n**Requested by:** ${interaction.member.user}\n \n**Explanations:**\n📴: No loop mode is active.\n🔂: The current track will be repeated.\n🔁: The entire queue will be repeated.\n▶: After the queue is finished, the bot will start playing some random music.`);

        embed.setTimestamp();
        embed.setFooter({ text: 'Music Bot - by CraftingShadowDE', iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });
		
        interaction.reply({ embeds: [embed] }).catch(e => { })
		} //ENDE --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
	},
};