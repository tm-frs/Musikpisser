const { Colors } = require(`discord.js`);
const { EmbedBuilder } = require(`discord.js`);

module.exports = {
	run: async (client, interaction, queue, othervoicechannel) => { // eslint-disable-line no-unused-vars
		const name = ((interaction.message.embeds[0].title).substr(17, ((interaction.message.embeds[0].title).length) - 18));

		if (interaction.user.id !== interaction.message.interaction.user.id) {
			interaction.reply({ content: `You aren't allowed to do this because you are not the person that executed the search-command! ❌`, ephemeral: true });
		}

		const embed = new EmbedBuilder();

		embed.setColor(Colors.Blue); // blue = 0x3498DB
		embed.setTitle(`Searched Music: "${name}"`);

		const description = ((interaction.message.embeds[0].description).substring(0, ((interaction.message.embeds[0].description).length) - 183)) + `Selection cancelled because the cancel-button was pressed! ❌`;
		embed.setDescription(description);

		embed.setTimestamp();
		embed.setFooter({ text: `Musikpisser Music Bot`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

		interaction.update({ embeds: [embed], components: [] }).catch((e) => { });
	}
};
