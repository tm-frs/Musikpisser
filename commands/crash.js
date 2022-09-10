const adminperms = require("../config.js").opt.adminperms; // gets the name of the user that is allowed to do this from config file

module.exports = {
	description: "Forces the bot to crash.",
    name: 'crash',
    options: [],
    showHelp: false, // makes the command not show in help command

    run: async (client, interaction) => {
        const messagecreator = (interaction.member.user.username+'#'+interaction.member.user.discriminator); // saves the name of the user executing this as a variable
        console.log('Crash command executed by: '+messagecreator); // will let you see in the logs who used the command 
        if (adminperms.includes(messagecreator)) { // checks if user is allowed to let the bot crash
        interaction.reply({ content: `Bot will be crashed ️✅` }).catch(e => { });
		setTimeout(function() {
			process.kill(process.pid); //kill the bot process
		}, 1000);
        } else {
          console.log('Crash command not executed because '+messagecreator+' has no permission. \nThe following user(s) is/are allowed to crash the bot:\n'+adminperms); // writes in logs if command failed because there are no permissions
          return interaction.reply({ content: `You are not allowed to do this! ❌`, ephemeral: true }).catch(e => { }); // tells the user he is not allowed to let the bot crash
          
        }
    },
};