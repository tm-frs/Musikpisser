var fs = require('fs');
var util = require('util');
var logFile = fs.createWriteStream('logins.txt', { flags: 'as+' });

const writefile = function () {
  logFile.write(util.format.apply(null, arguments) + '\n');
}

module.exports = async (client) => {
    const unixReadyAt = Math.floor(new Date(client.readyAt).getTime() / 1000);
    const jsReadyAtShort = ((new Date(unixReadyAt * 1000)).toUTCString()).replace("GMT", "(UTC+0)");
    const jsReadyAtLong = ((new Date(unixReadyAt * 1000)).toUTCString()).replace("GMT", "UTC+0000 (Coordinated Universal Time)");
    const loginText = `------------------------LOGIN-INFORMATION------------------------\n${client.user.username} Login! Login at: \n${jsReadyAtLong}\n-----------------------------------------------------------------`;
    writefile(`\n${loginText}\n`);
    console.log(loginText);
    client.user.accentColor = '#18191C';
  
    const status = 'online' // the status of the bot (options: "online", "idle", "dnd" (do not desturb), "invisible")
    const activityText = `${client.config.playing} || Online on ${client.guilds.cache.size} servers || Logged in: ${jsReadyAtShort}`; //the text of the activity
    const activityType = 'PLAYING' // the type of the activity (options: "PLAYING", "LISTENING", "WATCHING", "COMPETING", "STREAMING")
    
    client.user.setPresence({
      status: status,
    })
    client.user.setActivity(activityText, {
      type: activityType
    })
      setInterval(() => {
        client.user.setPresence({
          status: status,
        })
        client.user.setActivity(activityText, {
          type: activityType
        })
      }, 600000)
};