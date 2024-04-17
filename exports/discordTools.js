const reReply = async (interaction, originalMessage, toReply) => {
	await interaction.editReply({ content: originalMessage }).catch((e) => {});
	return await interaction.followUp(toReply).catch((e) => {});
};

module.exports = {
	reReply
};
