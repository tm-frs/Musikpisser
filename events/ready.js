module.exports = async (client) => {
    console.log(`${client.user.username} Login!`);
    client.user.setActivity(client.config.playing+` || Online on ${client.guilds.cache.size} servers`, {
        type: "LISTENING"
      })
      setInterval(() => {
        client.user.setActivity(client.config.playing+` || Online on ${client.guilds.cache.size} servers`, {
            type: "LISTENING"
          })
      }, 600000)
};