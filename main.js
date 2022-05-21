const { Player } = require('discord-player');
const { Client, Intents, Collection } = require('discord.js');
const fs = require('fs');

let client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES
    ],
    disableMentions: 'everyone',
});

client.db = require("orio.db")
client.db.deleteAll()
client.config = require('./config');
client.player = new Player(client, client.config.opt.discordPlayer);
const player = client.player

const synchronizeSlashCommands = require('discord-sync-commands-v14');

console.log(`-> Loading commands...`);
client.commands = new Collection();
fs.readdir("./commands/", (_err, files) => {
    files.forEach((file) => {
        if (!file.endsWith(".js")) return;
        let props = require(`./commands/${file}`);
        let commandName = file.split(".")[0];
        client.commands.set(commandName, {
            name: commandName,
            ...props
        });
        console.log(`${commandName} Command loaded`);
    });
    synchronizeSlashCommands(client, client.commands.map((c) => ({
        name: c.name,
        description: c.description,
        options: c.options,
        type: 'CHAT_INPUT'
    })), {
        debug: false
    });
});

console.log(`-> Loading events...`);
fs.readdir("./events", (_err, files) => {
  files.forEach((file) => {
      if (!file.endsWith(".js")) return;
      const event = require(`./events/${file}`);
      let eventName = file.split(".")[0];
      console.log(`${eventName} Event loaded`);
      client.on(eventName, event.bind(null, client));
      delete require.cache[require.resolve(`./events/${file}`)];
  });
});


player.on('error', (queue, error) => {
    console.log({ content: `There was a problem with the song queue => ${error.message}` }).catch(e => { });
});

player.on('connectionError', (queue, error) => {
    console.log({ content: `I'm having trouble connecting => ${error.message}` }).catch(e => { });
});

player.on('trackStart', (queue, track) => {
    if (!client.config.opt.loopMessage && queue.repeatMode !== 0) return;
    queue.metadata.send({ content: `🎵 Music started playing: **${track.title}** -> Channel: **${queue.connection.channel.name}** 🎧` }).catch(e => { });
});

player.on('trackAdd', (queue, track) => {
    queue.metadata.send({ content: `**${track.title}** has been added to playlist. ✅` }).catch(e => { });
});

player.on('channelEmpty', (queue) => {
    queue.metadata.send({ content: `I left the audio channel because there is no one on my channel. ❌` }).catch(e => { });
});

player.on('queueEnd', (queue) => {
    if(client.config.opt.voiceConfig.leaveOnTimer.status === true) {
        setTimeout(() => {
            if(queue.connection) queue.connection.disconnect();
        }, client.config.opt.voiceConfig.leaveOnTimer.time);
    }
    queue.metadata.send({ content: `All tracks in queue are finished. ✅` }).catch(e => { });
});

const express = require("express");
const app = express();
const http = require("http");
app.get("/", (request, response) => {
  response.sendStatus(200);
});
app.listen('3001');
setInterval(() => {
  http.get(`http://127.0.0.1:3001/`);
}, 60000);

if(client.config.TOKEN){
client.login(client.config.TOKEN).catch(e => {
console.log(`The Bot Token you entered into your bot's config.js-file is incorrect or your bot's INTENTS are OFF!`)
})
} else {
console.log(`Please write your bot token into the TOKEN-field in the config.js-file of your bot!`)
}
