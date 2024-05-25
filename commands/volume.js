const { ApplicationCommandOptionType } = require(`discord.js`);
const maxVol = require(`../config.js`).opt.maxVol;
const initialVolume = require(`../config.js`).opt.discordPlayer.initialVolume;

module.exports = {
	description: `Change the volume of the music`,
	name: `volume`,
	options: [{
		name: `volume`,
		description: `The volume you want to change to (normal/initial volume is ${initialVolume}%)`,
		type: ApplicationCommandOptionType.Number,
		required: true
	}],
	voiceChannel: true,

	run: async (client, interaction) => {
		const queue = client.player.nodes.get(interaction.guild.id);
		if (!queue || !queue.node.isPlaying()) return interaction.reply({ content: `No music currently playing! ❌`, ephemeral: true }).catch((e) => { });

		const vol = interaction.options.getNumber(`volume`);

		if (!vol && vol !== 0) return interaction.reply({ content: `Current volume: **${queue.volume}%** 🔊\n**To change the volume, type a number between \`0\` and \`${maxVol}\`.**`, ephemeral: true }).catch((e) => { });

		if (queue.volume === vol) return interaction.reply({ content: `The volume you want to change to is already the current volume ❌`, ephemeral: true }).catch((e) => { });

		if (vol < 0 || vol > maxVol) return interaction.reply({ content: `**Type a number from \`0\` to \`${maxVol}\` to change the volume .** ❌`, ephemeral: true }).catch((e) => { });

		const success = queue.node.setVolume(vol);

		return interaction.reply({ content: success ? `Volume changed: **${vol}%**/**${maxVol}%** 🔊` : `Something went wrong. ❌` }).catch((e) => { });
	}
};
