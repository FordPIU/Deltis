const TemplateType = "Buttons";
const TemplateId = "game_rules";
const MessageId = "1025948283618725921";

const Updater = require("d:/Discord Projects/Deltis/Utils/FileUpdater");

const { EmbedBuilder } = require('discord.js');

module.exports = async function(interaction)
{
    
    // // FILE UPDATER
    let IsLatest = await Updater.IsFileLatest(TemplateType, TemplateId, __filename);

    if (!IsLatest) {
        await Updater.FileToLatest({Value: true, I: interaction}, TemplateType, TemplateId, __filename);
        return;
    }


    // Actual Code for this File.
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