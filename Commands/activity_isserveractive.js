const { EmbedBuilder } = require('discord.js');
const IRegistry = require("../Managers/Interaction");

let ServerInfo = {
    "ServerIP": "147.135.39.163", // CONST
    "ServerActive": false, // FLEX
}

function ServerActivityString(bool)
{
    if (bool) { return "Active."; } else { return "Inactive."; }
}

exports.Init = async function()
{
    await IRegistry.RegisterInteraction("Commands",
        "serverinfo",
        "Server Information",
        __filename,
        "GetServerInfo"
    );

    await IRegistry.RegisterInteraction("Commands",
        "updateserverinfo",
        "Set Server Info",
        __filename,
        "SetServerInfo"
    );
}

exports.GetServerInfo = async function(interaction)
{
    let embed = new EmbedBuilder()
        .setColor([255, 255, 255])
        .setTitle('Server Info')
        .addFields(
            { name: 'Server IP',                value: ServerInfo.ServerIP.toString() },
            { name: 'Server Activity',          value: ServerActivityString(ServerInfo.ServerActive) },
        )
        .setTimestamp()

    interaction.reply({embeds: [embed], ephemeral: true});
}

exports.SetServerInfo = async function(interaction)
{
    let SubCommand = interaction.options.getSubcommand()

    if (SubCommand == "activity") {
        let InputActive = interaction.options.getBoolean('active');

        if (InputActive) {
            ServerInfo.ServerActive = true;
            interaction.reply({content: "Successfully set the server to active.", ephemeral: true});
        } else {
            ServerInfo.ServerActive = false;
            interaction.reply({content: "Successfully set the server to inactive.", ephemeral: true});
        }
    }
}