var fs = require('fs');
var util = require('util');
var logFile = fs.createWriteStream('logins.txt', { flags: 'as' });

const writefile = function () {
  logFile.write(util.format.apply(null, arguments) + '\n');
}

module.exports = async (client) => {
    const unixReadyAt = Math.floor(new Date(client.readyAt).getTime() / 1000);
    const jsReadyAt = new Date(unixReadyAt * 1000);
    const activityText = `${client.config.playing} || Online on ${client.guilds.cache.size} servers || Logged in: ${jsReadyAt.toUTCString()}`;
    const loginText = `------------------------LOGIN-INFORMATION------------------------\n${client.user.username} Login! Login at: \n${jsReadyAt}\n-----------------------------------------------------------------`;
    writefile(`\n${loginText}\n`);
    console.log(loginText);
    client.user.accentColor = '#18191C';
    client.user.setActivity(activityText, {
        type: "PLAYING"
      })
      setInterval(() => {
        client.user.setActivity(activityText, {
            type: "PLAYING"
          })
      }, 600000)
};