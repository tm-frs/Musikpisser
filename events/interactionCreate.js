const createQueue = require(`../exports/queue.js`).createQueue;
const { Colors } = require(`discord.js`);
const { InteractionType } = require(`discord.js`);
const { ButtonStyle } = require(`discord.js`);
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require(`discord.js`);
const { SnowflakeUtil } = require(`discord.js`);
const { QueryType } = require(`discord-player`);
const wait = require(`node:timers/promises`).setTimeout; // eslint-disable-line no-unused-vars
const discordTools = require(`../exports/discordTools.js`);
const { PermissionsBitField } = require(`discord.js`);

const streamToString = async (readable) => { // eslint-disable-line no-unused-vars
	let result = ``;
	for await (const chunk of readable) {
		result += chunk;
	}
	return result;
};

const createrole = async (client, int, rrm) => {
	await int.guild.roles.create({ name: rrm.roleName, color: `#C27C0E`, mentionable: true, permissions: [] });

	const rrmRole = await int.guild.roles.cache.find((x) => x.name === rrm.roleName);
	console.log(`rrm-Role has been created because rrm-Mode is active and the role is not existing.`);

	const embed = new EmbedBuilder()
		.setColor(Colors.Red) // red = 0xED4245
		.setTitle(`ANNOUNCEMENT`)
		.setThumbnail(await client.user.displayAvatarURL({ format: `png`, size: 4096 }))
		.setDescription(`A rrm-role has been created because rrm-mode is active and the role was not existing yet. The role is ${rrmRole} and everyone needs it to use the bot. (Some commands can still be used by everyone.)`)
		.setTimestamp()
		.setFooter({ text: `Music Bot - by CraftingShadowDE`, iconURL: await int.user.displayAvatarURL({ dynamic: true }) });

	return int.channel.send({ content: `@everyone`, embeds: [embed] }).catch((e) => { }); // eslint-disable-line no-unused-vars
};
const replyNotAllowed = async (client, int, rrm) => {
	const rrmRole = await int.guild.roles.cache.find((x) => x.name === rrm.roleName);
	const embed = new EmbedBuilder()
		.setColor(Colors.Blue) // blue = 0x3498DB
		.setTitle(await client.user.username)
		.setThumbnail(await client.user.displayAvatarURL({ format: `png`, size: 4096 }))
		.setDescription(`You can't use this command because only those with the ${rrmRole} role can. ❌`)
		.setTimestamp()
		.setFooter({ text: `Music Bot - by CraftingShadowDE`, iconURL: await int.user.displayAvatarURL({ dynamic: true }) });

	return int.reply({ embeds: [embed], ephemeral: true }).catch((e) => { }); // eslint-disable-line no-unused-vars
};

module.exports = async (client, int) => {
	if (!int.guild) return int.reply({ content: `You only can use commands on servers. ❌`, ephemeral: true });

	const botvoicechannel = int.guild.members.cache.find((user) => user.id === client.user.id).voice.channel;
	const othervoicechannel = (botvoicechannel && int.member.voice.channel.id !== botvoicechannel.id);

	if (int.type === InteractionType.ApplicationCommand) {
		const cmd = client.commands.get(int.commandName);

		if (!cmd) return void int.reply({
			content: `Command \`${int.commandName}\` not found.`,
			ephemeral: true
		});

		const rrm = client.config.opt.roleRestrictedMode;



		if (cmd && rrm.enabled && !rrm.notAffected.includes(cmd.name)) {
			if (!int.guild.roles.cache.some((x) => x.name === rrm.roleName)) {
				createrole(client, int, rrm);

				setTimeout(function() {
					const rrmRole = int.guild.roles.cache.find((x) => x.name === rrm.roleName);
					const messagecreatorhasrole = (int.guild.roles.cache.some((x) => x.name === rrm.roleName) && int.member.roles.cache.some((role) => role.id === rrmRole.id)) ? true : (rrm.alwaysAllowAdmins && int.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) ? true : false;
					//          console.log("Rolle existent:\n"+int.guild.roles.cache.some(x => x.name === rrm.roleName)+"\nNutzer hat Rolle:\n"+int.member.roles.cache.some(role => role.id === rrmRole.id)+"\nAdmins haben Berechtigung:\n"+rrm.alwaysAllowAdmins+"\nNutzer ist Admin:\n"+int.member.permissions.has(PermissionsBitField.Flags.ManageGuild)+"\nBefund:\n"+messagecreatorhasrole)
					if (!messagecreatorhasrole) {
						return replyNotAllowed(client, int, rrm);
					}
				}, 1001);
			} else {
				const rrmRole = int.guild.roles.cache.find((x) => x.name === rrm.roleName);
				const messagecreatorhasrole = (int.guild.roles.cache.some((x) => x.name === rrm.roleName) && int.member.roles.cache.some((role) => role.id === rrmRole.id)) ? true : (rrm.alwaysAllowAdmins && int.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) ? true : false;
				//      console.log(messagecreatorhasrole);
				//      console.log(rrmRole.id);
				if (!messagecreatorhasrole) {
					replyNotAllowed(client, int, rrm);
				}
			}
		}

		if (cmd && cmd.voiceChannel) {
			if (!int.member.voice.channel) return int.reply({ content: `You are not connected to an audio channel. ❌`, ephemeral: true });
			//        console.log(client.user.id)
			//        console.log(botvoicechannel)
			if (othervoicechannel) return int.reply({ content: `You are not on the same audio channel as me. ❌`, ephemeral: true });
			//old version:        if (int.guild.me.voice.channel && int.member.voice.channel.id !== int.guild.me.voice.channel.id) return int.reply({ content: `You are not on the same audio channel as me. ❌`, ephemeral: true });
		}

		const rrmRole = rrm.enabled ? int.guild.roles.cache.find((x) => x.name === rrm.roleName) : null;
		const rrmOnAndAffectedAndPermission = ((rrm.enabled && !rrm.notAffected.includes(cmd.name)) && ((int.guild.roles.cache.some((x) => x.name === rrm.roleName) && int.member.roles.cache.some((role) => role.id === rrmRole.id)) || (rrm.alwaysAllowAdmins && int.member.permissions.has(PermissionsBitField.Flags.ManageGuild))));
		const rrmOnAndNotAffected = (rrm.enabled && rrm.notAffected.includes(cmd.name));
		const rrmOff = (!rrm.enabled);
		if (rrmOnAndAffectedAndPermission || rrmOnAndNotAffected || rrmOff) cmd.run(client, int);
	}

	if (int.type === InteractionType.MessageComponent) {
		const rrm = client.config.opt.roleRestrictedMode;
		const rrmRole = int.guild.roles.cache.find((x) => x.name === rrm.roleName);
		const userIsAllowed = !rrm.enabled ? true : !rrm.affectedButtonsAndMenus.includes(int.customId) ? true : (int.guild.roles.cache.some((x) => x.name === rrm.roleName) && int.member.roles.cache.some((role) => role.id === rrmRole.id)) ? true : (rrm.alwaysAllowAdmins && int.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) ? true : false;
		if (!int.guild.roles.cache.some((x) => x.name === rrm.roleName) && rrm.enabled) createrole(client, int, rrm);
		if (!userIsAllowed) {
			replyNotAllowed(client, int, rrm);
		} else {
			const queue = client.player.nodes.get(int.guildId);
			switch (int.customId) {
			case `saveTrack`: {
				const description = int.message.embeds[0].description + `\n**Saved at this server:** \`` + int.guild.name + `\``;
				const embed = new EmbedBuilder()
					.setColor(Colors.Green) // green = 0x57F287
					.setTitle(client.user.username + ` - Saved Track`)
					.setThumbnail(client.user.displayAvatarURL({ format: `png`, size: 4096 }))
					.setDescription(description)
					.setTimestamp()
					.setFooter({ text: `Music Bot - by CraftingShadowDE`, iconURL: int.user.displayAvatarURL({ dynamic: true }) });
				int.member.send({ embeds: [embed] }).then(() => {
					return int.reply({ content: `I sent you the name of the music in a private message ✅`, ephemeral: true }).catch((e) => { }); // eslint-disable-line no-unused-vars
				})
					.catch((error) => { // eslint-disable-line no-unused-vars
						return int.reply({ content: `I can't send you a private message. ❌`, ephemeral: true }).catch((e) => { }); // eslint-disable-line no-unused-vars
					});
			}
				break;
			case `nowplaying`: {
				if (int.user.id === int.message.interaction.user.id) {
					const queue = client.player.nodes.get(int.guild.id);

					if (!queue || !queue.node.isPlaying()) return int.reply({ content: `No music currently playing! ❌`, ephemeral: true }).catch((e) => { }); // eslint-disable-line no-unused-vars

					const track = queue.currentTrack;

					const embed = new EmbedBuilder();

					embed.setColor(Colors.Blue); // blue = 0x3498DB
					embed.setThumbnail(track.thumbnail);
					embed.setTitle(`Currently playing track:`);

					const options = [`📴 (Loop mode: Off)`, `🔂 (Loop mode: Track)`, `🔁 (Loop mode: Queue)`, `▶ (Loop mode: Autoplay)`];
					const loopMode = options[queue.repeatMode];

					const timestamp = queue.getPlayerTimestamp();
					const trackDuration = timestamp.progress === `Forever` ? `Endless (Live)` : track.duration;
					const playlist = (typeof track.playlist === `undefined`) ? (`**Playlist:** \`none\``) : (`**Playlist:** [${track.playlist.title}](${track.playlist.url}) by [${track.playlist.author.name}](${track.playlist.author.url})`);

					embed.setDescription(`**Title:** \`${track.title}\`\n**Author:** \`${track.author}\`\n**URL:** ${track.url}\n${playlist}\n**Duration:** \`${trackDuration}\`\n**Loop Mode:** \`${loopMode}\`\n**Audio:** \`${queue.volume}%\`\n**Track added by:** ${track.requestedBy}`);

					embed.setTimestamp();
					embed.setFooter({ text: `Music Bot - by CraftingShadowDE`, iconURL: int.user.displayAvatarURL({ dynamic: true }) });

					const updateButton = new ButtonBuilder();
					updateButton.setLabel(`Update`);
					updateButton.setCustomId(`nowplaying`);
					updateButton.setStyle(ButtonStyle.Success);

					const saveButton = new ButtonBuilder();
					saveButton.setLabel(`Save Song`);
					saveButton.setCustomId(`saveTrack`);
					saveButton.setStyle(ButtonStyle.Success);

					const row = new ActionRowBuilder().addComponents(updateButton)
						.addComponents(saveButton);

					int.message.edit({ embeds: [embed], components: [row] }).catch((e) => { }); // eslint-disable-line no-unused-vars
					int.reply({ content: `**Success:** Nowplaying data updated. ✅`, ephemeral: true }).catch((e) => { }); // eslint-disable-line no-unused-vars
				} else {
					int.reply({ content: `You aren't allowed to do this because you are not the person that executed the nowplaying-command! ❌`, ephemeral: true });
				}
			}
				break;
			case `time`: {
				if (!queue || !queue.node.isPlaying()) {
					return int.reply({ content: `No music currently playing. ❌`, ephemeral: true, components: [] });
				} else {
					const progress = queue.node.createProgressBar();
					const timestamp = queue.getPlayerTimestamp();
					const unixPlayingSince = parseInt((parseInt(SnowflakeUtil.deconstruct(queue.id).timestamp)) / 1000);
					const discordPlayingSince = `<t:${unixPlayingSince}:R> (<t:${unixPlayingSince}:d>, <t:${unixPlayingSince}:T>)`;

					if (timestamp.progress === `Infinity`) return int.message.edit({ content: `This song is live streaming, no duration data to display. 🎧` }).catch((e) => { }); // eslint-disable-line no-unused-vars

					const embed = new EmbedBuilder()
						.setColor(Colors.Blue) // blue = 0x3498DB
						.setTitle(queue.currentTrack.title)
						.setThumbnail(queue.currentTrack.thumbnail)
						.setTimestamp()
						.setDescription(`${progress} \nThe track is finished by **${timestamp.progress}%**.\nThe bot is playing since: *${discordPlayingSince}*.`)
						.setFooter({ text: `Music Bot - by CraftingShadowDE`, iconURL: int.user.displayAvatarURL({ dynamic: true }) });
					int.message.edit({ embeds: [embed] }).catch((e) => { }); // eslint-disable-line no-unused-vars
					int.reply({ content: `**Success:** Time data updated. ✅`, ephemeral: true }).catch((e) => { }); // eslint-disable-line no-unused-vars
				}
			}
				break;
			case `queue`: {
				if (!queue || !queue.node.isPlaying()) {
					return int.reply({ content: `No music currently playing. ❌`, ephemeral: true, components: [] });
				} else if (!queue.tracks[0]) {
					return int.reply({ content: `No music in queue after current. ❌`, ephemeral: true }).catch((e) => { }); // eslint-disable-line no-unused-vars
				} else {
					const unixPlayingSince = parseInt((parseInt(SnowflakeUtil.deconstruct(queue.id).timestamp)) / 1000);
					const discordPlayingSince = `<t:${unixPlayingSince}:R> (<t:${unixPlayingSince}:d>, <t:${unixPlayingSince}:T>)`;

					const embed = new EmbedBuilder();
					const options = [`📴 (Loop mode: Off)`, `🔂 (Loop mode: Track)`, `🔁 (Loop mode: Queue)`, `▶ (Loop mode: Autoplay)`];
					const loopMode = options[queue.repeatMode];

					embed.setColor(Colors.Blue); // blue = 0x3498DB
					embed.setThumbnail(int.guild.iconURL({ size: 4096, format: `png`, dynamic: true }));
					embed.setTitle(`Server Music List - ${int.guild.name} ${loopMode}`);

					const tracks = queue.tracks.map((track, i) => `**${i + 1}**. \`${track.title}\` | by \`${track.author}\` _(Duration: **${track.duration}**)_\n(requested by <@${track.requestedBy.id}>)`);

					const songs = queue.getSize();
					const nextSongs = songs > 5 ? `There ${((songs - 5) !== 1) ? `are` : `is`} **${songs - 5} other song${((songs - 5) !== 1) ? `s` : ``}** in the queue.` : `There are **no other songs** in the queue.`;

					embed.setDescription(`The bot is playing since: *${discordPlayingSince}*.\n\n**Currently Playing:** \`${queue.currentTrack.title}\` | by \`${queue.currentTrack.author}\` _(Duration: **${queue.currentTrack.duration}**)_ (requested by <@${queue.currentTrack.requestedBy.id}>)\n\n${tracks.slice(0, 5).join(`\n`)}\n\n${nextSongs}`);

					embed.setTimestamp();
					embed.setFooter({ text: `Music Bot - by CraftingShadowDE`, iconURL: int.user.displayAvatarURL({ dynamic: true }) });
					int.message.edit({ embeds: [embed] }).catch((e) => { }); // eslint-disable-line no-unused-vars
					int.reply({ content: `**Success:** Queue data updated. ✅`, ephemeral: true }).catch((e) => { }); // eslint-disable-line no-unused-vars
				}
			}
				break;
			case `cancelButton`: {
				const name = ((int.message.embeds[0].title).substr(17, ((int.message.embeds[0].title).length) - 18));

				if (int.user.id === int.message.interaction.user.id) {
					const createembed = async (name) => {
						const embed = new EmbedBuilder();

						embed.setColor(Colors.Blue); // blue = 0x3498DB
						embed.setTitle(`Searched Music: "${name}"`);

						const description = ((int.message.embeds[0].description).substring(0, ((int.message.embeds[0].description).length) - 183)) + `Selection cancelled because the cancel-button was pressed! ❌`;
						embed.setDescription(description);

						embed.setTimestamp();
						embed.setFooter({ text: `Music Bot - by CraftingShadowDE`, iconURL: int.user.displayAvatarURL({ dynamic: true }) });

						int.update({ embeds: [embed], components: [] }).catch((e) => { }); // eslint-disable-line no-unused-vars
					};
					createembed(name);
				} else {
					int.reply({ content: `You aren't allowed to do this because you are not the person that executed the search-command! ❌`, ephemeral: true });
				}
			}
				break;
			case `addAgainButton`: {
				await int.deferReply();

				if (othervoicechannel) return discordTools.reReply(int, `There was an issue! ❌`, { content: `You are not on the same audio channel as me. ❌`, ephemeral: true });

				const selection = parseInt(((int.message.embeds[0].description).substr(-20, 2)).replace(`*`, ``)) - 1;
				const resultArray = (int.message.embeds[0].description).split(`\n`);
				const resultCount = (resultArray.length - 2) / 2;
				const resultURLs = resultCount === 1 ? [(resultArray[1].substr(31, ((resultArray[1]).length) - 33))] : resultCount === 2 ? [(resultArray[1].substr(31, ((resultArray[1]).length) - 33)), (resultArray[3].substr(31, ((resultArray[3]).length) - 33))] : resultCount === 3 ? [(resultArray[1].substr(31, ((resultArray[1]).length) - 33)), (resultArray[3].substr(31, ((resultArray[3]).length) - 33)), (resultArray[5].substr(31, ((resultArray[5]).length) - 33))] : resultCount === 4 ? [(resultArray[1].substr(31, ((resultArray[1]).length) - 33)), (resultArray[3].substr(31, ((resultArray[3]).length) - 33)), (resultArray[5].substr(31, ((resultArray[5]).length) - 33)), (resultArray[7].substr(31, ((resultArray[7]).length) - 33))] : resultCount === 5 ? [(resultArray[1].substr(31, ((resultArray[1]).length) - 33)), (resultArray[3].substr(31, ((resultArray[3]).length) - 33)), (resultArray[5].substr(31, ((resultArray[5]).length) - 33)), (resultArray[7].substr(31, ((resultArray[7]).length) - 33)), (resultArray[9].substr(31, ((resultArray[9]).length) - 33))] : resultCount === 6 ? [(resultArray[1].substr(31, ((resultArray[1]).length) - 33)), (resultArray[3].substr(31, ((resultArray[3]).length) - 33)), (resultArray[5].substr(31, ((resultArray[5]).length) - 33)), (resultArray[7].substr(31, ((resultArray[7]).length) - 33)), (resultArray[9].substr(31, ((resultArray[9]).length) - 33)), (resultArray[11].substr(31, ((resultArray[11]).length) - 33))] : resultCount === 7 ? [(resultArray[1].substr(31, ((resultArray[1]).length) - 33)), (resultArray[3].substr(31, ((resultArray[3]).length) - 33)), (resultArray[5].substr(31, ((resultArray[5]).length) - 33)), (resultArray[7].substr(31, ((resultArray[7]).length) - 33)), (resultArray[9].substr(31, ((resultArray[9]).length) - 33)), (resultArray[11].substr(31, ((resultArray[11]).length) - 33)), (resultArray[13].substr(31, ((resultArray[13]).length) - 33))] : resultCount === 8 ? [(resultArray[1].substr(31, ((resultArray[1]).length) - 33)), (resultArray[3].substr(31, ((resultArray[3]).length) - 33)), (resultArray[5].substr(31, ((resultArray[5]).length) - 33)), (resultArray[7].substr(31, ((resultArray[7]).length) - 33)), (resultArray[9].substr(31, ((resultArray[9]).length) - 33)), (resultArray[11].substr(31, ((resultArray[11]).length) - 33)), (resultArray[13].substr(31, ((resultArray[13]).length) - 33)), (resultArray[15].substr(31, ((resultArray[15]).length) - 33))] : resultCount === 9 ? [(resultArray[1].substr(31, ((resultArray[1]).length) - 33)), (resultArray[3].substr(31, ((resultArray[3]).length) - 33)), (resultArray[5].substr(31, ((resultArray[5]).length) - 33)), (resultArray[7].substr(31, ((resultArray[7]).length) - 33)), (resultArray[9].substr(31, ((resultArray[9]).length) - 33)), (resultArray[11].substr(31, ((resultArray[11]).length) - 33)), (resultArray[13].substr(31, ((resultArray[13]).length) - 33)), (resultArray[15].substr(31, ((resultArray[15]).length) - 33)), (resultArray[17].substr(31, ((resultArray[17]).length) - 33))] : resultCount === 10 ? [(resultArray[1].substr(31, ((resultArray[1]).length) - 33)), (resultArray[3].substr(31, ((resultArray[3]).length) - 33)), (resultArray[5].substr(31, ((resultArray[5]).length) - 33)), (resultArray[7].substr(31, ((resultArray[7]).length) - 33)), (resultArray[9].substr(31, ((resultArray[9]).length) - 33)), (resultArray[11].substr(31, ((resultArray[11]).length) - 33)), (resultArray[13].substr(31, ((resultArray[13]).length) - 33)), (resultArray[15].substr(31, ((resultArray[15]).length) - 33)), (resultArray[17].substr(31, ((resultArray[17]).length) - 33)), (resultArray[19].substr(31, ((resultArray[19]).length) - 33))] : [];
				const selectedResult = resultURLs[selection];
				if (!int.member.voice.channel) return discordTools.reReply(int, `There was an issue! ❌`, { content: `You are not connected to an audio channel. ❌`, ephemeral: true });
				const addTrack = async (selectedResult) => {
					const queue = await createQueue(client, int);
					const res = await client.player.search(selectedResult, {
						requestedBy: int.user,
						searchEngine: QueryType.AUTO
					});
					try {
						if (!queue.connection) await queue.connect(int.member.voice.channel);
					} catch {
						await client.player.deleteQueue(int.guildId);
						return discordTools.reReply(int, { content: `${int.user}, I can't join the audio channel. ❌`, ephemeral: true });
					}
					if (!res || !res.tracks.length) return discordTools.reReply(int, `There was an issue! ❌`, { content: `${int.user}, No search result was found. ❌\nWas the /search executed a long time ago? If so, that might be the reason.\nYou could try another option.`, ephemeral: true });
					await int.editReply({ content: `${int.user}, **Track ${selection + 1}** is loading again... 🎧` }).catch((e) => { }); // eslint-disable-line no-unused-vars

					queue.addTrack(res.tracks[0]); // im Normalfall Musik hinzufügen

					if (!queue.node.isPlaying()) await queue.node.play();
				};
				addTrack(selectedResult);

				const uiDisabled = [{ type: 1, components: [{ style: ButtonStyle.Success, label: `Add it again`, custom_id: `addAgainButton`, disabled: true, type: 2 }] }]; // eslint-disable-line camelcase
				int.message.edit({ components: uiDisabled }).catch((e) => { }); // eslint-disable-line no-unused-vars

				setTimeout(function() {
					const uiEnabled = [{ type: 1, components: [{ style: ButtonStyle.Success, label: `Add it again`, custom_id: `addAgainButton`, disabled: false, type: 2 }] }]; // eslint-disable-line camelcase
					int.message.edit({ components: uiEnabled }).catch((e) => { }); // eslint-disable-line no-unused-vars
				}, 30000);
			}
				break;
			case `trackMenu`: {
				await int.deferReply();

				if (othervoicechannel) return discordTools.reReply(int, `There was an issue! ❌`, { content: `You are not on the same audio channel as me. ❌`, ephemeral: true });

				const chosenTrack = int.values[0];
				const selection = (chosenTrack === `t1`) ? 0 : (chosenTrack === `t2`) ? 1 : (chosenTrack === `t3`) ? 2 : (chosenTrack === `t4`) ? 3 : (chosenTrack === `t5`) ? 4 : (chosenTrack === `t6`) ? 5 : (chosenTrack === `t7`) ? 6 : (chosenTrack === `t8`) ? 7 : (chosenTrack === `t9`) ? 8 : (chosenTrack === `t10`) ? 9 : `error`;
				const name = ((int.message.embeds[0].title).substr(17, ((int.message.embeds[0].title).length) - 18));
				const resultArray = (int.message.embeds[0].description).split(`\n`);
				const resultCount = (resultArray.length - 2) / 2;
				const resultURLs = resultCount === 1 ? [(resultArray[1].substr(31, ((resultArray[1]).length) - 33))] : resultCount === 2 ? [(resultArray[1].substr(31, ((resultArray[1]).length) - 33)), (resultArray[3].substr(31, ((resultArray[3]).length) - 33))] : resultCount === 3 ? [(resultArray[1].substr(31, ((resultArray[1]).length) - 33)), (resultArray[3].substr(31, ((resultArray[3]).length) - 33)), (resultArray[5].substr(31, ((resultArray[5]).length) - 33))] : resultCount === 4 ? [(resultArray[1].substr(31, ((resultArray[1]).length) - 33)), (resultArray[3].substr(31, ((resultArray[3]).length) - 33)), (resultArray[5].substr(31, ((resultArray[5]).length) - 33)), (resultArray[7].substr(31, ((resultArray[7]).length) - 33))] : resultCount === 5 ? [(resultArray[1].substr(31, ((resultArray[1]).length) - 33)), (resultArray[3].substr(31, ((resultArray[3]).length) - 33)), (resultArray[5].substr(31, ((resultArray[5]).length) - 33)), (resultArray[7].substr(31, ((resultArray[7]).length) - 33)), (resultArray[9].substr(31, ((resultArray[9]).length) - 33))] : resultCount === 6 ? [(resultArray[1].substr(31, ((resultArray[1]).length) - 33)), (resultArray[3].substr(31, ((resultArray[3]).length) - 33)), (resultArray[5].substr(31, ((resultArray[5]).length) - 33)), (resultArray[7].substr(31, ((resultArray[7]).length) - 33)), (resultArray[9].substr(31, ((resultArray[9]).length) - 33)), (resultArray[11].substr(31, ((resultArray[11]).length) - 33))] : resultCount === 7 ? [(resultArray[1].substr(31, ((resultArray[1]).length) - 33)), (resultArray[3].substr(31, ((resultArray[3]).length) - 33)), (resultArray[5].substr(31, ((resultArray[5]).length) - 33)), (resultArray[7].substr(31, ((resultArray[7]).length) - 33)), (resultArray[9].substr(31, ((resultArray[9]).length) - 33)), (resultArray[11].substr(31, ((resultArray[11]).length) - 33)), (resultArray[13].substr(31, ((resultArray[13]).length) - 33))] : resultCount === 8 ? [(resultArray[1].substr(31, ((resultArray[1]).length) - 33)), (resultArray[3].substr(31, ((resultArray[3]).length) - 33)), (resultArray[5].substr(31, ((resultArray[5]).length) - 33)), (resultArray[7].substr(31, ((resultArray[7]).length) - 33)), (resultArray[9].substr(31, ((resultArray[9]).length) - 33)), (resultArray[11].substr(31, ((resultArray[11]).length) - 33)), (resultArray[13].substr(31, ((resultArray[13]).length) - 33)), (resultArray[15].substr(31, ((resultArray[15]).length) - 33))] : resultCount === 9 ? [(resultArray[1].substr(31, ((resultArray[1]).length) - 33)), (resultArray[3].substr(31, ((resultArray[3]).length) - 33)), (resultArray[5].substr(31, ((resultArray[5]).length) - 33)), (resultArray[7].substr(31, ((resultArray[7]).length) - 33)), (resultArray[9].substr(31, ((resultArray[9]).length) - 33)), (resultArray[11].substr(31, ((resultArray[11]).length) - 33)), (resultArray[13].substr(31, ((resultArray[13]).length) - 33)), (resultArray[15].substr(31, ((resultArray[15]).length) - 33)), (resultArray[17].substr(31, ((resultArray[17]).length) - 33))] : resultCount === 10 ? [(resultArray[1].substr(31, ((resultArray[1]).length) - 33)), (resultArray[3].substr(31, ((resultArray[3]).length) - 33)), (resultArray[5].substr(31, ((resultArray[5]).length) - 33)), (resultArray[7].substr(31, ((resultArray[7]).length) - 33)), (resultArray[9].substr(31, ((resultArray[9]).length) - 33)), (resultArray[11].substr(31, ((resultArray[11]).length) - 33)), (resultArray[13].substr(31, ((resultArray[13]).length) - 33)), (resultArray[15].substr(31, ((resultArray[15]).length) - 33)), (resultArray[17].substr(31, ((resultArray[17]).length) - 33)), (resultArray[19].substr(31, ((resultArray[19]).length) - 33))] : [];
				const selectedResult = resultURLs[selection];

				const interactionComponents = int.message.components;

				const resetMenu = async () => {
					await int.message.edit({ components: [] });
					await int.message.edit({ components: interactionComponents });
				};

				if (int.user.id === int.message.interaction.user.id) {
					if (int.member.voice.channel) {
						const addTrack = async (selectedResult) => {
							const queue = await createQueue(client, int);
							const res = await client.player.search(selectedResult, {
								requestedBy: int.user,
								searchEngine: QueryType.AUTO
							});
							try {
								if (!queue.connection) await queue.connect(int.member.voice.channel);
							} catch {
								await client.player.deleteQueue(int.guildId);
								return discordTools.reReply(int, `There was an issue! ❌`, { content: `${int.user}, I can't join the audio channel. ❌`, ephemeral: true });
							}
							if (!res || !res.tracks.length) return discordTools.reReply(int, `There was an issue! ❌`, { content: `${int.user}, No search result was found. ❌\nWas the /search executed a long time ago? If so, that might be the reason.\nYou could try another option.`, ephemeral: true });
							await int.editReply({ content: `${int.user}, Your chosen track is loading now... 🎧` }).catch((e) => { }); // eslint-disable-line no-unused-vars

							queue.addTrack(res.tracks[0]); // im Normalfall Musik hinzufügen

							if (!queue.node.isPlaying()) await queue.node.play();
						};
						addTrack(selectedResult);
						const createembed = async (name, selection, selectedResult) => {
							const res = await client.player.search(selectedResult, {
								requestedBy: int.user,
								searchEngine: QueryType.AUTO
							});
							if (!res || !res.tracks.length) return;
							const embed = new EmbedBuilder();

							embed.setColor(Colors.Blue); // blue = 0x3498DB
							embed.setTitle(`Searched Music: "${name}"`);

							const description = resultCount === 10 ? (((int.message.embeds[0].description).substring(0, ((int.message.embeds[0].description).length) - 183)) + `Selection stopped because track **${selection + 1}** was selected. ✅`) : (((int.message.embeds[0].description).substring(0, ((int.message.embeds[0].description).length) - 182)) + `Selection stopped because track **${selection + 1}** was selected. ✅`);
							embed.setDescription(description);

							embed.setTimestamp();
							embed.setFooter({ text: `Music Bot - by CraftingShadowDE`, iconURL: int.user.displayAvatarURL({ dynamic: true }) });
							const ui = [{ type: 1, components: [{ style: ButtonStyle.Success, label: `Add it again`, custom_id: `addAgainButton`, disabled: false, type: 2 }] }]; // eslint-disable-line camelcase
							int.message.edit({ embeds: [embed], components: ui }).catch((e) => { }); // eslint-disable-line no-unused-vars
						};
						createembed(name, selection, selectedResult);
					} else {
						discordTools.reReply(int, `There was an issue! ❌`, { content: `You are not connected to an audio channel. ❌`, ephemeral: true });
						resetMenu();
					}
				} else {
					discordTools.reReply(int, `There was an issue! ❌`, { content: `You aren't allowed to do this because you are not the person that executed the search-command! ❌`, ephemeral: true });
					resetMenu();
				}
			}
			}
		}
	}
};
