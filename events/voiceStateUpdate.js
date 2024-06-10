const botConfig = require(`../config.js`);
const { Colors } = require(`discord.js`);
const rrm = { config: botConfig.opt.roleRestrictedMode };

module.exports = async (client, oldState, newState) => {
	if (client.user.id === newState.id) {
		newState.guild.roles.botRoleFor(client.user).setColor(Colors.Blue); // blue (≙ blue in role color picker) = 0x3498DB
		if (rrm.config.enabled && newState.guild.roles.cache.some((x) => x.name === rrm.config.roleName)) {
			const rrmRole = await newState.guild.roles.cache.find((x) => x.name === rrm.config.roleName);
			const botGuildMember = await newState.guild.members.me;
			botGuildMember.roles.add(rrmRole);
		}

		if (oldState.channelId && !newState.channelId) {
			const queue = client.player?.nodes.get(newState.guild.id);
			if (queue) {
				queue.metadata.channel.send({ content: `Someone from the audio channel Im connected to kicked me out, the whole playlist has been cleared! ❌` });
				client.player?.deleteQueue(queue.metadata.guild.id);
			}
		}
	}
};
