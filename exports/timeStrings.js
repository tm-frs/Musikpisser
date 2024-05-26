const convertSecondsToString = (secondsInput) => {
	var stringOutput = ``;
	var tempMathValue;
	tempMathValue = secondsInput;
	var days = 0;
	var hours = 0;
	var minutes = 0;
	var seconds = 0;

	if ((tempMathValue % (24 * 60 * 60)) !== tempMathValue) days = parseInt(tempMathValue / (24 * 60 * 60));
	tempMathValue -= (days * 24 * 60 * 60);
	const daysString = (`` + days);

	if ((tempMathValue % (60 * 60)) !== tempMathValue) hours = parseInt(tempMathValue / (60 * 60));
	tempMathValue -= (hours * 60 * 60);
	const hoursStringLong = ((`` + hours).length === 1) ? (`0` + hours) : (`` + hours);
	const hoursStringShort = (`` + hours);

	if ((tempMathValue % 60) !== tempMathValue) minutes = parseInt(tempMathValue / 60);
	tempMathValue -= (minutes * 60);
	const minutesStringLong = ((`` + minutes).length === 1) ? (`0` + minutes) : (`` + minutes);
	const minutesStringShort = (`` + minutes);

	seconds = tempMathValue;
	const secondsString = ((`` + seconds).length === 1) ? (`0` + seconds) : (`` + seconds);

	if (days !== 0) stringOutput = (daysString + `:` + hoursStringLong + `:` + minutesStringLong + `:` + secondsString);
	if (days === 0 && hours !== 0) stringOutput = (hoursStringShort + `:` + minutesStringLong + `:` + secondsString);
	if (days === 0 && hours === 0) stringOutput = (minutesStringShort + `:` + secondsString);

	return stringOutput;
};
const convertStringToSeconds = (stringInput) => {
	const stringArray = (stringInput + ``).split(`:`);
	const seconds = (stringArray.length === 1) ? (+stringArray[0]) : (stringArray.length === 2) ? ((+stringArray[0]) * 60 + (+stringArray[1])) : (stringArray.length === 3) ? (((+stringArray[0]) * 60 + (+stringArray[1])) * 60 + (+stringArray[2])) : (stringArray.length === 4) ? ((((+stringArray[0]) * 24 + (+stringArray[1])) * 60 + (+stringArray[2])) * 60 + (+stringArray[3])) : 0;
	return seconds;
};
const reformatString = (stringInput) => {
	return convertSecondsToString(convertStringToSeconds(stringInput)); // first convert input to seconds, then convert seconds back to string
};

module.exports = {
	convertSecondsToString,
	convertStringToSeconds,
	reformatString
};
