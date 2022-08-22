module.exports = {
    onlineStatus: `dnd`, // the status of the bot (options: "online", "idle", "dnd" (do not desturb), "invisible")
    activityType: `PLAYING`, // the type of the activity (options: "PLAYING", "LISTENING", "WATCHING", "COMPETING", "STREAMING" [if set to something else, 'PLAYING' will be used.])
    activityText: `Music Bot || "/help" for help  || Online on REPLACE-WITH_SERVER-COUNT servers || Logged in: REPLACE-WITH_LOGIN-AT`, //the text of the activity; 'REPLACE-WITH_SERVER-COUNT' will be replaced with the amount of servers the bot has joined and 'REPLACE-WITH_LOGIN-AT' will be replaced with a timestamp of the bot's login time
    logPresenceUpdates: false, // whether or not to show the presence updates in the logs

    opt: {
        playDl: {
            replaceYtdl: true // this will block the option to skip in youtube tracks. if you have problems with the bot lagging and this is disabled, try to enable this (default: true)
        },
        DJ: {
            enabled: false, //IF YOU WANT ONLY DJS TO USE IT, set false to true. If you haven't, a role with the name you specified will be created. There should only be one role with this name.
            alwaysAllowAdmins: true, //If this is set to true, everyone with the "Manage Guild"-permission can use it without the role
            roleName: 'Musikpisser Permissions', //WRITE WHAT THE NAME OF THE DJ ROLE WILL BE, THEY CAN USE IT ON YOUR SERVER
            notAffected: ['help','ping','crash','play-dl','nowplaying','queue','time'], //This are commands everyone can run, even if they don't have the role
            affectedButtonsAndMenus: ['cancelButton','addAgainButton','trackMenu'] //These buttons/menus can't be used without the role
        },
        voiceConfig: {
            leaveOnEnd: true, //If this variable is "true", the bot will leave the channel when the music ends.
            autoSelfDeaf: true, //IF YOU WANT TO DEAF THE BOT, set this to true.

            leaveOnTimer:{ //The leaveOnEnd variable must be "false" to use this system.
                status: false, //If this variable is "true", the bot will leave the channel when the bot is offline.
                time: 10000, //1000 = 1 second
            }
        },
        maxVol: 100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000, //You can specify the maximum volume level.
        loopMessage: false, //Please don't touch
        discordPlayer: {
            initialVolume: 100, //the initial volume (100 is default)
            volumeSmoothness: 0, //the volume transition smoothness between volume changes (lower the value to make it smoother; 0 to disable; default is 0.08, but i hate this and /autoadd has some problems if not 0)
            ytdlOptions: {
                quality: 'highestaudio', //Please don't touch
                highWaterMark: 1 << 25 //Please don't touch
            }
        }, // add your filter here (just paste the title of the forbidden song(s) here):
      blacklist: [''],
      adminperms: ['USERNAME#XXXX'] // write the Username of the user(s) that is/are allowed to use admin commands (crash the bot with the crash command, for example)
    }
};
