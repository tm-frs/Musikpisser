var fs = require('fs');
var util = require('util');
var logFile = fs.createWriteStream('logins.txt', { flags: 'as+' });

const writefile = function () {
  logFile.write(util.format.apply(null, arguments) + '\n');
}

module.exports = async (client) => {
    const serverCount = client.guilds.cache.size;
    const unixReadyAt = Math.floor(new Date(client.readyAt).getTime() / 1000);
    const jsReadyAtShort = ((new Date(unixReadyAt * 1000)).toUTCString()).replace("GMT", "(UTC+0)");
    const jsReadyAtLong = ((new Date(unixReadyAt * 1000)).toUTCString()).replace("GMT", "UTC+0000 (Coordinated Universal Time)");
    const loginText = `------------------------LOGIN-INFORMATION------------------------\n${client.user.username} Login! Login at: \n${jsReadyAtLong}\n-----------------------------------------------------------------`;
    writefile(`\n${loginText}\n`);
    console.log(loginText);
    client.user.accentColor = '#18191C';
  
    const status = require("../config.js").onlineStatus;
    const activityTypeConfig = require("../config.js").activityType;
    const activityType = (activityTypeConfig==='PLAYING') ? 0 : (activityTypeConfig==='STREAMING') ? 1 : (activityTypeConfig==='LISTENING') ? 2 : (activityTypeConfig==='WATCHING') ? 3 : (activityTypeConfig==='COMPETING') ? 5 : 0
    const activityText = ((require("../config.js").activityText).replace("REPLACE-WITH_SERVER-COUNT",serverCount)).replace("REPLACE-WITH_LOGIN-AT",jsReadyAtShort);
  
    client.user.setPresence({
      status: status,
      activity: {
          name: activityText,
          type: activityType
      }
    });
      setInterval(() => {
        client.user.setPresence({
          status: status,
          activity: {
              name: activityText,
              type: activityType
          }
        });
      }, 60000)
};