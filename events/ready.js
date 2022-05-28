module.exports = async (client) => {
    const unixReadyAt = Math.floor(new Date(client.readyAt).getTime() / 1000);
    const jsReadyAt = new Date(unixReadyAt * 1000);
    console.log(`------------------------LOGIN-INFORMATION------------------------\n${client.user.username} Login! Login at: \n${jsReadyAt}\n-----------------------------------------------------------------`);
    client.user.accentColor = '#18191C';
    client.user.setActivity(client.config.playing+` || Online on ${client.guilds.cache.size} servers || Logged in: ${jsReadyAt.toUTCString()}`, {
        type: "PLAYING"
      })
      setInterval(() => {
        client.user.setActivity(client.config.playing+` || Online on ${client.guilds.cache.size} servers`, {
            type: "PLAYING"
          })
      }, 600000)
};