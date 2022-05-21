const adminperms = require("../config.js").opt.adminperms; // gets the name of the user that is allowed to do this from config file
const synchronizeSlashCommands = require('discord-sync-commands-v14');

module.exports = {
	description: "Syncs the slash commands with the server.",
    name: 'synccommands',
    options: [],
    showHelp: false, // makes the command not show in help command

    run: async (client, interaction) => {
        const messagecreator = (interaction.member.user.username+'#'+interaction.member.user.discriminator); // saves the name of the user executing this as a variable
        console.log('Sync command executed by: '+messagecreator); // will let you see in the logs who used the command 
        if (adminperms.includes(messagecreator)) { // checks if user is allowed to let the bot sync the commands
        interaction.reply({ content: `Commands will be synced ️✅` }).catch(e => { });
			synchronizeSlashCommands(client, client.commands.map((c) => ({
				name: c.name,
				description: c.description,
				options: c.options,
				type: 'CHAT_INPUT'
			})))
        } else {
          console.log('Sync command not executed because '+messagecreator+' has no permission. \nThe following user(s) is/are allowed to sync the commands:\n'+adminperms); // writes in logs if command failed because there are no permissions
          return interaction.reply({ content: `You are not allowed to do this! ❌`, ephemeral: true }).catch(e => { }); // tells the user he is not allowed to let the bot sync the commands
          
        }
    },
};