const { MessageEmbed } = require('discord.js');
module.exports = (client, int) => {

if(!int.guild) return

    if (int.isCommand()){

    const cmd = client.commands.get(int.commandName);

    if (!cmd) return void int.reply({
        content: `Command \`${int.commandName}\` not found.`,
        ephemeral: true
    })

    const DJ = client.config.opt.DJ;

    const roleDJ = int.guild.roles.cache.find(x => x.name === DJ.roleName);

    if (cmd && DJ.enabled && !DJ.notAffected.includes(cmd.name)) {      
      if (!int.guild.roles.cache.some(x => x.name === DJ.roleName)) {
        int.guild.roles.create({name: DJ.roleName, color: "#C27C0E", mentionable: true, permissions:[]});
        
        setTimeout(function() {
          const roleDJ = message.guild.roles.cache.find(x => x.name === DJ.roleName);
          console.log('DJ-Role has been created because DJ-Mode is active and the role is not existing.');
		  
		    const embed = new MessageEmbed()
            .setColor('RED')
            .setTitle('ANNOUNCEMENT')
            .setThumbnail(client.user.displayAvatarURL())
            .setDescription(`A DJ-role has been created because DJ-mode is active and the role was not existing yet. The role is ${roleDJ} and everyone needs it to use the bot. (Some commands can still be used by everyone.)`)
            .setTimestamp()
            .setFooter({ text: 'Music Bot - by CraftingShadowDE', iconURL:int.user.displayAvatarURL({ dynamic: true }) });
			
		return int.reply({ content: `@everyone`, embeds: [embed], ephemeral: true}).catch(e => { })
        }, 1000);
        
        setTimeout(function() {
          const messagecreatorhasrole = int.member.roles.cache.some(role => role.id === roleDJ.id);
          if (!messagecreatorhasrole && !int.member.permissions.has("MANAGE_GUILD")) {
				const embed = new MessageEmbed()
				.setColor('BLUE')
				.setTitle(client.user.username)
				.setThumbnail(client.user.displayAvatarURL())
				.setDescription(`You can't use this command because only those with the ${roleDJ} role can. ❌`)
				.setTimestamp()
				.setFooter({ text: 'Music Bot - by CraftingShadowDE', iconURL:int.user.displayAvatarURL({ dynamic: true }) });
			
			return int.reply({ content: `${int.author}`, embeds: [embed], ephemeral: true}).catch(e => { })
          }
        }, 2000);
        
      } else {
      
      const messagecreatorhasrole = int.member.roles.cache.some(role => role.id === roleDJ.id);
//      console.log(messagecreatorhasrole);
//      console.log(roleDJ.id);
        if (!messagecreatorhasrole && !int.member.permissions.has("MANAGE_GUILD")) {
				const embed = new MessageEmbed()
				.setColor('BLUE')
				.setTitle(client.user.username)
				.setThumbnail(client.user.displayAvatarURL())
				.setDescription(`You can't use this command because only those with the ${roleDJ} role can. ❌`)
				.setTimestamp()
				.setFooter({ text: 'Music Bot - by CraftingShadowDE', iconURL:int.user.displayAvatarURL({ dynamic: true }) });
			
			return int.reply({ content: `${int.author}`, embeds: [embed], ephemeral: true}).catch(e => { })
        }
      }
    } 

    if (cmd && cmd.voiceChannel) {
        if (!int.member.voice.channel) return int.reply({ content: `You are not connected to an audio channel. ❌`, ephemeral: true});
        if (int.guild.me.voice.channel && int.member.voice.channel.id !== int.guild.me.voice.channel.id) return int.reply({ content: `You are not on the same audio channel as me. ❌`, ephemeral: true});
    }

    cmd.run(client, int)
    }

    if (int.isButton()){
        const queue = client.player.getQueue(int.guildId);
    switch (int.customId) {
        case 'saveTrack': {
       if (!queue || !queue.playing){
       return int.reply({ content: `No music currently playing. ❌`, ephemeral: true, components: [] });
       } else {
          const embed = new MessageEmbed()
          .setColor('GREEN')
          .setTitle(client.user.username + " - Saved Track")
          .setThumbnail(client.user.displayAvatarURL())
          .addField(`**Title:** `, `\`${queue.current.title}\``)
          .addField(`**Author:** `, `\`${queue.current.author}\``)
          .addField(`**URL:** `, `${queue.current.url}`)
          .addField(`**Duration:** `, `\`${queue.current.duration}\``)
          .addField(`**Saved Server:**`, `\`${int.guild.name}\``)
          .setTimestamp()
          .setFooter({ text: 'Music Bot - by CraftingShadowDE', iconURL: int.user.displayAvatarURL({ dynamic: true }) });
          int.member.send({ embeds: [embed] }).then(() => {
                return int.reply({ content: `I sent you the name of the music in a private message ✅`, ephemeral: true}).catch(e => { })
            }).catch(error => {
                return int.reply({ content: `I can't send you a private message. ❌`, ephemeral: true}).catch(e => { })
            });
        }
    }
        break
        case 'time': {
            if (!queue || !queue.playing){
                return int.reply({ content: `No music currently playing. ❌`, ephemeral: true, components: [] });
                } else {

            const progress = queue.createProgressBar();
            const timestamp = queue.getPlayerTimestamp();
    
            if (timestamp.progress == 'Infinity') return int.message.edit({ content: `This song is live streaming, no duration data to display. 🎧` }).catch(e => { })
    
            const embed = new MessageEmbed()
            .setColor('BLUE')
            .setTitle(queue.current.title)
            .setThumbnail(client.user.displayAvatarURL())
            .setTimestamp()
            .setDescription(`${progress} (**${timestamp.progress}%**)`)
            .setFooter({ text: 'Music Bot - by CraftingShadowDE', iconURL: int.user.displayAvatarURL({ dynamic: true }) });
            int.message.edit({ embeds: [embed] }).catch(e => { })
            int.reply({ content: `**Success:** Time data updated. ✅`, ephemeral: true}).catch(e => { })
        }
    }
    }
}
};