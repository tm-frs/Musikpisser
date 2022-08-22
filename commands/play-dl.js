const { ApplicationCommandOptionType } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const { Colors } = require('discord.js');
const adminperms = require("../config.js").opt.adminperms; // gets the name of the user that is allowed to do this from config file
var fs = require('fs');
const togglePlayDl = async (client) => {
    const oldPlayDlConfig = client.config.opt.playDl.replaceYtdl;
    const newPlayDlConfig = !oldPlayDlConfig;

    var playDlFile = fs.createWriteStream('play-dl_override.txt', { flags: 'w' });
    playDlFile.write(""+newPlayDlConfig);

    return newPlayDlConfig;
}


module.exports = {
	description: "Gives you information about play-dl.",
    name: 'play-dl',
    options: [ {
		name: 'action',
		type: ApplicationCommandOptionType.String,
		description: 'What do you want?',
		choices: [
		{name: "ℹ️  Get information", value: 'info'}, //INFO
		{name: "📴 / 🔛 Toggle play-dl", value: 'toggle'} //TOGGLE
		],
		required: true
	} ],
    showHelp: false, // makes the command not show in help command

    run: async (client, interaction) => {
        const action = await interaction.options.getString('action');

        if (action==='info') {

          const playDlActive = client.config.opt.playDl.replaceYtdl;

          const embed = new EmbedBuilder();

          embed.setColor(Colors.Blue); // blue = 0x3498DB
          embed.setThumbnail(client.user.displayAvatarURL({ format: 'png', size: 4096 }));
          embed.setTitle('Information about play-dl')
  
          embed.setDescription(`**Active:** ${playDlActive}\n \n**Explanation:**\nplay-dl is an alternative YotTube player which is less buggy than the normal one, but it doesn't support some features (/jump, for example).\nIf play-dl is active, it will play just YouTube tracks, everything else will still be played by the normal player.\nPermitted users can toggle this with \`/play-dl toggle\`. It will be set back to default when the bot restarts.`);
  
          embed.setTimestamp();
          embed.setFooter({ text: 'Music Bot - by CraftingShadowDE', iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });
      
          return interaction.reply({ embeds: [embed] }).catch(e => { })

        } else if (action==='toggle') {

          const messagecreator = (interaction.member.user.username+'#'+interaction.member.user.discriminator); // saves the name of the user executing this as a variable
          console.log('Toggle play-dl command executed by: '+messagecreator); // will let you see in the logs who used the command 
          if (adminperms.includes(messagecreator)) { // checks if user is allowed to toggle play-dl
            const newSetting = await togglePlayDl(client);
            interaction.reply({ content: `play-dl was switched **from ${!newSetting ? 'enabled' : 'disabled'} to ${newSetting ? 'enabled' : 'disabled'}** ✅\n*(to apply changes, wait for the sond to finish or skip the track)*` }).catch(e => { });
          } else {
            console.log('Toggle play-dl command not executed because '+messagecreator+' has no permission. \nThe following user(s) is/are allowed to crash the bot:\n'+adminperms); // writes in logs if command failed because there are no permissions
            return interaction.reply({ content: `You are not allowed to do this! ❌`, ephemeral: true }).catch(e => { }); // tells the user he is not allowed to toggle play-dl
          }

        }
    },
};