// Import all Requirements
const { Client, GatewayIntentBits, } 	= 	require("discord.js");
const fs 								= 	require("fs");
const _CFG 								= 	require("./Settings/Base.json");
const _UTIL 							= 	require("./Utilities/_Init");

// Create the Client with Intents
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
	]
});

// Wait for Client to be logged in and ready
client.once("ready", () => {
	_UTIL.Logger.s("Logged In.");


	// Exclusive Mode Handle
	if (_CFG.Exclusive_Mode.enabled) {
		// Send Log Msg
		_UTIL.Logger.s("Exclusive Mode is Enabled.", ["Red", "Blink", "Bright", "Underscore", "NewLine"]);
		_UTIL.Logger.s("Validating Servers...", ["Yellow", "BlockBelow"]);

		// Get Guild List & Accepted Guilds
		let BGuilds = client.guilds.cache;
		let AGuilds = _CFG.Exclusive_Mode.allowedIds;

		// ForEach Guild Check
		BGuilds.forEach(guild => {
			if (!AGuilds.includes(guild.id.toString())) {
				//guild.leave()
				_UTIL.Logger.s(`	Invalid Server:   ${guild.name} (${guild.id})`, ["Red"]);
			} else {
				_UTIL.Logger.s(`	Validated Server: ${guild.name} (${guild.id})`, ["Green"]);
			}
		});

		// Log Completion
		_UTIL.Logger.s("Completed Validation.", ["Yellow", "BlockAbove"]);
	} else { _UTIL.Logger.s("Exclusive Mode is Disabled.", ["Green", "Bright", "Underscore", "NewLine"]); }

	// Maintenance Mode Check, for logging and presence.
	if (_CFG.Maintenance_Mode.enabled) {
		_UTIL.Logger.s("Maintenance Mode is Enabled.", ["Red", "Blink", "Bright", "Underscore", "NewLine"]);
		client.user.setPresence({activities: [{name: "!! Commands Disabled for Maintenance !!"}]});
	} else {
		_UTIL.Logger.s("Maintenance Mode is Disabled.", ["Green", "Bright", "Underscore", "NewLine"]);
		client.user.setPresence({activities: [{name: "This is a bot."}]});
	}


	// Initialize Files
	_UTIL.Logger.s("Initializing Files...", ["NewLine", "Yellow", "BlockBelow"]);
	let Files = _UTIL.Files.GetAllWithExtension(".", ".i.js", true);
	
	Files.forEach(FilePath => {
		require(FilePath).Init(client, _CFG.Maintenance_Mode.enabled, _CFG.Maintenance_Mode.allowedIds);
		_UTIL.Logger.s(`	Initialized File ${FilePath}`, ["White", "Bright"]);
	});
	_UTIL.Logger.s("Completed Initializing Files.", ["Yellow", "BlockAbove"]);

	// Initialize Managers
	_UTIL.Logger.s("Initializing Managers...", ["NewLine", "Yellow", "BlockBelow"]);
	let Managers = _UTIL.Files.GetAllWithExtension(".", ".m.js", true);
	
	Managers.forEach(FilePath => {
		require(FilePath).Init(client, _CFG.Maintenance_Mode.enabled, _CFG.Maintenance_Mode.allowedIds);
		_UTIL.Logger.s(`	Initialized Manager ${FilePath}`, ["White", "Bright"]);
	});
	_UTIL.Logger.s("Completed Initializing Managers.", ["Yellow", "BlockAbove"]);
});

// Login Call with Token
client.login(_CFG.Bot[_CFG.Bot.Branch].token);

// Export Client
module.exports = function() { return client; }