const botConfig = require(`../config.js`);
const { Colors } = require(`discord.js`);
const { InteractionType } = require(`discord.js`);
const { EmbedBuilder } = require(`discord.js`);
const { PermissionsBitField } = require(`discord.js`);
const adminperms = botConfig.opt.adminperms;

const rrm = {
	config: botConfig.opt.roleRestrictedMode,
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

				setTimeout(() => {
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
		const component = client.components.get(interaction.customId);

		if (!component) return void interaction.reply({
			content: `Message component \`${interaction.customId}\` not found.`,
			ephemeral: true
		});

		if (!interaction.guild.roles.cache.some((x) => x.name === rrm.config.roleName) && rrm.config.enabled) rrm.createRole(client, interaction);
		if (rrm.config.enabled && rrm.config.affectedButtonsAndMenus.includes(interaction.customId) && !rrm.checkForPermissions(interaction)) { // if rrm active AND interaction affected AND no permission
			return rrm.sendReplyNotAllowed(client, interaction);
		}

		const queue = client.player.nodes.get(interaction.guildId);

		component.run(client, interaction, queue, othervoicechannel);
	}
};
