const adminperms = require("../../config.js").opt.adminperms; // gets the name of the user that is allowed to do this from config file

module.exports = {
    name: 'crash',
    aliases: ['restart','error','shutdown'],
    showHelp: false, // makes the command not show in help command
    utilisation: '{prefix}crash',

      execute(client, message, args) {
        const messagecreator = (message.author.username+'#'+message.author.discriminator); // saves the name of the user executing this as a variable
        console.log('Crash command executed by: '+messagecreator); // will let you see in the logs who used the command 
        if (adminperms.includes(messagecreator)) { // checks if user is allowed to let the bot crash
      dgdfhfhjgjh // just some random things that are just here to crash the bot if needed
        } else {
          console.log('Crash command not executed because '+messagecreator+' has no permission. \nThe following user(s) is/are allowed to crash the bot:\n'+adminperms); // writes in logs if command failed because there are no permissions
          return message.channel.send(`${message.author}, You are not allowed to do this! ❌`); // tells the user he is not allowed to let the bot crash
          
        }
    },
};