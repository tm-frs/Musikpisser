const { RoleData } = require('discord.js');

module.exports = (client, message) => {
    if (message.author.bot || message.channel.type === 'dm') return;

    const prefix = client.config.px;

    if (message.content.indexOf(prefix) !== 0) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    const cmd = client.commands.get(command) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command));

    const DJ = client.config.opt.DJ;

    const roleDJ = message.guild.roles.cache.find(x => x.name === DJ.roleName);
  
    if (cmd && DJ.enabled && !DJ.notAffected.includes(cmd.name)) {      
      if (!message.guild.roles.cache.some(x => x.name === DJ.roleName)) {
        message.guild.roles.create({name: DJ.roleName, color: "#C27C0E", mentionable: true, permissions:[]});
        
        setTimeout(function() {
          const roleDJ = message.guild.roles.cache.find(x => x.name === DJ.roleName);
          console.log('DJ-Role has been created because DJ-Mode is active and the role is not existing.');
          return message.channel.send(`@everyone A DJ-role has been created because DJ-mode is active and the role was not existing yet. The role is ${roleDJ} and everyone needs it to use the bot.`);
        }, 1000);
        
        setTimeout(function() {
          const messagecreatorhasrole = message.member.roles.cache.some(role => role.id === roleDJ.id);
          if (!messagecreatorhasrole) {
            return message.channel.send(`${message.author}, You can't use this command because only those with the ${roleDJ} role can. ❌`);
          }
        }, 2000);
        
      } else {
      
      const messagecreatorhasrole = message.member.roles.cache.some(role => role.id === roleDJ.id);
//      console.log(messagecreatorhasrole);
//      console.log(roleDJ.id);
        if (!messagecreatorhasrole) {
            return message.channel.send(`${message.author}, You can't use this command because only those with the ${roleDJ} role can. ❌`);
        }
      }
    } 

    if (cmd && cmd.voiceChannel) {
        if (!message.member.voice.channel) return message.channel.send(`${message.author}, You are not connected to an audio channel. ❌`);
        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send(`${message.author}, You are not on the same audio channel as me. ❌`);
    }

    if (cmd) cmd.execute(client, message, args);
};
