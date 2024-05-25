const { Colors } = require(`discord.js`);
const { EmbedBuilder } = require(`discord.js`);

module.exports = {
	description: `List information about the bot and its commands`,
	name: `help`,
	options: [],
	showHelp: false,

	run: async (client, interaction) => {
		//const testGuild = (await client.guilds.fetch())/*stop here to show all servers*/.find(guild => guild.id === ""/*<- ID of the server to be searched*/);
		//console.log(testGuild)
		const commands = client.commands.filter((x) => x.showHelp !== false);
		const unixReadyAt = Math.floor(new Date(client.readyAt).getTime() / 1000);
		const discordReadyAt = `<t:${unixReadyAt}:R> (<t:${unixReadyAt}:d>, <t:${unixReadyAt}:T>)`;
		const servers = client.guilds.cache.size;
		//const members = client.users.cache.size // get member count
		const embed = new EmbedBuilder()
			.setColor(Colors.Blue) // blue = 0x3498DB
			.setTitle(`Bot information`)
			.setThumbnail(client.user.displayAvatarURL({ format: `png`, size: 4096 }))
			.setDescription(`Bot logged in: ${discordReadyAt}\n_(Current sessions login time, this might be outdated!)_\nThe bot has joined **${servers} servers** so far.\n __**${client.user.username} Bot Commands:**__\n`) // with **${members} members**
			.addFields([{ name: `Available - ${commands.size} Commands`, value: commands.map((x) => `\`/${x.name}\``).join(` | `) }])
			.setTimestamp()
			.setFooter({ text: `Musikpisser Music Bot`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });
		interaction.reply({ embeds: [embed] }).catch((e) => { });
	}
};
