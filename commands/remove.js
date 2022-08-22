const { QueueRepeatMode } = require('discord-player');

module.exports = {
    description: "Skips the current track and removes it from queue.",
    name: 'remove',
    options: [],
    voiceChannel: true,

    run: async (client, interaction) => {
        const queue = client.player.getQueue(interaction.guild.id);
 
        if (!queue || !queue.playing) return interaction.reply({ content: `No music currently playing! ❌`, ephemeral: true }).catch(e => { });
        if (!queue.tracks[0] && !(queue.repeatMode===3)) return interaction.reply({ content: `No music in queue after current so this would stop the music ❌`, ephemeral: true }).catch(e => { });
      
      if (queue.repeatMode===1){ //----------------------------------------------------------------QUEUE REPEAT MODE = TRACK
        queue.setRepeatMode(QueueRepeatMode.OFF);
        setTimeout(function() {
          const success = queue.skip();
          return interaction.reply({ content: success ? `**${queue.current.title}**, the song currently playing, has been skipped and removed from queue ✅` : `Something went wrong ❌` }).catch(e => { });
        }, 500);
        setTimeout(function() {
          queue.setRepeatMode(QueueRepeatMode.TRACK);
        }, 1000);
      } else if (queue.repeatMode===2){ //---------------------------------------------------------QUEUE REPEAT MODE = QUEUE
        queue.setRepeatMode(QueueRepeatMode.OFF);
        setTimeout(function() {
          const success = queue.skip();
          return interaction.reply({ content: success ? `**${queue.current.title}**, the song currently playing, has been skipped and removed from queue ✅` : `Something went wrong ❌` }).catch(e => { });
        }, 500);
        setTimeout(function() {
          queue.setRepeatMode(QueueRepeatMode.QUEUE);
        }, 1000);
      } else { //----------------------------------------------------------------------------------QUEUE REPEAT MODE = OFF/AUTOPLAY
        const success = queue.skip();
        return interaction.reply({ content: success ? `**${queue.current.title}**, the song currently playing, has been skipped and removed from queue ✅` : `Something went wrong ❌` }).catch(e => { });
      } //-----------------------------------------------------------------------------------------
    },
};