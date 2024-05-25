const adminperms = require(`../config.js`).opt.adminperms; // gets the list of users that are allowed to do this (specified in config.js)

module.exports = {
	description: `Force the bot to crash (permitted users only)`,
	name: `crash`,
	options: [],
	showHelp: false, // admin command, not menat to be listed in help command

	run: async (client, interaction) => {
		const messagecreator = (interaction.member.user.username + `#` + interaction.member.user.discriminator); // saves the name of the user executing this as a variable
		console.log(`Crash command executed by: ` + messagecreator); // logs who used the command
		if (adminperms.includes(messagecreator)) { // checks if user is allowed to let the bot crash
			interaction.reply({ content: `Bot will be crashed ️✅` }).catch((e) => { });
			setTimeout(function() {
				process.kill(process.pid); // kill the bot process
			}, 1000);
		} else {
			console.log(`Crash command not executed because ` + messagecreator + ` has no permission. \nThe following user(s) is/are allowed to crash the bot:\n` + adminperms); // logs if command failed due to lack of permission
			return interaction.reply({ content: `You are not allowed to do this! ❌`, ephemeral: true }).catch((e) => { }); // tells the user he is not allowed to let the bot crash
		}
	}
};
