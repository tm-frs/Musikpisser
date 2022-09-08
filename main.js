const configvolumeSmoothness = require("./config.js").opt.volumeSmoothness;
const configinitialVolume = require("./config.js").opt.initialVolume;
require('dotenv').config();
const netTools = require("./netTools.js");
const { Player } = require('discord-player');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const wait = require('node:timers/promises').setTimeout;

let client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates
    ],
    disableMentions: 'everyone',
});

client.db = require("orio.db")
client.db.deleteAll()
client.config = require('./config');
client.player = new Player(client, client.config.opt.discordPlayer, {initialVolume:configinitialVolume, volumeSmoothness:configvolumeSmoothness});
const player = client.player

const synchronizeSlashCommands = require('discord-sync-commands-v14');
const { ApplicationCommandType } = require('discord.js');

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
        type: ApplicationCommandType.ChatInput
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
    queue.metadata.send({ content: `⚠️ There was a problem with the song queue! => Error: **${error.message}**` }).catch(e => { });
    const timestamp = ((new Date(Date.now())).toUTCString()).replace("GMT", "UTC+0000 (Coordinated Universal Time)");
    console.log(`ERROR: ⚠️ There was a problem with the song queue! => Error: "${error.message}" (time: ${timestamp})`);
});

player.on('connectionError', (queue, error) => {
    queue.metadata.send({ content: `⚠️ There was a problem with the connection! => Error: **${error.message}**` }).catch(e => { });
    const timestamp = ((new Date(Date.now())).toUTCString()).replace("GMT", "UTC+0000 (Coordinated Universal Time)");
    console.log(`ERROR: ⚠️ There was a problem with the connection! => Error: "${error.message}" (time: ${timestamp})`);
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
const AppIp = (`http://127.0.0.1:`+(netTools.getPort())+`/`)
app.get("/", (request, response) => {
  response.sendStatus(200);
});
app.listen(netTools.getPort());
setInterval(() => {
  http.get(AppIp);
}, 60000);
const logIPs = async () => {
    console.log(`App running on: ${AppIp}\nPublic IP: ${await netTools.getPublicIp()}\nPrivate IP: ${await netTools.getPrivateIp()}`);
}
logIPs();

const botToken = process.env['TOKEN'];
if(botToken){
client.login(botToken).catch(e => {
console.log(`The Bot Token you entered into your bot's .env-file is incorrect or your bot's INTENTS are OFF!`)
})
} else {
console.log(`Please write your bot token into the TOKEN-field in the .env-file of your bot!`)
}
