const botConfig = require(`../config.js`);
const defaultApi = botConfig.defaultPublicIpApi;
var https = require(`https`);
var ip = require(`ip`);
require(`dotenv`).config();

const getPublicIp = async (apiUrlInput) => {
	const apiURL = (apiUrlInput) ? `${apiUrlInput}` : defaultApi;

	var toReturn = new Promise((resolveReturn, rejectReturn) => { // eslint-disable-line no-unused-vars
		https.get({
			host: apiURL
		}, (response) => {
			var ip = ``;
			response.on(`data`, (d) => {
				ip += d;
			});
			response.on(`end`, () => {
				if (ip) {
					resolveReturn(`${ip}`);
				} else {
					resolveReturn(`ERROR: Couldn't get public IP! ❌`);
				}
			});
		});
	});

	return toReturn;
};

const getPrivateIp = async () => {
	const toReturn = await ip.address();
	return toReturn;
};

const getPort = () => {
	return (process.env[`PORT`] || 3001);
};

module.exports = {
	getPublicIp,
	getPrivateIp,
	getPort
};
