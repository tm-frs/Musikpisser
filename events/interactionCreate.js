const { InteractionType } = require('discord.js');
const { ButtonStyle } = require('discord.js');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const { SnowflakeUtil } = require('discord.js');
const { QueryType } = require('discord-player');
const blacklist = require("../config.js").opt.blacklist;
const wait = require('node:timers/promises').setTimeout;
const createrole = async (client, int, DJ) => {
  await int.guild.roles.create({name: DJ.roleName, color: "#C27C0E", mentionable: true, permissions:[]});

    const roleDJ = await int.guild.roles.cache.find(x => x.name === DJ.roleName);
    console.log('DJ-Role has been created because DJ-Mode is active and the role is not existing.');

  const embed = new EmbedBuilder()
      .setColor('RED')
      .setTitle('ANNOUNCEMENT')
      .setThumbnail(await client.user.displayAvatarURL({ format: 'png', size: 4096 }))
      .setDescription(`A DJ-role has been created because DJ-mode is active and the role was not existing yet. The role is ${roleDJ} and everyone needs it to use the bot. (Some commands can still be used by everyone.)`)
      .setTimestamp()
      .setFooter({ text: 'Music Bot - by CraftingShadowDE', iconURL: await int.user.displayAvatarURL({ dynamic: true }) });

return int.channel.send({ content: `@everyone`, embeds: [embed] }).catch(e => { })
};
const replyNotAllowed = async (client, int, DJ) => {
  const roleDJ = await int.guild.roles.cache.find(x => x.name === DJ.roleName);
  const embed = new EmbedBuilder()
  .setColor('BLUE')
  .setTitle(await client.user.username)
  .setThumbnail(await client.user.displayAvatarURL({ format: 'png', size: 4096 }))
  .setDescription(`You can't use this command because only those with the ${roleDJ} role can. ❌`)
  .setTimestamp()
  .setFooter({ text: 'Music Bot - by CraftingShadowDE', iconURL: await int.user.displayAvatarURL({ dynamic: true }) });

  return int.reply({ embeds: [embed], ephemeral: true}).catch(e => { })
}

module.exports = (client, int) => {

if(!int.guild) return

const botvoicechannel = int.guild.members.cache.find(user => user.id === client.user.id).voice.channel
const othervoicechannel = (botvoicechannel && int.member.voice.channel.id !== botvoicechannel.id)

    if (int.type === InteractionType.ApplicationCommand){

    const cmd = client.commands.get(int.commandName);

    if (!cmd) return void int.reply({
        content: `Command \`${int.commandName}\` not found.`,
        ephemeral: true
    })

    const DJ = client.config.opt.DJ;

    

    if (cmd && DJ.enabled && !DJ.notAffected.includes(cmd.name)) {      
      if (!int.guild.roles.cache.some(x => x.name === DJ.roleName)) {
    createrole(client, int, DJ);
        
        setTimeout(function() {

          const roleDJ = int.guild.roles.cache.find(x => x.name === DJ.roleName);
          const messagecreatorhasrole = (int.guild.roles.cache.some(x => x.name === DJ.roleName) && int.member.roles.cache.some(role => role.id === roleDJ.id)) ? true : (DJ.alwaysAllowAdmins && int.member.permissions.has("MANAGE_GUILD")) ? true : false;
//          console.log("Rolle existent:\n"+int.guild.roles.cache.some(x => x.name === DJ.roleName)+"\nNutzer hat Rolle:\n"+int.member.roles.cache.some(role => role.id === roleDJ.id)+"\nAdmins haben Berechtigung:\n"+DJ.alwaysAllowAdmins+"\nNutzer ist Admin:\n"+int.member.permissions.has("MANAGE_GUILD")+"\nBefund:\n"+messagecreatorhasrole)
          if (!messagecreatorhasrole) {
      return replyNotAllowed(client, int, DJ);
          }
        }, 1001);
        
      } else {
      
      const roleDJ = int.guild.roles.cache.find(x => x.name === DJ.roleName);
      const messagecreatorhasrole = (int.guild.roles.cache.some(x => x.name === DJ.roleName) && int.member.roles.cache.some(role => role.id === roleDJ.id)) ? true : (DJ.alwaysAllowAdmins && int.member.permissions.has("MANAGE_GUILD")) ? true : false;
//      console.log(messagecreatorhasrole);
//      console.log(roleDJ.id);
        if (!messagecreatorhasrole) {
      replyNotAllowed(client, int, DJ);
        }
      }
    } 

    if (cmd && cmd.voiceChannel) {
        if (!int.member.voice.channel) return int.reply({ content: `You are not connected to an audio channel. ❌`, ephemeral: true});
//        console.log(client.user.id)
//        console.log(botvoicechannel)
        if (othervoicechannel) return int.reply({ content: `You are not on the same audio channel as me. ❌`, ephemeral: true});
//old version:        if (int.guild.me.voice.channel && int.member.voice.channel.id !== int.guild.me.voice.channel.id) return int.reply({ content: `You are not on the same audio channel as me. ❌`, ephemeral: true});
    }

    const roleDJ = DJ.enabled ? int.guild.roles.cache.find(x => x.name === DJ.roleName) : null;
    const DJonAndAffectedAndPermission = ((DJ.enabled && !DJ.notAffected.includes(cmd.name)) && ((int.guild.roles.cache.some(x => x.name === DJ.roleName) && int.member.roles.cache.some(role => role.id === roleDJ.id)) || (DJ.alwaysAllowAdmins && int.member.permissions.has("MANAGE_GUILD"))))
    const DJonAndNotAffected = (DJ.enabled && DJ.notAffected.includes(cmd.name))
    const DJoff = (!DJ.enabled)
    if (DJonAndAffectedAndPermission || DJonAndNotAffected || DJoff) cmd.run(client, int)
    }

    if (int.type === InteractionType.MessageComponent) {
      const DJ = client.config.opt.DJ;
      const roleDJ = int.guild.roles.cache.find(x => x.name === DJ.roleName);
    const userIsAllowed = !DJ.enabled ? true : !DJ.affectedButtonsAndMenus.includes(int.customId) ? true : (int.guild.roles.cache.some(x => x.name === DJ.roleName) && int.member.roles.cache.some(role => role.id === roleDJ.id)) ? true : (DJ.alwaysAllowAdmins && int.member.permissions.has("MANAGE_GUILD")) ? true : false;
    if (!int.guild.roles.cache.some(x => x.name === DJ.roleName) && DJ.enabled) createrole(client, int, DJ);
    if (!userIsAllowed) {
      replyNotAllowed(client, int, DJ);
    } else {
        const queue = client.player.getQueue(int.guildId);
    switch (int.customId) {
        case 'saveTrack': {
          const description = int.message.embeds[0].description+"\n**Saved at this server:** \`"+int.guild.name+"\`"
          const embed = new EmbedBuilder()
          .setColor('GREEN')
          .setTitle(client.user.username + " - Saved Track")
          .setThumbnail(client.user.displayAvatarURL({ format: 'png', size: 4096 }))
          .setDescription(description)
          .setTimestamp()
          .setFooter({ text: 'Music Bot - by CraftingShadowDE', iconURL: int.user.displayAvatarURL({ dynamic: true }) });
          int.member.send({ embeds: [embed] }).then(() => {
                return int.reply({ content: `I sent you the name of the music in a private message ✅`, ephemeral: true}).catch(e => { })
            }).catch(error => {
                return int.reply({ content: `I can't send you a private message. ❌`, ephemeral: true}).catch(e => { })
            });
    }
        break
        case 'time': {
            if (!queue || !queue.playing){
                return int.reply({ content: `No music currently playing. ❌`, ephemeral: true, components: [] });
            } else {

            const progress = queue.createProgressBar();
            const timestamp = queue.getPlayerTimestamp();
            const unixPlayingSince = parseInt((parseInt(SnowflakeUtil.deconstruct(queue.id).timestamp))/1000);
            const discordPlayingSince = `<t:${unixPlayingSince}:R> (<t:${unixPlayingSince}:d>, <t:${unixPlayingSince}:T>)`
    
            if (timestamp.progress == 'Infinity') return int.message.edit({ content: `This song is live streaming, no duration data to display. 🎧` }).catch(e => { })
    
            const embed = new EmbedBuilder()
            .setColor('BLUE')
            .setTitle(queue.current.title)
            .setThumbnail(client.user.displayAvatarURL({ format: 'png', size: 4096 }))
            .setTimestamp()
            .setDescription(`${progress} \nThe track is finished by **${timestamp.progress}%**.\nThe bot is playing since: *${discordPlayingSince}*.`)
            .setFooter({ text: 'Music Bot - by CraftingShadowDE', iconURL: int.user.displayAvatarURL({ dynamic: true }) });
            int.message.edit({ embeds: [embed] }).catch(e => { })
            int.reply({ content: `**Success:** Time data updated. ✅`, ephemeral: true}).catch(e => { })
        }
    }
    break
    case 'queue': {
        if (!queue || !queue.playing){
            return int.reply({ content: `No music currently playing. ❌`, ephemeral: true, components: [] });
        } else {
        if (!queue.tracks[0]) {
            return int.reply({ content: `No music in queue after current. ❌`, ephemeral: true }).catch(e => { });
        } else {

        const unixPlayingSince = parseInt((parseInt(SnowflakeUtil.deconstruct(queue.id).timestamp))/1000);
        const discordPlayingSince = `<t:${unixPlayingSince}:R> (<t:${unixPlayingSince}:d>, <t:${unixPlayingSince}:T>)`
  
        const embed = new EmbedBuilder();
      const options = ['📴 (Loop mode: Off)','🔂 (Loop mode: Track)','🔁 (Loop mode: Queue)','▶ (Loop mode: Autoplay)']
        const loopMode = options[queue.repeatMode];
  
        embed.setColor('BLUE');
        embed.setThumbnail(int.guild.iconURL({ size: 4096, format: 'png', dynamic: true }));
        embed.setTitle(`Server Music List - ${int.guild.name} ${loopMode}`);
  
        const tracks = queue.tracks.map((track, i) => `**${i + 1}** - \`${track.title}\` | \`${track.author}\` (requested by <@${track. requestedBy.id}>)`);
  
        const songs = queue.tracks.length;
        const nextSongs = songs > 5 ? `And **${songs - 5}** Other Song...` : `There are **${songs}** Songs in the List.`;
  
        embed.setDescription(`The bot is playing since: *${discordPlayingSince}*.\n\n**Currently Playing:** \`${queue.current.title}\` by \`${queue.current.author}\` (requested by <@${queue.current.requestedBy.id}>)\n\n${tracks.slice(0, 5).join('\n')}\n\n${nextSongs }`);
  
        embed.setTimestamp();
        embed.setFooter({text: 'Music Bot - by CraftingShadowDE', iconURL: int.user.displayAvatarURL({ dynamic: true }) });
        int.message.edit({ embeds: [embed] }).catch(e => { })
        int.reply({ content: `**Success:** Queue data updated. ✅`, ephemeral: true}).catch(e => { })
    }
    }
}
        break
        case 'cancelButton': {
    const name = ((int.message.embeds[0].title).substr(17,((int.message.embeds[0].title).length)-18))

  	if (int.user.id === int.message.interaction.user.id) {
		const createembed = async (name) => {
      const res = await client.player.search(name, {
          requestedBy: int.user,
          searchEngine: QueryType.AUTO
      });

      const embed = new EmbedBuilder();
	
	    embed.setColor('BLUE');
  	  embed.setTitle(`Searched Music: "${name}"`);
	
    	const maxTracks = res.tracks.slice(0, 10);
	
      const description = ((int.message.embeds[0].description).substring(0, ((int.message.embeds[0].description).length)-183))+'Selection cancelled because the cancel-button was pressed! ❌'
	    embed.setDescription(description);

	    embed.setTimestamp();
	    embed.setFooter({ text: 'Music Bot - by CraftingShadowDE', iconURL: int.user.displayAvatarURL({ dynamic: true }) });
      
	    int.update({ embeds: [embed], components: [] }).catch(e => { })
     }
    createembed(name);
	  } else {
	  	int.reply({ content: `You aren't allowed to do this because you are not the person that executed the search-command! ❌`, ephemeral: true });
	  }


    }
        break
        case 'addAgainButton': {

if (othervoicechannel) return int.reply({ content: `You are not on the same audio channel as me. ❌`, ephemeral: true});

    const selection = parseInt(((int.message.embeds[0].description).substr(-20, 2)).replace("*", ''))-1
    const name = ((int.message.embeds[0].title).substr(17,((int.message.embeds[0].title).length)-18))
    const resultArray = (int.message.embeds[0].description).split("\n")
    const resultCount = (resultArray.length-2)/2
    const resultURLs = resultCount===1 ? [(resultArray[1].substr(31,((resultArray[1]).length)-33))] : resultCount===2 ? [(resultArray[1].substr(31,((resultArray[1]).length)-33)),(resultArray[3].substr(31,((resultArray[3]).length)-33))] : resultCount===3 ? [(resultArray[1].substr(31,((resultArray[1]).length)-33)),(resultArray[3].substr(31,((resultArray[3]).length)-33)),(resultArray[5].substr(31,((resultArray[5]).length)-33))] : resultCount===4 ? [(resultArray[1].substr(31,((resultArray[1]).length)-33)),(resultArray[3].substr(31,((resultArray[3]).length)-33)),(resultArray[5].substr(31,((resultArray[5]).length)-33)),(resultArray[7].substr(31,((resultArray[7]).length)-33))] : resultCount===5 ? [(resultArray[1].substr(31,((resultArray[1]).length)-33)),(resultArray[3].substr(31,((resultArray[3]).length)-33)),(resultArray[5].substr(31,((resultArray[5]).length)-33)),(resultArray[7].substr(31,((resultArray[7]).length)-33)),(resultArray[9].substr(31,((resultArray[9]).length)-33))] : resultCount===6 ? [(resultArray[1].substr(31,((resultArray[1]).length)-33)),(resultArray[3].substr(31,((resultArray[3]).length)-33)),(resultArray[5].substr(31,((resultArray[5]).length)-33)),(resultArray[7].substr(31,((resultArray[7]).length)-33)),(resultArray[9].substr(31,((resultArray[9]).length)-33)),(resultArray[11].substr(31,((resultArray[11]).length)-33))] : resultCount===7 ? [(resultArray[1].substr(31,((resultArray[1]).length)-33)),(resultArray[3].substr(31,((resultArray[3]).length)-33)),(resultArray[5].substr(31,((resultArray[5]).length)-33)),(resultArray[7].substr(31,((resultArray[7]).length)-33)),(resultArray[9].substr(31,((resultArray[9]).length)-33)),(resultArray[11].substr(31,((resultArray[11]).length)-33)),(resultArray[13].substr(31,((resultArray[13]).length)-33))] : resultCount===8 ? [(resultArray[1].substr(31,((resultArray[1]).length)-33)),(resultArray[3].substr(31,((resultArray[3]).length)-33)),(resultArray[5].substr(31,((resultArray[5]).length)-33)),(resultArray[7].substr(31,((resultArray[7]).length)-33)),(resultArray[9].substr(31,((resultArray[9]).length)-33)),(resultArray[11].substr(31,((resultArray[11]).length)-33)),(resultArray[13].substr(31,((resultArray[13]).length)-33)),(resultArray[15].substr(31,((resultArray[15]).length)-33))] : resultCount===9 ? [(resultArray[1].substr(31,((resultArray[1]).length)-33)),(resultArray[3].substr(31,((resultArray[3]).length)-33)),(resultArray[5].substr(31,((resultArray[5]).length)-33)),(resultArray[7].substr(31,((resultArray[7]).length)-33)),(resultArray[9].substr(31,((resultArray[9]).length)-33)),(resultArray[11].substr(31,((resultArray[11]).length)-33)),(resultArray[13].substr(31,((resultArray[13]).length)-33)),(resultArray[15].substr(31,((resultArray[15]).length)-33)),(resultArray[17].substr(31,((resultArray[17]).length)-33))] : resultCount===10 ? [(resultArray[1].substr(31,((resultArray[1]).length)-33)),(resultArray[3].substr(31,((resultArray[3]).length)-33)),(resultArray[5].substr(31,((resultArray[5]).length)-33)),(resultArray[7].substr(31,((resultArray[7]).length)-33)),(resultArray[9].substr(31,((resultArray[9]).length)-33)),(resultArray[11].substr(31,((resultArray[11]).length)-33)),(resultArray[13].substr(31,((resultArray[13]).length)-33)),(resultArray[15].substr(31,((resultArray[15]).length)-33)),(resultArray[17].substr(31,((resultArray[17]).length)-33)),(resultArray[19].substr(31,((resultArray[19]).length)-33))] : []
    const selectedResult = resultURLs[selection]
    if (int.member.voice.channel) {
          const addTrack = async (selectedResult) => {
            const queue = await client.player.createQueue(int.guild, {
              leaveOnEnd: client.config.opt.voiceConfig.leaveOnEnd,
              autoSelfDeaf: client.config.opt.voiceConfig.autoSelfDeaf,
              metadata: int.channel,
              initialVolume: client.config.opt.discordPlayer.initialVolume,
              volumeSmoothness: client.config.opt.discordPlayer.volumeSmoothness
            });
            const res = await client.player.search(selectedResult, {
              requestedBy: int.user,
              searchEngine: QueryType.AUTO
            });
            try {
                if (!queue.connection) await queue.connect(int.member.voice.channel);
            } catch {
                await client.player.deleteQueue(int.guildId);
                return int.message.reply({ content: `${int.user}, I can't join the audio channel. ❌` }).catch(e => { });
            }
            if (!res || !res.tracks.length) return int.message.reply({ content: `${int.user}, No search result was found. ❌\nWas the /search executed a long time ago? If so, that might be the reason.\nYou could try another option.` }).catch(e => { });
            await int.message.reply({ content: `${int.user}, **Track ${selection+1}** is loading again... 🎧` }).catch(e => { });

         
      const filter = res.tracks[0].title; // adds an variable that is used to check for the blacklist
      
//      console.log('RES TRACKS 0:\n'+filter); // info ausgabe der res (result) variable zum Filtern, gewähltes Ergebnis
//      console.log('Blacklist detection:', blacklist.includes(filter)); // Test auf Blacklist mit Konsolenausgabe
      
        if (blacklist.includes(filter)) { // Filter
          return int.message.reply({ content: `${int.user}, Something went wrong :( ❌` }).catch(e => { }); // "Fehlermeldung"
        } else {
          queue.addTrack(res.tracks[0]); // im Normalfall Musik hinzufügen
        }
            if (!queue.playing) await queue.play();
          }
          addTrack(selectedResult);

    const ui_disabled = [ {type: 1, components: [{style: ButtonStyle.Success, label: `Add it again`, custom_id: `addAgainButton`, disabled: true, type: 2}]} ]
    int.update({ components: ui_disabled}).catch(e => { })
      
    setTimeout(function() {
      const ui_enabled = [ {type: 1, components: [{style: ButtonStyle.Success, label: `Add it again`, custom_id: `addAgainButton`, disabled: false, type: 2}]} ]
      int.editReply({ components: ui_enabled}).catch(e => { })
    }, 30000);
    } else {
      int.reply({ content: `You are not connected to an audio channel. ❌`, ephemeral: true });
    }
    }
        break
        case 'trackMenu': {

if (othervoicechannel) return int.reply({ content: `You are not on the same audio channel as me. ❌`, ephemeral: true});

          const chosenTrack = int.values[0]
          const selection = chosenTrack=='t1' ? 0 : chosenTrack=='t2' ? 1 : chosenTrack=='t3' ? 2 : chosenTrack=='t4' ? 3 : chosenTrack=='t5' ? 4 : chosenTrack=='t6' ? 5 : chosenTrack=='t7' ? 6 : chosenTrack=='t8' ? 7 : chosenTrack=='t9' ? 8 : chosenTrack=='t10' ? 9 : 'error'
          const name = ((int.message.embeds[0].title).substr(17,((int.message.embeds[0].title).length)-18))
          const resultArray = (int.message.embeds[0].description).split("\n")
          const resultCount = (resultArray.length-2)/2
          const resultURLs = resultCount===1 ? [(resultArray[1].substr(31,((resultArray[1]).length)-33))] : resultCount===2 ? [(resultArray[1].substr(31,((resultArray[1]).length)-33)),(resultArray[3].substr(31,((resultArray[3]).length)-33))] : resultCount===3 ? [(resultArray[1].substr(31,((resultArray[1]).length)-33)),(resultArray[3].substr(31,((resultArray[3]).length)-33)),(resultArray[5].substr(31,((resultArray[5]).length)-33))] : resultCount===4 ? [(resultArray[1].substr(31,((resultArray[1]).length)-33)),(resultArray[3].substr(31,((resultArray[3]).length)-33)),(resultArray[5].substr(31,((resultArray[5]).length)-33)),(resultArray[7].substr(31,((resultArray[7]).length)-33))] : resultCount===5 ? [(resultArray[1].substr(31,((resultArray[1]).length)-33)),(resultArray[3].substr(31,((resultArray[3]).length)-33)),(resultArray[5].substr(31,((resultArray[5]).length)-33)),(resultArray[7].substr(31,((resultArray[7]).length)-33)),(resultArray[9].substr(31,((resultArray[9]).length)-33))] : resultCount===6 ? [(resultArray[1].substr(31,((resultArray[1]).length)-33)),(resultArray[3].substr(31,((resultArray[3]).length)-33)),(resultArray[5].substr(31,((resultArray[5]).length)-33)),(resultArray[7].substr(31,((resultArray[7]).length)-33)),(resultArray[9].substr(31,((resultArray[9]).length)-33)),(resultArray[11].substr(31,((resultArray[11]).length)-33))] : resultCount===7 ? [(resultArray[1].substr(31,((resultArray[1]).length)-33)),(resultArray[3].substr(31,((resultArray[3]).length)-33)),(resultArray[5].substr(31,((resultArray[5]).length)-33)),(resultArray[7].substr(31,((resultArray[7]).length)-33)),(resultArray[9].substr(31,((resultArray[9]).length)-33)),(resultArray[11].substr(31,((resultArray[11]).length)-33)),(resultArray[13].substr(31,((resultArray[13]).length)-33))] : resultCount===8 ? [(resultArray[1].substr(31,((resultArray[1]).length)-33)),(resultArray[3].substr(31,((resultArray[3]).length)-33)),(resultArray[5].substr(31,((resultArray[5]).length)-33)),(resultArray[7].substr(31,((resultArray[7]).length)-33)),(resultArray[9].substr(31,((resultArray[9]).length)-33)),(resultArray[11].substr(31,((resultArray[11]).length)-33)),(resultArray[13].substr(31,((resultArray[13]).length)-33)),(resultArray[15].substr(31,((resultArray[15]).length)-33))] : resultCount===9 ? [(resultArray[1].substr(31,((resultArray[1]).length)-33)),(resultArray[3].substr(31,((resultArray[3]).length)-33)),(resultArray[5].substr(31,((resultArray[5]).length)-33)),(resultArray[7].substr(31,((resultArray[7]).length)-33)),(resultArray[9].substr(31,((resultArray[9]).length)-33)),(resultArray[11].substr(31,((resultArray[11]).length)-33)),(resultArray[13].substr(31,((resultArray[13]).length)-33)),(resultArray[15].substr(31,((resultArray[15]).length)-33)),(resultArray[17].substr(31,((resultArray[17]).length)-33))] : resultCount===10 ? [(resultArray[1].substr(31,((resultArray[1]).length)-33)),(resultArray[3].substr(31,((resultArray[3]).length)-33)),(resultArray[5].substr(31,((resultArray[5]).length)-33)),(resultArray[7].substr(31,((resultArray[7]).length)-33)),(resultArray[9].substr(31,((resultArray[9]).length)-33)),(resultArray[11].substr(31,((resultArray[11]).length)-33)),(resultArray[13].substr(31,((resultArray[13]).length)-33)),(resultArray[15].substr(31,((resultArray[15]).length)-33)),(resultArray[17].substr(31,((resultArray[17]).length)-33)),(resultArray[19].substr(31,((resultArray[19]).length)-33))] : []
          const selectedResult = resultURLs[selection]
          
          const interactionComponents = int.message.components
          
          const resetMenu = async () => {
            await int.message.edit({ components: [] });
            await int.message.edit({ components: interactionComponents });
          }
          
          if (int.user.id === int.message.interaction.user.id) {
          if (int.member.voice.channel) {
          const addTrack = async (selectedResult) => {
            const queue = await client.player.createQueue(int.guild, {
              leaveOnEnd: client.config.opt.voiceConfig.leaveOnEnd,
              autoSelfDeaf: client.config.opt.voiceConfig.autoSelfDeaf,
              metadata: int.channel,
              initialVolume: client.config.opt.discordPlayer.initialVolume,
              volumeSmoothness: client.config.opt.discordPlayer.volumeSmoothness
            });
            const res = await client.player.search(selectedResult, {
              requestedBy: int.user,
              searchEngine: QueryType.AUTO
            });
            try {
                if (!queue.connection) await queue.connect(int.member.voice.channel);
            } catch {
                await client.player.deleteQueue(int.guildId);
                return int.message.reply({ content: `${int.user}, I can't join the audio channel. ❌` }).catch(e => { });
            }
            if (!res || !res.tracks.length) return int.message.reply({ content: `${int.user}, No search result was found. ❌\nWas the /search executed a long time ago? If so, that might be the reason.\nYou could try another option.` }).catch(e => { });
            await int.message.reply({ content: `${int.user}, Your chosen track is loading now... 🎧` }).catch(e => { });

         
      const filter = res.tracks[0].title; // adds an variable that is used to check for the blacklist
      
//      console.log('RES TRACKS 0:\n'+filter); // info ausgabe der res (result) variable zum Filtern, gewähltes Ergebnis
//      console.log('Blacklist detection:', blacklist.includes(filter)); // Test auf Blacklist mit Konsolenausgabe
      
        if (blacklist.includes(filter)) { // Filter
          return int.message.reply({ content: `${int.user}, Something went wrong :( ❌` }).catch(e => { }); // "Fehlermeldung"
        } else {
          queue.addTrack(res.tracks[0]); // im Normalfall Musik hinzufügen
        }
            if (!queue.playing) await queue.play();
          }
          addTrack(selectedResult);
		const createembed = async (name, selection, selectedResult) => {
      const res = await client.player.search(selectedResult, {
        requestedBy: int.user,
        searchEngine: QueryType.AUTO
      });
      if (!res || !res.tracks.length) return
      const embed = new EmbedBuilder();
	
	    embed.setColor('BLUE');
  	  embed.setTitle(`Searched Music: "${name}"`);
	
      const description = resultCount===10 ? (((int.message.embeds[0].description).substring(0, ((int.message.embeds[0].description).length)-183))+`Selection stopped because track **${selection+1}** was selected. ✅`) : (((int.message.embeds[0].description).substring(0, ((int.message.embeds[0].description).length)-182))+`Selection stopped because track **${selection+1}** was selected. ✅`)
	    embed.setDescription(description);
	
	    embed.setTimestamp();
	    embed.setFooter({ text: 'Music Bot - by CraftingShadowDE', iconURL: int.user.displayAvatarURL({ dynamic: true }) });
      const ui = [ {type: 1, components: [{style: ButtonStyle.Success, label: `Add it again`, custom_id: `addAgainButton`, disabled: false, type: 2}]} ]
	    int.update({ embeds: [embed], components: ui }).catch(e => { })
     }
    createembed(name, selection, selectedResult);
    } else {
      int.reply({ content: `You are not connected to an audio channel. ❌`, ephemeral: true });
      resetMenu(); 
    }
	  } else {
	  	int.reply({ content: `You aren't allowed to do this because you are not the person that executed the search-command! ❌`, ephemeral: true });
      resetMenu(); 
	  }
   }
   }
}
}
};