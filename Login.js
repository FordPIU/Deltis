// Require the necessary discord.js classes
const { Client, GatewayIntentBits } = require('discord.js');
const fs = require("fs");

const { token, guildId } = require('./Config.json');
const { DebuildMessage } = require('./Utils/FileBuilder');
const Get = require("./Utils/Gets");

// Create a new client instance
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages
	]
});

// Wait for Client to be logged in and ready
client.once('ready', () => {
	console.log('Bot Logged In.');

	// Guild Check
	let GuildList = client.guilds.cache;

	GuildList.forEach(guild => {
		if (!guild.id == guildId) {
			guild.leave()
				.then(console.log(`Invalid Server: ${guild.name}`))
				.catch(console.error);
		} else {
			console.log(`Validated Server: ${guild.name}`);
		}
	});
});

// Interaction Phraser
client.on('interactionCreate', async i => {
	if (i.isChatInputCommand()) {
		require('./Commands/' + i.commandName)(i);

		console.log(`${i.user.tag} used command ${i.commandName}`);

		return;
	}

	if (i.isButton() && !(i.customId.includes('!B_BYPASS!'))) {
		let Path = await Get.FilesPathFromInteraction(i.channel.id, i.message.id, i.customId);

		if (fs.existsSync(Path)) {
			require(Path)(i);
		} else { DebuildMessage(i.channel.id, i.message.id); i.message.delete(); }

		console.log(`${i.user.tag} clicked on button ${i.customId} from message ${i.message.id}.`);

		return;
	}
});

// Login to Discord with your client's token
client.login(token);

// Export Client
module.exports = function() { return client; }