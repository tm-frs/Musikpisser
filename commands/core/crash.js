const crashperms = require("../../config.js").opt.crashperms; // gets the name of the user that is allowed to do this from config file

module.exports = {
    name: 'crash',
    aliases: ['restart','error'],
    showHelp: false, // makes the command not show in help command
    utilisation: '{prefix}crash',

      execute(client, message, args) {
        const messagecreator = (message.author.username+'#'+message.author.discriminator); // saves the name of the user executing this as a variable
        console.log('Crash command executed by: '+messagecreator); // will let you see in the logs who used the command 
        if (messagecreator === crashperms) { // checks if user is allowed to let the bot crash
      dgdfhfhjgjh // just some random things that are just here to crash the bot if needed
        } else {
          console.log('Crash command not executed because only '+crashperms+' is allowed to do it, and '+messagecreator+' is not.'); // writes in logs if command failed because there are no permissions
          return message.channel.send(`${message.author}, You are not allowed to do this! ❌`); // tells the user he is not allowed to let the bot crash
          
        }
    },
};
