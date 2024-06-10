const autoaddConfigs = require(`./config-autoadd.js`);

module.exports = {
	onlineStatus: `dnd`, // status of the bot (options: "online", "idle", "dnd" (do not desturb), "invisible")
	activityType: `PLAYING`, // type of activity (options: "PLAYING", "LISTENING", "WATCHING", "COMPETING", "STREAMING" [if set to something else, 'PLAYING' will be used])
	activityText: `Music Bot || "/help" for help  || Online on REPLACE-WITH_SERVER-COUNT servers || Logged in: REPLACE-WITH_LOGIN-AT`, // text of the activity; 'REPLACE-WITH_SERVER-COUNT' will be replaced with the amount of servers the bot has joined and 'REPLACE-WITH_LOGIN-AT' will be replaced with a timestamp of the bot's login time
	logPresenceUpdates: false, // whether or not to show the presence updates in the logs

	defaultPublicIpApi: `api.ipify.org`, // default API to get the public IP from (default: 'api.ipify.org')

	logFileLimit: -1, // limit of log files (-1 or lower for infinite, 0 for none); latest.log will always be updated (default: -1)
	logErrors: true, // whether or not to create an errors.log-file in wich all errors are written in with timestamps; if set to false, the file will be created but not written to (default: true)
	debugLog: false, // whether or not some discord-player debugging messages should be sent to console.log (default: false)

	autoadd: autoaddConfigs, // don't change this, this is the autoadd-config.js-file

	opt: {
		roleRestrictedMode: {
			enabled: false, // if you only want people with a role to use to bot, set this to true. In that case, a role with the name you specified will be created (if there is not already one with that name). There should only be one role with this name.
			alwaysAllowAdmins: true, // if this is set to true, everyone with the "Manage Guild"-permission can use it, even without the role
			roleName: `Musikpisser Permissions`, // specify the name the role should have
			notAffected: [`help`, `ping`, `crash`, `get-ip`, `nowplaying`, `queue`, `time`], // these are commands everyone can use, even if they don't have the role
			affectedButtonsAndMenus: [`searchCancelButton`, `searchAddAgainButton`, `searchTrackMenu`] // these buttons/menus can't be used without the role
		},
		voiceConfig: {
			leaveOnEnd: true, // true ≙ the bot will leave the channel when the music ends
			selfDeaf: true, // true ≙ bot is deaf

			leaveOnTimer: { // leaveOnEnd must be set to "false" to use this system
				status: false, // true ≙ the bot will leave the channel when the bot is offline
				time: 10000 // 1000 ≙ 1 second
			}
		},
		maxVol: 100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000, // maximum volume for volume command (also used for maxvolume command)
		loopMessage: false, // don't change this
		discordPlayer: {
			initialVolume: 100, // initial volume, also used for normalvolume command (100 is default)
			volumeSmoothness: 0, // volume transition smoothness between volume changes (lower the value to make it smoother; 0 to disable; default is 0.08, but autoadd has some problems if not set to 0)
			ytdlOptions: {
				quality: `highestaudio`, // don't change this
				highWaterMark: 1 << 25 // don't change this
			}
		},
		adminperms: [`USERNAME#XXXX`] // write the username of the user(s) that is/are allowed to use admin commands (excluded from rrm-mode, get this bot's ip with a discord-command, crash the bot with the crash command); usernames without discriminator are '[username]#0' instead of '[username]#[discriminator]'
	}
};
