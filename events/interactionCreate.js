const createQueue = require(`../exports/queue.js`).createQueue;
const { Colors } = require(`discord.js`);
const { InteractionType } = require(`discord.js`);
const { ButtonStyle } = require(`discord.js`);
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require(`discord.js`);
const { QueryType } = require(`discord-player`);
const wait = require(`node:timers/promises`).setTimeout; // eslint-disable-line no-unused-vars
const discordTools = require(`../exports/discordTools.js`);
const { PermissionsBitField } = require(`discord.js`);
const { convertSecondsToString, convertStringToSeconds, reformatString } = require(`../exports/timeStrings.js`); // eslint-disable-line no-unused-vars
const adminperms = require(`../config.js`).opt.adminperms;

const streamToString = async (readable) => { // eslint-disable-line no-unused-vars
	let result = ``;
	for await (const chunk of readable) {
		result += chunk;
	}
	return result;
};

const rrm = {
	config: require(`../config.js`).opt.roleRestrictedMode,
	checkForPermissions: async (interaction) => {
		const rrmRole = interaction.guild.roles.cache.find((x) => x.name === rrm.config.roleName); // role for rrm on the server

		const userIsBotAdmin = adminperms.includes((interaction.member.user.username + `#` + interaction.member.user.discriminator)); // whether the user is a bot admin
		const userHasRole = (interaction.guild.roles.cache.some((x) => x.name === rrm.config.roleName) && interaction.member.roles.cache.some((role) => role.id === rrmRole.id)); // whether the role for rrm exists and the user has that role
		const userIsServerAdmin = (rrm.config.alwaysAllowAdmins && interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)); // whether the user is a server admin (determined by Manage Guild permission)

		return (userIsBotAdmin || userHasRole || userIsServerAdmin); // if one of these is the case, the user shall be allowed to user the bot
	},
	createRole: async (client, interaction) => {
		await interaction.guild.roles.create({ name: rrm.config.roleName, color: Colors.DarkGold, mentionable: true, permissions: [] }); // darkgold = 0xC27C0E

		const rrmRole = await interaction.guild.roles.cache.find((x) => x.name === rrm.config.roleName);
		console.log(`rrm-Role has been created on guild '${interaction.guild.name}' with id ${interaction.guild.id} because rrm-Mode is active and the role did not exist there.`);
		const botGuildMember = await interaction.guild.members.me;
		botGuildMember.roles.add(rrmRole);

		const embed = new EmbedBuilder()
			.setColor(Colors.Red) // red = 0xED4245
			.setTitle(`ANNOUNCEMENT`)
			.setThumbnail(await client.user.displayAvatarURL({ format: `png`, size: 4096 }))
			.setDescription(`A rrm-role has been created because rrm-mode is active and the role was not existing yet. The role is ${rrmRole} and everyone (server admins excluded) needs it to use the bot. (Some commands can still be used by everyone.)`)
			.setTimestamp()
			.setFooter({ text: `Musikpisser Music Bot`, iconURL: await interaction.user.displayAvatarURL({ dynamic: true }) });

		return interaction.channel.send({ content: `INFO: ${rrmRole} has been created.`, embeds: [embed] }).catch((e) => { });
	},
	sendReplyNotAllowed: async (client, interaction) => {
		const rrmRole = await interaction.guild.roles.cache.find((x) => x.name === rrm.config.roleName);
		const embed = new EmbedBuilder()
			.setColor(Colors.Blue) // blue = 0x3498DB
			.setTitle(await client.user.username)
			.setThumbnail(await client.user.displayAvatarURL({ format: `png`, size: 4096 }))
			.setDescription(`You can't use this command because only those with the ${rrmRole} role and server admins can. ❌`)
			.setTimestamp()
			.setFooter({ text: `Musikpisser Music Bot`, iconURL: await interaction.user.displayAvatarURL({ dynamic: true }) });

		return interaction.reply({ embeds: [embed], ephemeral: true }).catch((e) => { });
	}
};

module.exports = async (client, interaction) => {
	if (!interaction.guild) return interaction.reply({ content: `Commands can only be used on servers. ❌`, ephemeral: true });

	const botvoicechannel = interaction.guild.members.cache.find((user) => user.id === client.user.id).voice.channel;
	const othervoicechannel = (botvoicechannel && interaction.member.voice.channel.id !== botvoicechannel.id);

	if (interaction.type === InteractionType.ApplicationCommand) {
		const cmd = client.commands.get(interaction.commandName);

		if (!cmd) return void interaction.reply({
			content: `Command \`${interaction.commandName}\` not found.`,
			ephemeral: true
		});


		if (cmd && rrm.config.enabled && !rrm.config.notAffected.includes(cmd.name)) {
			if (!interaction.guild.roles.cache.some((x) => x.name === rrm.config.roleName)) {
				rrm.createRole(client, interaction);

				setTimeout(function() {
					if (!rrm.checkForPermissions(interaction)) {
						return rrm.sendReplyNotAllowed(client, interaction);
					}
				}, 1001);
			} else if (!rrm.checkForPermissions(interaction)) {
				rrm.sendReplyNotAllowed(client, interaction);
			}
		}

		if (cmd && cmd.voiceChannel) {
			if (!interaction.member.voice.channel) return interaction.reply({ content: `You are not connected to an audio channel. ❌`, ephemeral: true });
			//        console.log(client.user.id)
			//        console.log(botvoicechannel)
			if (othervoicechannel) return interaction.reply({ content: `You are not on the same audio channel as me. ❌`, ephemeral: true });
			// old version:        if (int.guild.me.voice.channel && int.member.voice.channel.id !== int.guild.me.voice.channel.id) return int.reply({ content: `You are not on the same audio channel as me. ❌`, ephemeral: true });
		}

		const rrmOnAndAffectedAndPermission = (rrm.config.enabled && !rrm.config.notAffected.includes(cmd.name) && rrm.checkForPermissions(interaction));
		const rrmOnAndNotAffected = (rrm.config.enabled && rrm.config.notAffected.includes(cmd.name));
		if (!rrm.config.enabled || rrmOnAndAffectedAndPermission || rrmOnAndNotAffected) cmd.run(client, interaction);
	}

	if (interaction.type === InteractionType.MessageComponent) {
		if (!interaction.guild.roles.cache.some((x) => x.name === rrm.config.roleName) && rrm.config.enabled) rrm.createRole(client, interaction);
		if (rrm.config.enabled && rrm.config.affectedButtonsAndMenus.includes(interaction.customId) && !rrm.checkForPermissions(interaction)) { // if rrm active AND interaction affected AND no permission
			rrm.sendReplyNotAllowed(client, interaction);
		} else {
			const queue = client.player.nodes.get(interaction.guildId);
			switch (interaction.customId) {
				case `ping`: {
					const start = Date.now();
					interaction.message.edit({ content: `Please wait...`, embeds: [], components: [] }).catch((e) => { })
						.then(async () => {
							let last = Date.now();

							const updateButton = new ButtonBuilder();
							updateButton.setLabel(`Update`);
							updateButton.setCustomId(`ping`);
							updateButton.setStyle(ButtonStyle.Success);
							const row = new ActionRowBuilder().addComponents(updateButton);

							const embed = new EmbedBuilder()
								.setColor(Colors.Blue) // blue = 0x3498DB
								.setTitle(client.user.username + ` - Current Ping`)
								.setThumbnail(client.user.displayAvatarURL({ format: `png`, size: 4096 }))
								.addFields([{ name: `Message Latency (time till a message arrives):`, value: `\`${last - start}ms\` 🛰️` },
									{ name: `API Latency (time the API needs to do things):`, value: `\`${Math.round(client.ws.ping)}ms\` 🛰️` }])
								.setTimestamp()
								.setFooter({ text: `Musikpisser Music Bot`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });
							interaction.message.edit({ content: null, embeds: [embed], components: [row] }).catch((e) => { });
							interaction.reply({ content: `**Success:** Ping data updated. ✅`, ephemeral: true }).catch((e) => { });
						});
				}
					break;
				case `saveTrack`: {
					const description = interaction.message.embeds[0].description + `\n**Saved at this server:** \`` + interaction.guild.name + `\``;
					const embed = new EmbedBuilder()
						.setColor(Colors.Green) // green = 0x57F287
						.setTitle(client.user.username + ` - Saved Track`)
						.setThumbnail(client.user.displayAvatarURL({ format: `png`, size: 4096 }))
						.setDescription(description)
						.setTimestamp()
						.setFooter({ text: `Musikpisser Music Bot`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });
					interaction.member.send({ embeds: [embed] }).then(() => {
						return interaction.reply({ content: `I sent you the name of the music in a private message ✅`, ephemeral: true }).catch((e) => { });
					})
						.catch((error) => { // eslint-disable-line no-unused-vars
							return interaction.reply({ content: `I can't send you a private message. ❌`, ephemeral: true }).catch((e) => { });
						});
				}
					break;
				case `nowplaying`: {
					if (interaction.user.id === interaction.message.interaction.user.id) {
						if (!queue || !queue.node.isPlaying()) return interaction.reply({ content: `No music currently playing! ❌`, ephemeral: true }).catch((e) => { });

						const track = queue.currentTrack;

						const embed = new EmbedBuilder();

						embed.setColor(Colors.Blue); // blue = 0x3498DB
						embed.setThumbnail(track.thumbnail);
						embed.setTitle(`Currently playing track:`);

						const options = [`📴 (Loop mode: Off)`, `🔂 (Loop mode: Track)`, `🔁 (Loop mode: Queue)`, `▶ (Loop mode: Autoplay)`];
						const loopMode = options[queue.repeatMode];

						const timestamp = queue.node.getTimestamp();
						const trackDuration = timestamp.progress === `Forever` ? `Endless (Live)` : reformatString(track.duration);
						const playlist = (typeof track.playlist === `undefined`) ? (`**Playlist:** \`none\``) : (`**Playlist:** [${track.playlist.title}](${track.playlist.url}) by \`${track.playlist.author.name}\``);

						embed.setDescription(`**Title:** \`${track.title}\`\n**Author:** \`${track.author}\`\n**URL:** ${track.url}\n${playlist}\n**Duration:** \`${trackDuration}\`\n**Loop Mode:** \`${loopMode}\`\n**Audio:** \`${queue.node.volume}%\`\n**Track added by:** ${track.requestedBy}`);

						embed.setTimestamp();
						embed.setFooter({ text: `Musikpisser Music Bot`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

						const updateButton = new ButtonBuilder();
						updateButton.setLabel(`Update`);
						updateButton.setCustomId(`nowplaying`);
						updateButton.setStyle(ButtonStyle.Success);

						const saveButton = new ButtonBuilder();
						saveButton.setLabel(`Save Song`);
						saveButton.setCustomId(`saveTrack`);
						saveButton.setStyle(ButtonStyle.Success);

						const row = new ActionRowBuilder()
							.addComponents(updateButton)
							.addComponents(saveButton);

						interaction.message.edit({ embeds: [embed], components: [row] }).catch((e) => { });
						interaction.reply({ content: `**Success:** Nowplaying data updated. ✅`, ephemeral: true }).catch((e) => { });
					} else {
						interaction.reply({ content: `You aren't allowed to do this because you are not the person that executed the nowplaying-command! ❌`, ephemeral: true });
					}
				}
					break;
				case `time`: {
					if (!queue || !queue.node.isPlaying()) return interaction.reply({ content: `No music currently playing! ❌`, ephemeral: true }).catch((e) => { });

					const progress = queue.node.createProgressBar();
					const timestamp = queue.node.getTimestamp();

					const unixPlayingSince = Math.round((Date.now() - queue.node.streamTime) / 1000);
					const discordPlayingSince = `<t:${unixPlayingSince}:R> (<t:${unixPlayingSince}:d>, <t:${unixPlayingSince}:T>)`;
					const playingDuraionString = convertSecondsToString(Math.round(queue.node.streamTime / 1000));

					if (timestamp.progress === `Infinity`) return interaction.reply({ content: `This song is live streaming, no duration data to display. 🎧`, ephemeral: true }).catch((e) => { });

					const saveButton = new ButtonBuilder();

					saveButton.setLabel(`Update`);
					saveButton.setCustomId(`time`);
					saveButton.setStyle(ButtonStyle.Success);

					const row = new ActionRowBuilder().addComponents(saveButton);

					const embed = new EmbedBuilder()
						.setColor(Colors.Blue) // blue = 0x3498DB
						.setTitle(queue.currentTrack.title)
						.setThumbnail(queue.currentTrack.thumbnail)
						.setTimestamp()
						.setDescription(`${progress} \nThe track is finished by **${timestamp.progress}%**.\nCurrent session playtime: **${playingDuraionString}**\n*(playing since: ${discordPlayingSince})*`)
						.setFooter({ text: `Musikpisser Music Bot️`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

					interaction.message.edit({ embeds: [embed], components: [row] }).catch((e) => { });
					interaction.reply({ content: `**Success:** Time data updated. ✅`, ephemeral: true }).catch((e) => { });
				}
					break;
				case `queue`: {
					if (!queue || !queue.node.isPlaying()) {
						return interaction.reply({ content: `No music currently playing. ❌`, ephemeral: true, components: [] });
					} else if (!queue.tracks.data[0]) {
						return interaction.reply({ content: `No music in queue after current. ❌`, ephemeral: true }).catch((e) => { });
					} else {
						const unixPlayingSince = Math.round((Date.now() - queue.node.streamTime) / 1000);
						const discordPlayingSince = `<t:${unixPlayingSince}:R> (<t:${unixPlayingSince}:d>, <t:${unixPlayingSince}:T>)`;
						const playingDuraionString = convertSecondsToString(Math.round(queue.node.streamTime / 1000));

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

						const tracks = queue.tracks.data.map((track, i) => `**${i + 1}**. \`${track.title}\` | by \`${track.author}\` _(Duration: **${reformatString(track.duration)}**)_\n(requested by <@${track.requestedBy.id}>)`);

						const songs = queue.getSize();
						const nextSongs = songs > 5 ? `There ${((songs - 5) !== 1) ? `are` : `is`} **${songs - 5} other song${((songs - 5) !== 1) ? `s` : ``}** in the queue.` : `There are **no other songs** in the queue.`;

						embed.setDescription(`Current session playtime: **${playingDuraionString}**\n*(playing since: ${discordPlayingSince})*\nDuration of the entire queue: **${convertSecondsToString(Math.round(queue.estimatedDuration / 1000))}**\n\n**Currently Playing:** \`${queue.currentTrack.title}\` | by \`${queue.currentTrack.author}\` _(Duration: **${reformatString(queue.currentTrack.duration)}**)_ (requested by <@${queue.currentTrack.requestedBy.id}>)\n\n${tracks.slice(0, 5).join(`\n`)}\n\n${nextSongs}`);

						embed.setTimestamp();
						embed.setFooter({text: `Musikpisser Music Bot`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

						interaction.message.edit({ embeds: [embed], row: [row] }).catch((e) => { });
						interaction.reply({ content: `**Success:** Queue data updated. ✅`, ephemeral: true }).catch((e) => { });
					}
				}
					break;
				case `cancelButton`: {
					const name = ((interaction.message.embeds[0].title).substr(17, ((interaction.message.embeds[0].title).length) - 18));

					if (interaction.user.id === interaction.message.interaction.user.id) {
						const createembed = async (name) => {
							const embed = new EmbedBuilder();

							embed.setColor(Colors.Blue); // blue = 0x3498DB
							embed.setTitle(`Searched Music: "${name}"`);

							const description = ((interaction.message.embeds[0].description).substring(0, ((interaction.message.embeds[0].description).length) - 183)) + `Selection cancelled because the cancel-button was pressed! ❌`;
							embed.setDescription(description);

							embed.setTimestamp();
							embed.setFooter({ text: `Musikpisser Music Bot`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

							interaction.update({ embeds: [embed], components: [] }).catch((e) => { });
						};
						createembed(name);
					} else {
						interaction.reply({ content: `You aren't allowed to do this because you are not the person that executed the search-command! ❌`, ephemeral: true });
					}
				}
					break;
				case `addAgainButton`: {
					await interaction.deferReply();

					if (othervoicechannel) return discordTools.reReply(interaction, `There was an issue! ❌`, { content: `You are not on the same audio channel as me. ❌`, ephemeral: true });

					const selection = parseInt(((interaction.message.embeds[0].description).substr(-20, 2)).replace(`*`, ``)) - 1;
					const resultArray = (interaction.message.embeds[0].description).split(`\n`);
					const resultCount = (resultArray.length - 2) / 2;
					const resultURLs = (() => {
						switch (resultCount) {
							case 1: return [(resultArray[1].substr(31, ((resultArray[1]).length) - 33))];
							case 2: return [(resultArray[1].substr(31, ((resultArray[1]).length) - 33)), (resultArray[3].substr(31, ((resultArray[3]).length) - 33))];
							case 3: return [(resultArray[1].substr(31, ((resultArray[1]).length) - 33)), (resultArray[3].substr(31, ((resultArray[3]).length) - 33)), (resultArray[5].substr(31, ((resultArray[5]).length) - 33))];
							case 4: return [(resultArray[1].substr(31, ((resultArray[1]).length) - 33)), (resultArray[3].substr(31, ((resultArray[3]).length) - 33)), (resultArray[5].substr(31, ((resultArray[5]).length) - 33)), (resultArray[7].substr(31, ((resultArray[7]).length) - 33))];
							case 5: return [(resultArray[1].substr(31, ((resultArray[1]).length) - 33)), (resultArray[3].substr(31, ((resultArray[3]).length) - 33)), (resultArray[5].substr(31, ((resultArray[5]).length) - 33)), (resultArray[7].substr(31, ((resultArray[7]).length) - 33)), (resultArray[9].substr(31, ((resultArray[9]).length) - 33))];
							case 6: return [(resultArray[1].substr(31, ((resultArray[1]).length) - 33)), (resultArray[3].substr(31, ((resultArray[3]).length) - 33)), (resultArray[5].substr(31, ((resultArray[5]).length) - 33)), (resultArray[7].substr(31, ((resultArray[7]).length) - 33)), (resultArray[9].substr(31, ((resultArray[9]).length) - 33)), (resultArray[11].substr(31, ((resultArray[11]).length) - 33))];
							case 7: return [(resultArray[1].substr(31, ((resultArray[1]).length) - 33)), (resultArray[3].substr(31, ((resultArray[3]).length) - 33)), (resultArray[5].substr(31, ((resultArray[5]).length) - 33)), (resultArray[7].substr(31, ((resultArray[7]).length) - 33)), (resultArray[9].substr(31, ((resultArray[9]).length) - 33)), (resultArray[11].substr(31, ((resultArray[11]).length) - 33)), (resultArray[13].substr(31, ((resultArray[13]).length) - 33))];
							case 8: return [(resultArray[1].substr(31, ((resultArray[1]).length) - 33)), (resultArray[3].substr(31, ((resultArray[3]).length) - 33)), (resultArray[5].substr(31, ((resultArray[5]).length) - 33)), (resultArray[7].substr(31, ((resultArray[7]).length) - 33)), (resultArray[9].substr(31, ((resultArray[9]).length) - 33)), (resultArray[11].substr(31, ((resultArray[11]).length) - 33)), (resultArray[13].substr(31, ((resultArray[13]).length) - 33)), (resultArray[15].substr(31, ((resultArray[15]).length) - 33))];
							case 9: return [(resultArray[1].substr(31, ((resultArray[1]).length) - 33)), (resultArray[3].substr(31, ((resultArray[3]).length) - 33)), (resultArray[5].substr(31, ((resultArray[5]).length) - 33)), (resultArray[7].substr(31, ((resultArray[7]).length) - 33)), (resultArray[9].substr(31, ((resultArray[9]).length) - 33)), (resultArray[11].substr(31, ((resultArray[11]).length) - 33)), (resultArray[13].substr(31, ((resultArray[13]).length) - 33)), (resultArray[15].substr(31, ((resultArray[15]).length) - 33)), (resultArray[17].substr(31, ((resultArray[17]).length) - 33))];
							case 10: return [(resultArray[1].substr(31, ((resultArray[1]).length) - 33)), (resultArray[3].substr(31, ((resultArray[3]).length) - 33)), (resultArray[5].substr(31, ((resultArray[5]).length) - 33)), (resultArray[7].substr(31, ((resultArray[7]).length) - 33)), (resultArray[9].substr(31, ((resultArray[9]).length) - 33)), (resultArray[11].substr(31, ((resultArray[11]).length) - 33)), (resultArray[13].substr(31, ((resultArray[13]).length) - 33)), (resultArray[15].substr(31, ((resultArray[15]).length) - 33)), (resultArray[17].substr(31, ((resultArray[17]).length) - 33)), (resultArray[19].substr(31, ((resultArray[19]).length) - 33))];
							default: return [];
						}
					})();
					const selectedResult = resultURLs[selection];
					if (!interaction.member.voice.channel) return discordTools.reReply(interaction, `There was an issue! ❌`, { content: `You are not connected to an audio channel. ❌`, ephemeral: true });
					const addTrack = async (selectedResult) => {
						const queue = await createQueue(client, interaction);
						const res = await client.player.search(selectedResult, {
							requestedBy: interaction.user,
							searchEngine: QueryType.AUTO
						});
						try {
							if (!queue.connection) await queue.connect(interaction.member.voice.channel);
						} catch {
							await client.player.deleteQueue(interaction.guildId);
							return discordTools.reReply(interaction, { content: `${interaction.user}, I can't join the audio channel. ❌`, ephemeral: true });
						}
						if (!res || !res.tracks.length) return discordTools.reReply(interaction, `There was an issue! ❌`, { content: `${interaction.user}, No search result was found. ❌\nWas the /search executed a long time ago? If so, that might be the reason.\nYou could try another option.`, ephemeral: true });
						await interaction.editReply({ content: `${interaction.user}, **Track ${selection + 1}** is loading again... 🎧` }).catch((e) => { });

						queue.addTrack(res.tracks[0]); // add music to queue

						if (!queue.node.isPlaying()) await queue.node.play();
					};
					addTrack(selectedResult);

					const uiDisabled = [{ type: 1, components: [{ style: ButtonStyle.Success, label: `Add it again`, custom_id: `addAgainButton`, disabled: true, type: 2 }] }]; // eslint-disable-line camelcase
					interaction.message.edit({ components: uiDisabled }).catch((e) => { });

					setTimeout(function() {
						const uiEnabled = [{ type: 1, components: [{ style: ButtonStyle.Success, label: `Add it again`, custom_id: `addAgainButton`, disabled: false, type: 2 }] }]; // eslint-disable-line camelcase
						interaction.message.edit({ components: uiEnabled }).catch((e) => { });
					}, 30000);
				}
					break;
				case `trackMenu`: {
					await interaction.deferReply();

					if (othervoicechannel) return discordTools.reReply(interaction, `There was an issue! ❌`, { content: `You are not on the same audio channel as me. ❌`, ephemeral: true });

					const chosenTrack = interaction.values[0];
					const selection = (() => {
						switch (chosenTrack) {
							case `t1`: return 0;
							case `t2`: return 1;
							case `t3`: return 2;
							case `t4`: return 3;
							case `t5`: return 4;
							case `t6`: return 5;
							case `t7`: return 6;
							case `t8`: return 7;
							case `t9`: return 8;
							case `t10`: return 9;
							default: return `error`;
						}
					})();
					const name = ((interaction.message.embeds[0].title).substr(17, ((interaction.message.embeds[0].title).length) - 18));
					const resultArray = (interaction.message.embeds[0].description).split(`\n`);
					const resultCount = (resultArray.length - 2) / 2;
					const resultURLs = (() => {
						switch (resultCount) {
							case 1: return [(resultArray[1].substr(31, ((resultArray[1]).length) - 33))];
							case 2: return [(resultArray[1].substr(31, ((resultArray[1]).length) - 33)), (resultArray[3].substr(31, ((resultArray[3]).length) - 33))];
							case 3: return [(resultArray[1].substr(31, ((resultArray[1]).length) - 33)), (resultArray[3].substr(31, ((resultArray[3]).length) - 33)), (resultArray[5].substr(31, ((resultArray[5]).length) - 33))];
							case 4: return [(resultArray[1].substr(31, ((resultArray[1]).length) - 33)), (resultArray[3].substr(31, ((resultArray[3]).length) - 33)), (resultArray[5].substr(31, ((resultArray[5]).length) - 33)), (resultArray[7].substr(31, ((resultArray[7]).length) - 33))];
							case 5: return [(resultArray[1].substr(31, ((resultArray[1]).length) - 33)), (resultArray[3].substr(31, ((resultArray[3]).length) - 33)), (resultArray[5].substr(31, ((resultArray[5]).length) - 33)), (resultArray[7].substr(31, ((resultArray[7]).length) - 33)), (resultArray[9].substr(31, ((resultArray[9]).length) - 33))];
							case 6: return [(resultArray[1].substr(31, ((resultArray[1]).length) - 33)), (resultArray[3].substr(31, ((resultArray[3]).length) - 33)), (resultArray[5].substr(31, ((resultArray[5]).length) - 33)), (resultArray[7].substr(31, ((resultArray[7]).length) - 33)), (resultArray[9].substr(31, ((resultArray[9]).length) - 33)), (resultArray[11].substr(31, ((resultArray[11]).length) - 33))];
							case 7: return [(resultArray[1].substr(31, ((resultArray[1]).length) - 33)), (resultArray[3].substr(31, ((resultArray[3]).length) - 33)), (resultArray[5].substr(31, ((resultArray[5]).length) - 33)), (resultArray[7].substr(31, ((resultArray[7]).length) - 33)), (resultArray[9].substr(31, ((resultArray[9]).length) - 33)), (resultArray[11].substr(31, ((resultArray[11]).length) - 33)), (resultArray[13].substr(31, ((resultArray[13]).length) - 33))];
							case 8: return [(resultArray[1].substr(31, ((resultArray[1]).length) - 33)), (resultArray[3].substr(31, ((resultArray[3]).length) - 33)), (resultArray[5].substr(31, ((resultArray[5]).length) - 33)), (resultArray[7].substr(31, ((resultArray[7]).length) - 33)), (resultArray[9].substr(31, ((resultArray[9]).length) - 33)), (resultArray[11].substr(31, ((resultArray[11]).length) - 33)), (resultArray[13].substr(31, ((resultArray[13]).length) - 33)), (resultArray[15].substr(31, ((resultArray[15]).length) - 33))];
							case 9: return [(resultArray[1].substr(31, ((resultArray[1]).length) - 33)), (resultArray[3].substr(31, ((resultArray[3]).length) - 33)), (resultArray[5].substr(31, ((resultArray[5]).length) - 33)), (resultArray[7].substr(31, ((resultArray[7]).length) - 33)), (resultArray[9].substr(31, ((resultArray[9]).length) - 33)), (resultArray[11].substr(31, ((resultArray[11]).length) - 33)), (resultArray[13].substr(31, ((resultArray[13]).length) - 33)), (resultArray[15].substr(31, ((resultArray[15]).length) - 33)), (resultArray[17].substr(31, ((resultArray[17]).length) - 33))];
							case 10: return [(resultArray[1].substr(31, ((resultArray[1]).length) - 33)), (resultArray[3].substr(31, ((resultArray[3]).length) - 33)), (resultArray[5].substr(31, ((resultArray[5]).length) - 33)), (resultArray[7].substr(31, ((resultArray[7]).length) - 33)), (resultArray[9].substr(31, ((resultArray[9]).length) - 33)), (resultArray[11].substr(31, ((resultArray[11]).length) - 33)), (resultArray[13].substr(31, ((resultArray[13]).length) - 33)), (resultArray[15].substr(31, ((resultArray[15]).length) - 33)), (resultArray[17].substr(31, ((resultArray[17]).length) - 33)), (resultArray[19].substr(31, ((resultArray[19]).length) - 33))];
							default: return [];
						}
					})();
					const selectedResult = resultURLs[selection];

					const interactionComponents = interaction.message.components;

					const resetMenu = async () => {
						await interaction.message.edit({ components: [] });
						await interaction.message.edit({ components: interactionComponents });
					};

					if (interaction.user.id === interaction.message.interaction.user.id) {
						if (interaction.member.voice.channel) {
							const addTrack = async (selectedResult) => {
								const queue = await createQueue(client, interaction);
								const res = await client.player.search(selectedResult, {
									requestedBy: interaction.user,
									searchEngine: QueryType.AUTO
								});
								try {
									if (!queue.connection) await queue.connect(interaction.member.voice.channel);
								} catch {
									await client.player.deleteQueue(interaction.guildId);
									return discordTools.reReply(interaction, `There was an issue! ❌`, { content: `${interaction.user}, I can't join the audio channel. ❌`, ephemeral: true });
								}
								if (!res || !res.tracks.length) return discordTools.reReply(interaction, `There was an issue! ❌`, { content: `${interaction.user}, No search result was found. ❌\nWas the /search executed a long time ago? If so, that might be the reason.\nYou could try another option.`, ephemeral: true });
								await interaction.editReply({ content: `${interaction.user}, Your chosen track is loading now... 🎧` }).catch((e) => { });

								queue.addTrack(res.tracks[0]); // add music to queue

								if (!queue.node.isPlaying()) await queue.node.play();
							};
							addTrack(selectedResult);
							const createembed = async (name, selection, selectedResult) => {
								const res = await client.player.search(selectedResult, {
									requestedBy: interaction.user,
									searchEngine: QueryType.AUTO
								});
								if (!res || !res.tracks.length) return;
								const embed = new EmbedBuilder();

								embed.setColor(Colors.Blue); // blue = 0x3498DB
								embed.setTitle(`Searched Music: "${name}"`);

								const description = resultCount === 10 ? (((interaction.message.embeds[0].description).substring(0, ((interaction.message.embeds[0].description).length) - 183)) + `Selection stopped because track **${selection + 1}** was selected. ✅`) : (((interaction.message.embeds[0].description).substring(0, ((interaction.message.embeds[0].description).length) - 182)) + `Selection stopped because track **${selection + 1}** was selected. ✅`);
								embed.setDescription(description);

								embed.setTimestamp();
								embed.setFooter({ text: `Musikpisser Music Bot`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });
								const ui = [{ type: 1, components: [{ style: ButtonStyle.Success, label: `Add it again`, custom_id: `addAgainButton`, disabled: false, type: 2 }] }]; // eslint-disable-line camelcase
								interaction.message.edit({ embeds: [embed], components: ui }).catch((e) => { });
							};
							createembed(name, selection, selectedResult);
						} else {
							discordTools.reReply(interaction, `There was an issue! ❌`, { content: `You are not connected to an audio channel. ❌`, ephemeral: true });
							resetMenu();
						}
					} else {
						discordTools.reReply(interaction, `There was an issue! ❌`, { content: `You aren't allowed to do this because you are not the person that executed the search-command! ❌`, ephemeral: true });
						resetMenu();
					}
				}
			}
		}
	}
};
