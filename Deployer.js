const { SlashCommandBuilder, Routes, PermissionFlagsBits } = require('discord.js');
const { REST } = require('@discordjs/rest');

const _CFG = require("./Settings/Base.json");

async function Init(){
const Commands = {};
Commands.Stable = [
	//		SERVER COMMANDS		\\
	// Set Server Info
	new SlashCommandBuilder()
	.setName('setserver')
	.setDescription('Set if the server is active.')
	.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
	.addSubcommand(subcommand => subcommand
		.setName('active')
		.setDescription('Set Server if the Server is Active.')
		.addBooleanOption(option => option
			.setName('active')
			.setDescription('Is Server Active?')
			.setRequired(true)),
		),


	//		SETUP COMMANDS		\\
	// Setup Info Channel
	new SlashCommandBuilder()
	.setName('setupinfo')
	.setDescription('Set up a info channel.')
	.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
	.addStringOption(option => option
		.setName('type')
		.setDescription('What type of setup to do.')
		.setRequired(true)
		.addChoices(
			{ name: 'Info / Non-Members', value: 'infon' },
			{ name: 'Info / Members', value: 'infom' },
		))
	.addChannelOption(option => option
		.setName('channel')
		.setDescription('Channel to setup.')
		.setRequired(true)),

	// Setup FAQ Channel
	new SlashCommandBuilder()
	.setName('setupfaq')
	.setDescription('Set up a FAQ channel.')
	.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
	.addChannelOption(option => option
		.setName('channel')
		.setDescription('Channel to setup.')
		.setRequired(true))
]
.map(public_command => public_command.toJSON());

Commands.Development = [

]
.map(private_command => private_command.toJSON());

for (let [BranchType, BotVal] of Object.entries(_CFG.Bot)) {
	if( typeof(BotVal) == "object" ) {
		let clientId = BotVal.clientId;
		let token = BotVal.token;
		let commands = Commands[BranchType];
		let combine = BotVal.combine;

		if (combine != null) {
			let combine_commands = Commands[BotVal.combine];
			let previous_commands = commands;
			
			commands = Object.assign(previous_commands, combine_commands);
		}

		const rest = new REST({ version: '10' }).setToken(token);

		await rest.put(Routes.applicationCommands(clientId), { body: [] })
			.then(() => console.log('Deleted Previously Registered Commands.'))
			.catch(console.error);

		await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		);

		// Log.
		console.log("Registerd " + commands.length + " " + BranchType + " Commands.");
	}
};
} Init();

/*
	>	node Deployer.js
*/