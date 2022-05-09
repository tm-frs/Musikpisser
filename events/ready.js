module.exports = async (client) => {
    console.log(`${client.user.username} Login!`);
    console.log('Connected servers: '+client.guilds.cache.size)

    client.user.setActivity(client.config.playing+" || Online on "+client.guilds.cache.size+" servers");
};