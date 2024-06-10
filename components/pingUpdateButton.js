const { Colors } = require(`discord.js`);
const { ButtonStyle } = require(`discord.js`);
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require(`discord.js`);

module.exports = {
	run: async (client, interaction, queue, othervoicechannel) => { // eslint-disable-line no-unused-vars
		const start = Date.now();
		await interaction.message.edit({ content: `Please wait...`, embeds: [], components: [] }).catch((e) => { });
		let last = Date.now();

		const updateButton = new ButtonBuilder()
			.setLabel(`Update`)
			.setCustomId(`pingUpdateButton`)
			.setStyle(ButtonStyle.Success);

		const row = new ActionRowBuilder()
			.addComponents(updateButton);

		const embed = new EmbedBuilder()
			.setColor(Colors.Blue) // blue = 0x3498DB
			.setTitle(client.user.username + ` - Current Ping`)
			.setThumbnail(client.user.displayAvatarURL({ format: `png`, size: 4096 }))
			.addFields([{ name: `Message Latency (time till a message arrives):`, value: `\`${last - start}ms\` 🛰️` },
				{ name: `API Latency (time the API needs to do things):`, value: `\`${Math.round(client.ws.ping)}ms\` 🛰️` }])
			.setTimestamp()
			.setFooter({ text: `Musikpisser Music Bot`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

		interaction.message.edit({ content: null, embeds: [embed], components: [row] }).catch((e) => { });
		interaction.reply({ content: `**Success:** Ping data updated. ✅`, ephemeral: true }).catch((e) => { });
	}
};
