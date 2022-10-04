const TemplateType = "Buttons";
const TemplateId = "discord_rules";
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
        .setTitle('Discord Rules')
        .addFields(
            { name: 'Discord',      value: 'Follow Discord TOS & Guidelines at all times.\nThis includes other servers, and DMs.' },
            { name: 'NSFW',         value: 'Do not post NSFW in the discord.\nThis includes heavy gore & explicit content.\nExemption: In RP-Offline/Department Channels' },
            { name: 'Application',  value: 'Do not falsify information on a Application.\nThis includes just putting "kkk".' },
            { name: 'RP Channels',  value: 'Do not talk OOC or FRP in RP Channels.' },
        )
        .setTimestamp()

    interaction.reply({content: "These are the rules.", ephemeral: true, embeds: [rulesEmbed]});
}