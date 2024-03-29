const { EmbedBuilder } = require('discord.js');
const IRegistry = require("../Wrapper").Create;

exports.Init = async function()
{
    await IRegistry.RegisterInteraction("Buttons",
        "discord_rules",
        "Discord Roles",
        __filename,
        "Call"
    );
}

exports.Call = async function(interaction)
{
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