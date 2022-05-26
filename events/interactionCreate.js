const { MessageEmbed } = require('discord.js');
const { QueryType } = require('discord-player');
const blacklist = require("../config.js").opt.blacklist;

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
          const roleDJ = int.guild.roles.cache.find(x => x.name === DJ.roleName);
          console.log('DJ-Role has been created because DJ-Mode is active and the role is not existing.');
		  
		    const embed = new MessageEmbed()
            .setColor('RED')
            .setTitle('ANNOUNCEMENT')
            .setThumbnail(client.user.displayAvatarURL())
            .setDescription(`A DJ-role has been created because DJ-mode is active and the role was not existing yet. The role is ${roleDJ} and everyone needs it to use the bot. (Some commands can still be used by everyone.)`)
            .setTimestamp()
            .setFooter({ text: 'Music Bot - by CraftingShadowDE', iconURL:int.user.displayAvatarURL({ dynamic: true }) });
			
		return int.reply({ content: `@everyone`, embeds: [embed] }).catch(e => { })
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
			
			return int.reply({ embeds: [embed], ephemeral: true}).catch(e => { })
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
			
			return int.reply({ embeds: [embed], ephemeral: true}).catch(e => { })
        }
      }
    } 

    if (cmd && cmd.voiceChannel) {
        if (!int.member.voice.channel) return int.reply({ content: `You are not connected to an audio channel. ❌`, ephemeral: true});
        if (int.guild.me.voice.channel && int.member.voice.channel.id !== int.guild.me.voice.channel.id) return int.reply({ content: `You are not on the same audio channel as me. ❌`, ephemeral: true});
    }

    cmd.run(client, int)
    }

    if (int.isButton()) {
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
            .setDescription(`${progress} \nThe track is finished by **${timestamp.progress}%**.`)
            .setFooter({ text: 'Music Bot - by CraftingShadowDE', iconURL: int.user.displayAvatarURL({ dynamic: true }) });
            int.message.edit({ embeds: [embed] }).catch(e => { })
            int.reply({ content: `**Success:** Time data updated. ✅`, ephemeral: true}).catch(e => { })
        }
    }
        break
        case 'cancelButton': {
    const name = ((int.message.embeds[0].title).substr(17,((int.message.embeds[0].title).length)-18))

  	if (int.user.id === int.message.interaction.user.id) {
		const createembed = async (name) => {
      const res = await client.player.search(name, {
          requestedBy: int.message.user,
          searchEngine: QueryType.AUTO
      });

      const embed = new MessageEmbed();
	
	    embed.setColor('BLUE');
  	  embed.setTitle(`Searched Music: "${name}"`);
	
    	const maxTracks = res.tracks.slice(0, 10);
	
	    embed.setDescription(`${maxTracks.map((track, i) => `**${i + 1}**. \`${track.title}\` | \`${track.author}\``).join('\n')}\n\nSelection cancelled because the cancel-button was pressed! ❌`);
	
	    embed.setTimestamp();
	    embed.setFooter({ text: 'Music Bot - by CraftingShadowDE', iconURL: int.user.displayAvatarURL({ dynamic: true }) });
      
	    int.update({ embeds: [embed], components: [] }).catch(e => { })
     }
    createembed(name);
	  } else {
	  	int.reply({ content: `You aren't allowed to do this because you are not the person that executed the search-command! ❌`, ephemeral: true });
	  }


    }
    }
}
   if (int.isSelectMenu()){
   switch (int.customId) {
        case 'trackMenu': {
          const chosenTrack = int.values[0]
          console.log(chosenTrack)
          const selection = chosenTrack=='t1' ? 0 : chosenTrack=='t2' ? 1 : chosenTrack=='t3' ? 2 : chosenTrack=='t4' ? 3 : chosenTrack=='t5' ? 4 : chosenTrack=='t6' ? 5 : chosenTrack=='t7' ? 6 : chosenTrack=='t8' ? 7 : chosenTrack=='t9' ? 8 : chosenTrack=='t10' ? 9 : 'error'
          const name = ((int.message.embeds[0].title).substr(17,((int.message.embeds[0].title).length)-18))
          
          if (int.user.id === int.message.interaction.user.id) {
          if (int.member.voice.channel) {
          const addTrack = async (name, selection) => {
            const queue = await client.player.createQueue(int.guild, {
              leaveOnEnd: client.config.opt.voiceConfig.leaveOnEnd,
              autoSelfDeaf: client.config.opt.voiceConfig.autoSelfDeaf,
              metadata: int.channel,
              initialVolume: client.config.opt.discordPlayer.initialVolume,
              volumeSmoothness: client.config.opt.discordPlayer.volumeSmoothness
            });
            const res = await client.player.search(name, {
              requestedBy: int.message.user,
              searchEngine: QueryType.AUTO
            });
            try {
                if (!queue.connection) await queue.connect(int.member.voice.channel);
            } catch {
                await client.player.deleteQueue(int.guildId);
                return int.channel.send({ content: `${int.user}, I can't join the audio channel. ❌` }).catch(e => { });
            }

            await int.channel.send({ content: `${int.user}, Your chosen track is loading now... 🎧` }).catch(e => { });

         
      const filter = res.tracks[selection].title; // adds an variable that is used to check for the blacklist
      
//      console.log('RES TRACKS 0:\n'+filter); // info ausgabe der res (result) variable zum Filtern, gewähltes Ergebnis
//      console.log('Blacklist detection:', blacklist.includes(filter)); // Test auf Blacklist mit Konsolenausgabe
      
        if (blacklist.includes(filter)) { // Filter
          return int.channel.send({ content: `${int.user}, Something went wrong :( ❌` }).catch(e => { }); // "Fehlermeldung"
        } else {
          queue.addTrack(res.tracks[selection]); // im Normalfall Musik hinzufügen
        }
            if (!queue.playing) await queue.play();
          }
          addTrack(name, selection);
		const createembed = async (name, selection) => {
      const res = await client.player.search(name, {
          requestedBy: int.message.user,
          searchEngine: QueryType.AUTO
      });

      const embed = new MessageEmbed();
	
	    embed.setColor('BLUE');
  	  embed.setTitle(`Searched Music: "${name}"`);
	
    	const maxTracks = res.tracks.slice(0, 10);
	
	    embed.setDescription(`${maxTracks.map((track, i) => `**${i + 1}**. \`${track.title}\` | \`${track.author}\``).join('\n')}\n\nSelection stopped because track **${selection+1}** was selected. ✅`);
	
	    embed.setTimestamp();
	    embed.setFooter({ text: 'Music Bot - by CraftingShadowDE', iconURL: int.user.displayAvatarURL({ dynamic: true }) });
      
	    int.update({ embeds: [embed], components: [] }).catch(e => { })
     }
    createembed(name, selection);
    } else {
      int.reply({ content: `You are not connected to an audio channel. ❌`, ephemeral: true });
    }
	  } else {
	  	int.reply({ content: `You aren't allowed to do this because you are not the person that executed the search-command! ❌`, ephemeral: true });
	  }
   }
   }
}
};