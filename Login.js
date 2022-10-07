// Require the necessary discord.js classes
const { Client, GatewayIntentBits } = require('discord.js');
const fs = require("fs");

const { token, guildId } = require('./Config.json');

const InitFolders = [
	"./Managers",
	"./Buttons",
	"./Commands",
]

// Create a new client instance
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
	]
});

// Init File Funct
async function InitFile(FPath, client)
{
	let File = require(FPath);

	File.Init(client);

	console.log("Inited File: " + FPath);
}

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

	// Init Extra Files
	InitFolders.forEach(DPath => {
		let FNames = fs.readdirSync(DPath);

		for (const FName of FNames)
		{
			let FPath = `${DPath}/${FName}`;

			if (FName.includes(".js")) {
				InitFile(FPath, client);
			} else {
				// Go 1 folder deeper
				let FNames2 = fs.readdirSync(FPath);

				for (const FName2 of FNames2)
				{
					let FPath2 = `${FPath}/${FName2}`;

					if (FName2.includes(".js")) {
						InitFile(FPath2, client);
					} else {
						// Go 2 folders deeper
						let FNames3 = fs.readdirSync(FPath2);

						for (const FName3 of FNames3)
						{
							let FPath3 = `${FPath2}/${FName3}`;

							if (FName3.includes(".js")) {
								InitFile(FPath3, client);
							} else {
								// Go 3 folders deeper

								// Unneeded for now.
							}
						}
					}
				}
			}
		}
	});

	// Rich Presence
	client.user.setPresence({activities: [{name: "Watching for applications..."}]});
});

// Login to Discord with your client's token
client.login(token);

// Export Client
module.exports = function() { return client; }