const { ApplicationCommandOptionType } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;
const ytdl = require('ytdl-core');
const discordTools = require("../exports/discordTools.js");

const convertSecondsToString = async (secondsInput) => {
    var stringOutput = "";
    var tempMathValue;
    tempMathValue = secondsInput;
    var days = 0;
    var hours = 0;
    var minutes = 0;
    var seconds = 0;

    if ((tempMathValue % (24*60*60))!==tempMathValue) days = parseInt(tempMathValue / (24*60*60));
    tempMathValue -= (days*24*60*60);
    const daysString = ((""+days).length===1) ? ("0"+days) : (""+days);

    if ((tempMathValue % (60*60))!==tempMathValue) hours = parseInt(tempMathValue / (60*60));
    tempMathValue -= (hours*60*60);
    const hoursStringLong = ((""+hours).length===1) ? ("0"+hours) : (""+hours);
    const hoursStringShort = (""+hours);

    if ((tempMathValue % 60)!==tempMathValue) minutes = parseInt(tempMathValue / 60);
    tempMathValue -= (minutes*60);
    const minutesStringLong = ((""+minutes).length===1) ? ("0"+minutes) : (""+minutes);
    const minutesStringShort = (""+minutes);

    seconds = tempMathValue;
    const secondsString = ((""+seconds).length===1) ? ("0"+seconds) : (""+seconds);

    delete tempMathValue;

    if (days!==0) stringOutput = (daysString + ":" + hoursStringLong + ":" + minutesStringLong + ":" + secondsString);
    if (days===0 && hours!==0) stringOutput = (hoursStringShort + ":" + minutesStringLong + ":" + secondsString);
    if (days===0 && hours===0) stringOutput = (minutesStringShort + ":" + secondsString);

    return stringOutput;
}
const convertStringToSeconds = async (stringInput) => {
    const stringArray = stringInput.split(':');
    const seconds = (stringArray.length===1) ? (+stringArray[0]) : (stringArray.length===2) ? ((+stringArray[0]) * 60 + (+stringArray[1])) : (stringArray.length===3) ? (((+stringArray[0]) * 60 + (+stringArray[1])) * 60 + (+stringArray[2])) : (stringArray.length===4) ? ((((+stringArray[0]) * 24 + (+stringArray[1])) * 60 + (+stringArray[2])) * 60 + (+stringArray[3])) : 0;
    return seconds;
}

module.exports = {
    description: "Allows you to jump to a specific part of the current track.",
    name: 'jump',
    options: [{
        name: 'second',
        description: 'Type in what second (+ minutes + hours) you want to jump to.',
        type: ApplicationCommandOptionType.Integer,
        required: false
    },{
        name: 'minute',
        description: 'Type in what minute (+ seconds + hours) you want to jump to.',
        type: ApplicationCommandOptionType.Number,
        required: false
    },{
        name: 'hour',
        description: 'Type in what hour (+ seconds + minutes) you want to jump to.',
        type: ApplicationCommandOptionType.Number,
        required: false
    }],
    voiceChannel: true,

    run: async (client, interaction) => {
        await interaction.deferReply();

        const queue = client.player.getQueue(interaction.guild.id);
       if (!queue || !queue.playing) return discordTools.reReply(interaction, `There was an issue! ❌`, { content: `No music currently playing! ❌`, ephemeral: true });

        const isYouTubeURL = await ytdl.validateURL(await queue.current.url);
       if (client.config.opt.playDl.replaceYtdl && isYouTubeURL) return discordTools.reReply(interaction, `There was an issue! ❌`, { content: `You can't use the jump-feature because play-dl is active and this track is a YouTube-Track. ❌\n*(Use \`/play-dl info\` to get more information.)*`, ephemeral: true });

        const secondsInput = interaction.options.getInteger('second');
        const minutesInput = interaction.options.getNumber('minute');
        const hoursInput = interaction.options.getNumber('hour');
        const secondsJumpTo = (secondsInput + parseInt((minutesInput + (hoursInput * 60)) * 60));
        const jumpToString = await convertSecondsToString(secondsJumpTo);

        const currentProgressSeconds = await convertStringToSeconds((await queue.getPlayerTimestamp()).current);
        const currentProgressString = await convertSecondsToString(currentProgressSeconds);

        const trackDurationString = await convertStringToSeconds(await queue.current.duration);
        const trackDurationSeconds = await convertSecondsToString(trackDurationString);

        if (!secondsInput && !minutesInput && !hoursInput) return discordTools.reReply(interaction, `There was an issue! ❌`, { content: `You need to specify where you want to jump to. ❌`, ephemeral: true });
        if ((secondsInput < 0) || (minutesInput < 0) || (hoursInput < 0)) return discordTools.reReply(interaction, `There was an issue! ❌`, { content: `You can't jump to a negative time! ❌`, ephemeral: true });
        if (secondsJumpTo > trackDurationString) return discordTools.reReply(interaction, `There was an issue! ❌`, { content: `The current track is only **${trackDurationSeconds}** long but you wanted to jump to **${jumpToString}**. ❌`, ephemeral: true });

        const success = queue.seek(secondsJumpTo * 1000);

        return success ? interaction.editReply({ content: `Jumped from **${currentProgressString}** to **${jumpToString}** (the track is **${trackDurationSeconds}** long). ✅` }).catch(e => { })
        : discordTools.reReply(interaction, `There was an issue! ❌`, { content: `Something went wrong. ❌`, ephemeral: true }).catch(e => { });
    },
};