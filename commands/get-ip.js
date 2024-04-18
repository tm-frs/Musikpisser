const adminperms = require(`../config.js`).opt.adminperms; // gets the name of the user that is allowed to do this from config file
const netTools = require(`../exports/netTools.js`);
const { Colors } = require(`discord.js`);
const { EmbedBuilder } = require(`discord.js`);

module.exports = {
	description: `Get the bot's IP (permitted users only).`,
	name: `get-ip`,
	options: [],
	showHelp: false, // makes the command not show in help command

	run: async (client, interaction) => {
		await interaction.deferReply({ ephemeral: true });

		const messagecreator = (interaction.member.user.username + `#` + interaction.member.user.discriminator); // saves the name of the user executing this as a variable
		console.log(`Get-IP command executed by: ` + messagecreator); // will let you see in the logs who used the command

		if (adminperms.includes(messagecreator)) { // checks if user is allowed to get the bot's IP
			const publicIP = await netTools.getPublicIp();
			const privateIP = await netTools.getPrivateIp();
			const port = await netTools.getPort();

			const embed = new EmbedBuilder()
				.setColor(Colors.Blue) // blue = 0x3498DB
				.setTitle(`Bot IP`)
				.setThumbnail(client.user.displayAvatarURL({ format: `png`, size: 4096 }))
				.setDescription(`The bot's current public and private IP:`)
				.addFields([{ name: `Private IP:`, value: `${privateIP}:${port}` }, { name: `Public IP:`, value: `${publicIP}` }])
				.setTimestamp()
				.setFooter({ text: `Musikpisser Music Bot`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

			await interaction.editReply({ embeds: [embed], content: `Here it is! ✅ Be careful with this!`, ephemeral: true }).catch((e) => { });
		} else {
			console.log(`Get-IP command not executed because ` + messagecreator + ` has no permission. \nThe following user(s) is/are allowed to get the bot's IP:\n` + adminperms); // writes in logs if command failed because there are no permissions and tells the user he is not allowed to get the bot's IP
			return interaction.editReply({ content: `You are not allowed to do this! ❌`, ephemeral: true }).catch((e) => { });
		}
	}
};
