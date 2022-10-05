const { EmbedBuilder } = require('discord.js');
const IRegistry = require("d:/Discord Projects/Deltis/Managers/Interaction");

exports.Init = async function()
{
    await IRegistry.RegisterInteraction("Buttons",
        "game_rules",
        "Game Rules",
        __filename,
        "Call"
    );
}

exports.Call = async function(interaction)
{
    const rulesEmbed = new EmbedBuilder()
        .setColor([255, 255, 255])
        .setTitle('Server Rules')
        .addFields(
            { name: 'OOC',      value: 'Refrain from talking OOC via Voice Chat or Text Chat.\nExemption: Only provided to text chat ooc, when a situation requires it.' },
            { name: 'FRP',      value: 'Refrain from FRP. This Includes:\n* Leaving the game while deceased to avoid perma-death.\n* Leaving in the middle of a interaction.\n\nExemption: In situations in which a valid reason can be provided.' },
        )
        .setTimestamp()

    interaction.reply({content: "These are the rules.", ephemeral: true, embeds: [rulesEmbed]});
}