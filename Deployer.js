const { SlashCommandBuilder, Routes, PermissionFlagsBits } = require('discord.js');
const { REST } = require('@discordjs/rest');

const { clientId, token } = require('./Config.json');

async function Init() {
const commands = [
	//		SERVER COMMANDS		\\
	// Get Server Activity
	new SlashCommandBuilder()
	.setName('serverinfo')
	.setDescription('Get information on the status of the server.')
	.setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),

	// Set Server Activity
	new SlashCommandBuilder()
	.setName('updateserverinfo')
	.setDescription('Set if the server is active.')
	.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
	.addSubcommand(subcommand => subcommand
		.setName('activity')
		.setDescription('Set Server Activity')
		.addBooleanOption(option => option
			.setName('active')
			.setDescription('Is Server Active?')
			.setRequired(true)),
		),


	//		SETUP COMMANDS		\\
	// Setup Channel Command
	new SlashCommandBuilder()
	.setName('setupchannel')
	.setDescription('Set up a channel.')
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
		.setRequired(true))
]
.map(command => command.toJSON());

// Reset Command List, Thanks discord, doesn't work. Like always.
const rest = new REST({ version: '10' }).setToken(token);

await rest.put(Routes.applicationCommands(clientId), { body: [] })
	.then(() => console.log('Deleted Previously Registered Commands.'))
	.catch(console.error);

await rest.put(
	Routes.applicationCommands(clientId),
	{ body: commands },
);

// Log.
console.log("Registerd " + commands.length + " Commands.");
}
Init();


/*
	>	node Deployer.js
*/