const { Colors } = require(`discord.js`);
const { EmbedBuilder } = require(`discord.js`);

module.exports = {
	run: async (client, interaction, queue, othervoicechannel) => { // eslint-disable-line no-unused-vars
		const description = `${interaction.message.embeds[0].description}\n**Saved at this server:** \`${interaction.guild.name}\``;

		const embed = new EmbedBuilder()
			.setColor(Colors.Green) // green = 0x57F287
			.setTitle(client.user.username + ` - Saved Track`)
			.setThumbnail(client.user.displayAvatarURL({ format: `png`, size: 4096 }))
			.setDescription(description)
			.setTimestamp()
			.setFooter({ text: `Musikpisser Music Bot`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

		await interaction.member.send({ embeds: [embed] }).catch((error) => { // eslint-disable-line no-unused-vars
			return interaction.reply({ content: `I can't send you a private message. ❌`, ephemeral: true }).catch((e) => { });
		});

		return interaction.reply({ content: `I sent you the name of the music in a private message ✅`, ephemeral: true }).catch((e) => { });
	}
};
