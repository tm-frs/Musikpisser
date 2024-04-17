const { Colors } = require(`discord.js`);
const { ButtonStyle } = require(`discord.js`);
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require(`discord.js`);

module.exports = {
	description: `Shows you the bot's ping.`,
	name: `ping`,
	options: [],

	run: async (client, interaction) => {
		const start = Date.now();
		interaction.reply(`Please wait...`).then(async () => {
			let last = Date.now();

			const updateButton = new ButtonBuilder();
			updateButton.setLabel(`Update`);
			updateButton.setCustomId(`ping`);
			updateButton.setStyle(ButtonStyle.Success);
			const row = new ActionRowBuilder().addComponents(updateButton);

			const embed = new EmbedBuilder()
				.setColor(Colors.Blue) // blue = 0x3498DB
				.setTitle(client.user.username + ` - Current Ping`)
				.setThumbnail(client.user.displayAvatarURL({ format: `png`, size: 4096 }))
				.addFields([{ name: `Message Latency (time till a message arrives):`, value: `\`${last - start}ms\` 🛰️` },
					{ name: `API Latency (time the API needs to do things):`, value: `\`${Math.round(client.ws.ping)}ms\` 🛰️` }])
				.setTimestamp()
				.setFooter({ text: `Music Bot - by CraftingShadowDE`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });
			interaction.editReply({ content: null, embeds: [embed], components: [row] }).catch((e) => { });
		});
	}
};
