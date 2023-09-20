const reReply = async (interaction, originalMessage, toReply) => {
	await interaction.editReply({ content: originalMessage }).catch((e) => {}); // eslint-disable-line no-unused-vars
	return await interaction.followUp(toReply).catch((e) => {}); // eslint-disable-line no-unused-vars
};

module.exports = {
	reReply
};
