var fs = require('fs');
var logFile = fs.createWriteStream('logins.txt', { flags: 'as+' });
var playDlFile = fs.createWriteStream('play-dl_override.txt', { flags: 'w' });

const writefile = function (file, text) {
  file.write(text);
}

module.exports = async (client) => {
    const configPlayDl = require("../config.js").opt.playDl.replaceYtdl;
    writefile(playDlFile, (""+configPlayDl))

    const logPresenceUpdates = require("../config.js").logPresenceUpdates;
    const unixReadyAt = Math.floor(new Date(client.readyAt).getTime() / 1000);
    const jsReadyAtShort = ((new Date(unixReadyAt * 1000)).toUTCString()).replace("GMT", "(UTC+0)");
    const jsReadyAtLong = ((new Date(unixReadyAt * 1000)).toUTCString()).replace("GMT", "UTC+0000 (Coordinated Universal Time)");
    const loginText = `------------------------LOGIN-INFORMATION------------------------\n${client.user.username} Login! Login at: \n${jsReadyAtLong}\n-----------------------------------------------------------------`;
    writefile(logFile, (`\n${loginText}\n`+'\n'));
    console.log(loginText);
    client.user.accentColor = '#18191C';
  
    const updatePresence = async () => {
      const serverCount = client.guilds.cache.size;
      const status = require("../config.js").onlineStatus;
      const activityTypeConfig = require("../config.js").activityType;
      const activityType = (activityTypeConfig==='PLAYING') ? 0 : (activityTypeConfig==='STREAMING') ? 1 : (activityTypeConfig==='LISTENING') ? 2 : (activityTypeConfig==='WATCHING') ? 3 : (activityTypeConfig==='COMPETING') ? 5 : 0
      const activityText = ((require("../config.js").activityText).replace("REPLACE-WITH_SERVER-COUNT",serverCount)).replace("REPLACE-WITH_LOGIN-AT",jsReadyAtShort);
      client.user.setPresence({
        status: status,
        activities: [{
            name: activityText,
            type: activityType
        }]
      });
      const presenceUpdateTimestring = (new Date(Date.now()).toUTCString().replace("GMT", "(UTC+0)"));
      if (logPresenceUpdates) console.log(`The prensence was updated. (${presenceUpdateTimestring})`);
    };

    updatePresence();
      setInterval(() => {
        updatePresence();
      }, 60000)
};