const { Colors } = require(`discord.js`);
const { ApplicationCommandOptionType } = require(`discord.js`);
const { QueueRepeatMode } = require(`discord-player`);
const { EmbedBuilder } = require(`discord.js`);

module.exports = {
	description: `Show or change current loop mode`,
	name: `loop`,
	options: [{
		name: `mode`,
		type: ApplicationCommandOptionType.String,
		description: `Loop type`,
		choices: [
			{name: `Get information`, value: `info`}, // INFO
			{name: `📴 Off`, value: `off`}, // OFF
			{name: `🔂 Track`, value: `track`}, // TRACK
			{name: `🔁 Queue`, value: `queue`}, // QUEUE
			{name: `▶ Autoplay`, value: `autoplay`} // AUTOPLAY
		],
		required: true
	}],

	run: async (client, interaction) => {
		const loopMode = interaction.options.getString(`mode`);

		const botvoicechannel = interaction.guild.members.cache.find((user) => user.id === client.user.id).voice.channel;
		const othervoicechannel = (botvoicechannel && interaction.member.voice.channel.id !== botvoicechannel.id);

		if (loopMode === `off`) { // LOOP OFF ---------------------------------------------------------------------------------------------------------------------------------------------------
			if (!interaction.member.voice.channel) return interaction.reply({ content: `You are not connected to an audio channel. ❌`, ephemeral: true });
			if (othervoicechannel) return interaction.reply({ content: `You are not on the same audio channel as me. ❌`, ephemeral: true });

			const queue = client.player.nodes.get(interaction.guild.id);
			if (!queue || !queue.node.isPlaying()) return interaction.reply({ content: `No music currently playing! ❌`, ephemeral: true }).catch((e) => { });
			await queue.setRepeatMode(QueueRepeatMode.OFF);
			const success = (queue.repeatMode === QueueRepeatMode.OFF);
			const options = [`📴 (Loop mode: Off)`, `🔂 (Loop mode: Track)`, `🔁 (Loop mode: Queue)`, `▶ (Loop mode: Autoplay)`];
			const mode = options[0];

			const embed = new EmbedBuilder()
				.setColor(Colors.Blue) // blue = 0x3498DB
				.setThumbnail(client.user.displayAvatarURL({ format: `png`, size: 4096 }))
				.setTitle(`Loop Mode`)
				.setDescription(`**Loop mode:** ${mode}\n**Changed by:** ${interaction.member.user}\n \n**Explanations:**\n📴: No loop mode is active.\n🔂: The current track will be repeated.\n🔁: The entire queue will be repeated.\n▶: After the queue is finished, the bot will start playing some random music.`)
				.setTimestamp()
				.setFooter({ text: `Musikpisser Music Bot`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

			interaction.reply(success ? { embeds: [embed] } : { content: `Could not update loop mode! ❌` }).catch((e) => { });
		} else if (loopMode === `track`) { // LOOP TRACK ---------------------------------------------------------------------------------------------------------------------------------------------------
			if (!interaction.member.voice.channel) return interaction.reply({ content: `You are not connected to an audio channel. ❌`, ephemeral: true });
			if (othervoicechannel) return interaction.reply({ content: `You are not on the same audio channel as me. ❌`, ephemeral: true });

			const queue = client.player.nodes.get(interaction.guild.id);
			if (!queue || !queue.node.isPlaying()) return interaction.reply({ content: `No music currently playing! ❌`, ephemeral: true }).catch((e) => { });
			await queue.setRepeatMode(QueueRepeatMode.TRACK);
			const success = (queue.repeatMode === QueueRepeatMode.TRACK);
			const options = [`📴 (Loop mode: Off)`, `🔂 (Loop mode: Track)`, `🔁 (Loop mode: Queue)`, `▶ (Loop mode: Autoplay)`];
			const mode = options[1];

			const embed = new EmbedBuilder()
				.setColor(Colors.Blue) // blue = 0x3498DB
				.setThumbnail(client.user.displayAvatarURL({ format: `png`, size: 4096 }))
				.setTitle(`Loop Mode`)
				.setDescription(`**Loop mode:** ${mode}\n**Changed by:** ${interaction.member.user}\n \n**Explanations:**\n📴: No loop mode is active.\n🔂: The current track will be repeated.\n🔁: The entire queue will be repeated.\n▶: After the queue is finished, the bot will start playing some random music.`)
				.setTimestamp()
				.setFooter({ text: `Musikpisser Music Bot`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

			interaction.reply(success ? { embeds: [embed] } : { content: `Could not update loop mode! ❌` }).catch((e) => { });
		} else if (loopMode === `queue`) { // LOOP QUEUE ---------------------------------------------------------------------------------------------------------------------------------------------------
			if (!interaction.member.voice.channel) return interaction.reply({ content: `You are not connected to an audio channel. ❌`, ephemeral: true });
			if (othervoicechannel) return interaction.reply({ content: `You are not on the same audio channel as me. ❌`, ephemeral: true });

			const queue = client.player.nodes.get(interaction.guild.id);
			if (!queue || !queue.node.isPlaying()) return interaction.reply({ content: `No music currently playing! ❌`, ephemeral: true }).catch((e) => { });
			await queue.setRepeatMode(QueueRepeatMode.QUEUE);
			const success = (queue.repeatMode === QueueRepeatMode.QUEUE);
			const options = [`📴 (Loop mode: Off)`, `🔂 (Loop mode: Track)`, `🔁 (Loop mode: Queue)`, `▶ (Loop mode: Autoplay)`];
			const mode = options[2];

			const embed = new EmbedBuilder()
				.setColor(Colors.Blue) // blue = 0x3498DB
				.setThumbnail(client.user.displayAvatarURL({ format: `png`, size: 4096 }))
				.setTitle(`Loop Mode`)
				.setDescription(`**Loop mode:** ${mode}\n**Changed by:** ${interaction.member.user}\n \n**Explanations:**\n📴: No loop mode is active.\n🔂: The current track will be repeated.\n🔁: The entire queue will be repeated.\n▶: After the queue is finished, the bot will start playing some random music.`)
				.setTimestamp()
				.setFooter({ text: `Musikpisser Music Bot`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

			interaction.reply(success ? { embeds: [embed] } : { content: `Could not update loop mode! ❌` }).catch((e) => { });
		} else if (loopMode === `autoplay`) { // LOOP AUTOPLAY ---------------------------------------------------------------------------------------------------------------------------------------------------
			if (!interaction.member.voice.channel) return interaction.reply({ content: `You are not connected to an audio channel. ❌`, ephemeral: true });
			if (othervoicechannel) return interaction.reply({ content: `You are not on the same audio channel as me. ❌`, ephemeral: true });

			const queue = client.player.nodes.get(interaction.guild.id);
			if (!queue || !queue.node.isPlaying()) return interaction.reply({ content: `No music currently playing! ❌`, ephemeral: true }).catch((e) => { });
			await queue.setRepeatMode(QueueRepeatMode.AUTOPLAY);
			const success = (queue.repeatMode === QueueRepeatMode.AUTOPLAY);
			const options = [`📴 (Loop mode: Off)`, `🔂 (Loop mode: Track)`, `🔁 (Loop mode: Queue)`, `▶ (Loop mode: Autoplay)`];
			const mode = options[3];

			const embed = new EmbedBuilder()
				.setColor(Colors.Blue) // blue = 0x3498DB
				.setThumbnail(client.user.displayAvatarURL({ format: `png`, size: 4096 }))
				.setTitle(`Loop Mode`)
				.setDescription(`**Loop mode:** ${mode}\n**Changed by:** ${interaction.member.user}\n \n**Explanations:**\n📴: No loop mode is active.\n🔂: The current track will be repeated.\n🔁: The entire queue will be repeated.\n▶: After the queue is finished, the bot will start playing some random music.`)
				.setTimestamp()
				.setFooter({ text: `Musikpisser Music Bot`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

			interaction.reply(success ? { embeds: [embed] } : { content: `Could not update loop mode! ❌` }).catch((e) => { });
		} else if (loopMode === `info`) { // LOOP INFO ---------------------------------------------------------------------------------------------------------------------------------------------------
			const queue = client.player.nodes.get(interaction.guild.id);
			const noqueue = (!queue || !queue.node.isPlaying());
			const options = [`📴 (Loop mode: Off)`, `🔂 (Loop mode: Track)`, `🔁 (Loop mode: Queue)`, `▶ (Loop mode: Autoplay)`];
			const mode = noqueue ? `❌ _(No music currently playing!)_` : options[queue.repeatMode];

			const embed = new EmbedBuilder()
				.setColor(Colors.Blue) // blue = 0x3498DB
				.setThumbnail(client.user.displayAvatarURL({ format: `png`, size: 4096 }))
				.setTitle(`Loop Mode`)
				.setDescription(`**Loop mode:** ${mode}\n**Requested by:** ${interaction.member.user}\n \n**Explanations:**\n📴: No loop mode is active.\n🔂: The current track will be repeated.\n🔁: The entire queue will be repeated.\n▶: After the queue is finished, the bot will start playing some random music.`)
				.setTimestamp()
				.setFooter({ text: `Musikpisser Music Bot`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

			interaction.reply({ embeds: [embed] }).catch((e) => { });
		} // END ---------------------------------------------------------------------------------------------------------------------------------------------------
	}
};
