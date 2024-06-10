const botConfig = require(`./config.js`);
require(`dotenv`).config();
const netTools = require(`./exports/netTools.js`);
const { Player } = require(`discord-player`);
const { Client, GatewayIntentBits, Collection } = require(`discord.js`);
const fs = require(`fs`);
const util = require(`util`);
var devnull = require(`dev-null`);
const logFileLimit = botConfig.logFileLimit;
const shouldCreateErrorLogFile = botConfig.logErrors;
const enableDebugMessages = botConfig.debugLog;

if (!fs.existsSync(`./logs`)) {
	fs.mkdirSync(`./logs`);
}

const getLogfileAmount = async () => {
	const files = await fs.promises.readdir(`./logs/`, (err, files) => { // eslint-disable-line no-unused-vars
		if (err) throw err;
	});
	var filesCleared = files.filter((filename) => ((filename !== `latest.log`) && (filename !== `README.txt`) && (filename !== `logins.log`) && (filename !== `errors.log`)));
	return filesCleared.length;
};

fs.unlink(`./logs/latest.log`, (err) => {
	if (err) {
		if (err.code !== `ENOENT`) throw err;
	}
});


let nowDateString = (new Date(Date.now())).toISOString()
	.replace(`T`, `_`)
	.replace(`:`, `-`)
	.replace(`:`, `-`);
nowDateString = nowDateString.substring(0, (nowDateString.length - 5));
var logfileStream = fs.createWriteStream(`./logs/${nowDateString}.log`, { flags: `as+` });
var latestLogfileStream = fs.createWriteStream(`./logs/latest.log`, { flags: `as+` });
var errorLogfileStream = fs.createWriteStream(`./logs/errors.log`, { flags: `as+` });

var logStdout = process.stdout;
var logStderr = process.stderr;

console.log = (...args) => {
	latestLogfileStream.write(util.format.apply(null, args) + `\n`);
	logfileStream.write(util.format.apply(null, args) + `\n`);

	logStdout.write(util.format.apply(null, args) + `\n`);
};
console.error = (...args) => {
	latestLogfileStream.write(`\n\nERROR: ${((new Date(Date.now())).toUTCString())
		.replace(`GMT`, `UTC+0000 (Coordinated Universal Time)`)}\n` + util.format.apply(null, args) + `\n\n`);
	logfileStream.write(`\n\nERROR: ${((new Date(Date.now())).toUTCString())
		.replace(`GMT`, `UTC+0000 (Coordinated Universal Time)`)}\n` + util.format.apply(null, args) + `\n\n`);
	errorLogfileStream.write(`\n\nERROR: ${((new Date(Date.now())).toUTCString())
		.replace(`GMT`, `UTC+0000 (Coordinated Universal Time)`)}\n` + util.format.apply(null, args) + `\n\n`);

	logStderr.write(`\n\nERROR: ${((new Date(Date.now())).toUTCString())
		.replace(`GMT`, `UTC`)}\n` + util.format.apply(null, args) + `\n\n`);
};
process.on(`uncaughtException`, (err) => {
	console.error((err && err.stack) ? err.stack : err);
	setTimeout(() => {
		process.kill(process.pid);
	}, 10000);
});

const maybeUpdateLogFile = async () => {
	const logfilesInFolder = await getLogfileAmount();
	const shouldCreateLogFile = (logFileLimit === -1) ? true : (logfilesInFolder < logFileLimit) ? true : (logfilesInFolder >= logFileLimit) ? false : true;
	if (!shouldCreateLogFile) {
		logfileStream = devnull();
		fs.unlink(`./logs/${nowDateString}.log`, (err) => {
			if (err) {
				if (err.code !== `ENOENT`) throw err;
			}
		});
	}
};
maybeUpdateLogFile();
const maybeUpdateErrorLogFile = async () => {
	if (!shouldCreateErrorLogFile) {
		logfileStream = devnull();
	}
};
maybeUpdateErrorLogFile();

let client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildVoiceStates
	],
	disableMentions: `everyone`
});

client.player = new Player(client, botConfig.opt.discordPlayer, {volume: botConfig.opt.initialVolume, volumeSmoothness: botConfig.opt.volumeSmoothness});
const player = client.player;
player.extractors.loadDefault();

const synchronizeSlashCommands = require(`discord-sync-commands-v14`);
const { ApplicationCommandType } = require(`discord.js`);

console.log(`-> Loading commands...`);
client.commands = new Collection();
fs.readdir(`./commands/`, (_err, files) => {
	files.forEach((file) => {
		if (!file.endsWith(`.js`)) return;
		let props = require(`./commands/${file}`);
		let commandName = file.split(`.`)[0];
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

console.log(`-> Loading message components...`);
client.components = new Collection();
fs.readdir(`./components/`, (_err, files) => {
	files.forEach((file) => {
		if (!file.endsWith(`.js`)) return;
		let props = require(`./components/${file}`);
		let componentName = file.split(`.`)[0];
		client.components.set(componentName, {
			name: componentName,
			...props
		});
		console.log(`${componentName} Component loaded`);
	});
});

console.log(`-> Loading events...`);
fs.readdir(`./events`, (_err, files) => {
	files.forEach((file) => {
		if (!file.endsWith(`.js`)) return;
		const event = require(`./events/${file}`);
		let eventName = file.split(`.`)[0];
		console.log(`${eventName} Event loaded`);
		client.on(eventName, event.bind(null, client));
		delete require.cache[require.resolve(`./events/${file}`)];
	});
});


player.events.on(`error`, (queue, error) => {
	queue.metadata.channel.send({ content: `⚠️ There was a problem with the song queue! => Error: **${error.message}**` }).catch((e) => { });
	const timestamp = ((new Date(Date.now())).toUTCString())
		.replace(`GMT`, `UTC+0000 (Coordinated Universal Time)`);
	console.log(`ERROR: ⚠️ There was a problem with the song queue! => Error: "${error.message}" (time: ${timestamp})`);

	if (error.code === `ABORT_ERR`) {
		console.log(`===> Note to future self: Turning off the VPN (as well as just trying again) has helped fixing "The operation was aborted".`);
	}

	throw error;
});

player.events.on(`playerError`, (queue, error) => {
	queue.metadata.channel.send({ content: `⚠️ There was a problem with the connection! => Error: **${error.message}**` }).catch((e) => { });
	const timestamp = ((new Date(Date.now())).toUTCString())
		.replace(`GMT`, `UTC+0000 (Coordinated Universal Time)`);
	console.log(`ERROR: ⚠️ There was a problem with the connection! => Error: "${error.message}" (time: ${timestamp})`);
});

player.events.on(`playerStart`, (queue, track) => {
	if (!botConfig.opt.loopMessage && queue.repeatMode !== 0) return;
	queue.metadata.channel.send({ content: `🎵 Music started playing: **${track.title}** -> Channel: <#${queue.dispatcher.channel.id}> 🎧` }).catch((e) => { });
});

player.events.on(`audioTrackAdd`, (queue, track) => {
	if (!track.dontSendAddedMessage) queue.metadata.channel.send({ content: `**${track.title}** has been added to playlist. ✅` }).catch((e) => { });
});

player.events.on(`emptyChannel`, (queue) => {
	queue.metadata.channel.send({ content: `I left the audio channel because there was no one on my channel. ❌` }).catch((e) => { });
});

player.events.on(`emptyQueue`, (queue) => {
	if (botConfig.opt.voiceConfig.leaveOnTimer.status === true) {
		setTimeout(() => {
			if (queue.connection) queue.connection.disconnect();
		}, botConfig.opt.voiceConfig.leaveOnTimer.time);
	}
	queue.metadata.channel.send({ content: `All tracks in queue are finished. ✅` }).catch((e) => { });
});

if (enableDebugMessages) {
	// generate dependencies report
	console.log(player.scanDeps());
	// ^------ This is similar to discord-voip's `generateDependenciesReport()` function, but with additional informations related to discord-player

	// log metadata query, search execution, etc.
	player.on(`debug`, console.log);
	// ^------ This shows how your search query is interpreted, if the query was cached, which extractor resolved the query or which extractor failed to resolve, etc.

	// log debug logs of the queue, such as voice connection logs, player execution, streaming process etc.
	player.events.on(`debug`, (queue, message) => console.log(`[DEBUG ${queue.guild.id}] ${message}`));
	// ^------ This shows how queue handles the track. It logs informations like the status of audio player, streaming process, configurations used, if streaming failed or not, etc.
}

const express = require(`express`);
const app = express();
const http = require(`http`);

const AppIp = (`http://127.0.0.1:` + (netTools.getPort()) + `/`);
app.get(`/`, (request, response) => {
	response.sendStatus(200);
});
app.listen(netTools.getPort());
setInterval(() => {
	http.get(AppIp);
}, 60000);
const logIPs = async () => {
	console.log(`App running!\nPublic IP: ${await netTools.getPublicIp()}\nPrivate IP: ${await netTools.getPrivateIp()}:${netTools.getPort()}`);
};
logIPs();

const botToken = process.env[`TOKEN`];
if (botToken) {
	client.login(botToken).catch((e) => {
		console.log(`The Bot Token you entered into your bot's .env-file is incorrect or your bot's INTENTS are OFF!`);
	});
} else {
	console.log(`Please write your bot token into the TOKEN-field in the .env-file of your bot!`);
}
