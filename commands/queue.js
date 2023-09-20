const { Colors } = require(`discord.js`);
const { ButtonStyle } = require(`discord.js`);
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require(`discord.js`);
const { SnowflakeUtil } = require(`discord.js`);

module.exports = {

	description: `Shows you the queue.`,
	name: `queue`,
	options: [],
	voiceChannel: true,

	run: async (client, interaction) => {
		const queue = client.player.nodes.get(interaction.guild.id);


		if (!queue || !queue.node.isPlaying()) return interaction.reply({ content: `No music currently playing! ❌`, ephemeral: true }).catch((e) => { }); // eslint-disable-line no-unused-vars

		if (!queue.tracks[0]) return interaction.reply({ content: `No music in queue after current. ❌`, ephemeral: true }).catch((e) => { }); // eslint-disable-line no-unused-vars

		const unixPlayingSince = parseInt((parseInt(SnowflakeUtil.deconstruct(queue.id).timestamp)) / 1000);
		const discordPlayingSince = `<t:${unixPlayingSince}:R> (<t:${unixPlayingSince}:d>, <t:${unixPlayingSince}:T>)`;

		const saveButton = new ButtonBuilder();

		saveButton.setLabel(`Update`);
		saveButton.setCustomId(`queue`);
		saveButton.setStyle(ButtonStyle.Success);

		const row = new ActionRowBuilder().addComponents(saveButton);

		const embed = new EmbedBuilder();
		const options = [`📴 (Loop mode: Off)`, `🔂 (Loop mode: Track)`, `🔁 (Loop mode: Queue)`, `▶ (Loop mode: Autoplay)`];
		const loopMode = options[queue.repeatMode];

		embed.setColor(Colors.Blue); // blue = 0x3498DB
		embed.setThumbnail(interaction.guild.iconURL({ size: 4096, format: `png`, dynamic: true }));
		embed.setTitle(`Server Music List - ${interaction.guild.name} ${loopMode}`);

		const tracks = queue.tracks.map((track, i) => `**${i + 1}**. \`${track.title}\` | by \`${track.author}\` _(Duration: **${track.duration}**)_\n(requested by <@${track.requestedBy.id}>)`);

		const songs = queue.getSize();
		const nextSongs = songs > 5 ? `There ${((songs - 5) !== 1) ? `are` : `is`} **${songs - 5} other song${((songs - 5) !== 1) ? `s` : ``}** in the queue.` : `There are **no other songs** in the queue.`;

		embed.setDescription(`The bot is playing since: *${discordPlayingSince}*.\n\n**Currently Playing:** \`${queue.currentTrack.title}\` | by \`${queue.currentTrack.author}\` _(Duration: **${queue.currentTrack.duration}**)_ (requested by <@${queue.currentTrack.requestedBy.id}>)\n\n${tracks.slice(0, 5).join(`\n`)}\n\n${nextSongs}`);

		embed.setTimestamp();
		embed.setFooter({text: `Music Bot - by CraftingShadowDE`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

		interaction.reply({ embeds: [embed], components: [row]}).catch((e) => { }); // eslint-disable-line no-unused-vars
	}
};
