const { Colors } = require(`discord.js`);
const { EmbedBuilder } = require(`discord.js`);

module.exports = {
	description: `Information about the bot and its commands.`,
	name: `help`,
	options: [],
	showHelp: false,

	run: async (client, interaction) => {
		//const testGuild = (await client.guilds.fetch())/*hier abtrennen, um alle Server zu zeigen*/.find(guild => guild.id === ""/*<- ID des anzuzeigenden Servers*/);
		//console.log(testGuild)
		const commands = client.commands.filter((x) => x.showHelp !== false);
		const unixReadyAt = Math.floor(new Date(client.readyAt).getTime() / 1000);
		const discordReadyAt = `<t:${unixReadyAt}:R> (<t:${unixReadyAt}:d>, <t:${unixReadyAt}:T>)`;
		const servers = client.guilds.cache.size;
		// const members = client.users.cache.size // get member count
		const embed = new EmbedBuilder()
			.setColor(Colors.Blue) // blue = 0x3498DB
			.setTitle(`Bot information`)
			.setThumbnail(client.user.displayAvatarURL({ format: `png`, size: 4096 }))
			.setDescription(`Bot logged in: ${discordReadyAt}\n_(Current sessions login time, this might be outdated!)_\nThe bot has joined **${servers} servers** so far.\n __**${client.user.username} Bot Commands:**__\n`) // with **${members} members**
			.addFields([{ name: `Available - ${commands.size} Commands`, value: commands.map((x) => `\`/${x.name}\``).join(` | `) }])
		//		.addField(`**DJ mode active:** `, DJ.enabled) //if reactivated, convert to addFields
		//		.addField(`**Available for everyone:** `, DJ.notAffected) //if reactivated, convert to addFields
			.setTimestamp()
			.setFooter({ text: `Music Bot - by CraftingShadowDE`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });
		interaction.reply({ embeds: [embed] }).catch((e) => { }); // eslint-disable-line no-unused-vars
	}
};
