const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const IRegistry = require("../Managers/Interaction");
const { guildId, serverActiveChannel } = require("../Config.json");
const U = require("../Utils");
const EmbedVersion = 2;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////

let ServerInfo = {
    "ServerIP": "147.135.39.163", // CONST
    "ServerActive": false, // FLEX
}
let CacheStorage = {
    "client": -255,
    "guild": -255,
    "channel": -255,
    "message": -255,
    "message_content": -255,
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////

function ServerActivityString(bool)
{
    if (bool) { return "Active."; } else { return "Inactive."; }
}

async function GetMessageId(channel, message_content)
{
    let PMessageId = await U.PStore_Get("ServerActivity", "MessageId");

    if (PMessageId == null) {
        let Message = await channel.send(message_content);

        U.PStore_Set("ServerActivity", "MessageId", Message.id);

        PMessageId = Message.id;
    }

    return PMessageId;
}

async function CacheValue(valueName)
{
    let ValueName = valueName.toLowerCase()

    if (CacheStorage[ValueName] == null) { return null; }

    if (CacheStorage[ValueName] == -255) {

        switch(ValueName) {
            case "client":
                CacheStorage.client = require("../Login")();

            case "guild":
                let IClient = await CacheValue("client");
                CacheStorage.guild = await IClient.guilds.fetch(guildId);
                break;

            case "channel":
                let IGuild = await CacheValue("guild");
                CacheStorage.channel = await IGuild.channels.fetch(serverActiveChannel);
                break;

            case "message":
                let IChannel = await CacheValue("channel");
                let IMessageContent = await CacheValue("message_content");
                let IMessageId = await GetMessageId(IChannel, IMessageContent)
                CacheStorage.message = await IChannel.messages.fetch(IMessageId);
                break;
        }

    }

    // Updates the embed and buttons.
    if (ValueName == "message_content") {
        let button = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('server_activity_notification_toggle')
                .setLabel('Toggle Server Activity Notifications (Off by Default)')
                .setStyle(ButtonStyle.Secondary),
        );

        let embed = new EmbedBuilder()
        .setColor([100, 100, 100])
        .setTitle('Off-Branch Roleplay')
        .setAuthor({ name: 'Useful Server Information', iconURL: 'https://cdn.discordapp.com/attachments/992961900323274762/1027336886500466688/9.png' })
        .setThumbnail('https://cdn.discordapp.com/attachments/992961900323274762/1027336886500466688/9.png')
        .addFields(
            { name: 'Server IP: ',              value: ServerInfo.ServerIP },
            { name: 'Server Active: ',          value: ServerActivityString(ServerInfo.ServerActive) },
        )
        .setFooter({text: `USIV: ${EmbedVersion}`})
        .setTimestamp()

        CacheStorage.message_content = {embeds: [embed], components:[button]};
    }

    return CacheStorage[ValueName];
}

async function IUpdateMessage()
{
    let message = await CacheValue("message");
    let message_content = await CacheValue("message_content");

    if (message != null) {
        message.edit(message_content);
    }
}

async function IPingList()
{
    let PMUsers = await U.PStore_GetEntire("ServerActivityNotifys")
    let CChannel = await CacheValue("channel");

    if (PMUsers != null && Object.keys(PMUsers).length > 0) {
        let UsersList = ``;

        for (let [PUserId, bool] of Object.entries(PMUsers)) {
            if (bool) {
                UsersList = UsersList + ` <@${PUserId}>`
            }
        }

        let Message = await CChannel.send(UsersList);
        Message.delete();
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.Init = async function()
{
    await IRegistry.RegisterInteraction("Commands",
        "setserver",
        "Set Server Information",
        __filename,
        "SetServerInfo"
    );

    await IRegistry.RegisterInteraction("Buttons",
        "server_activity_notification_toggle",
        "Toggle Server Activity Notifications ",
        __filename,
        "TogglePings"
    );

    // Setup Channel
    let channel = await CacheValue("Channel");
    let message = await CacheValue("Message");
    let message_content = await CacheValue("message_content");

    if (message == null) {
        message = await channel.send(message_content);

        U.PStore_Set("ServerActivity", "MessageId", message.id);
    } else {
        message.edit(message_content);
    }

    // Check for a Update
    let PEmbedVersion = await U.PStore_Get("ServerActivity", "EmbedVersion");

    if (PEmbedVersion == null || PEmbedVersion != EmbedVersion) {
        console.log("Updating Server Information Embed to Version #" + EmbedVersion);
        message.edit(message_content);

        U.PStore_Set("ServerActivity", "EmbedVersion", EmbedVersion);
    }
}

exports.SetServerInfo = async function(interaction)
{
    let SubCommand = interaction.options.getSubcommand()

    if (SubCommand == "active") {
        let InputActive = interaction.options.getBoolean('active');

        if (InputActive) {
            ServerInfo.ServerActive = true;
            await interaction.reply({content: "Successfully set the server to active.", ephemeral: true});
        } else {
            ServerInfo.ServerActive = false;
            await interaction.reply({content: "Successfully set the server to inactive.", ephemeral: true});
        }
    }

    await IUpdateMessage();
    await IPingList();
}

exports.TogglePings = async function(interaction)
{
    let IUserId = interaction.user.id;
    let PTog = await U.PStore_Get("ServerActivityNotifys", IUserId);

    if (PTog == null || PTog == false) {
        interaction.reply({content: "You will now recieve Activity Notifications.", ephemeral: true});

        U.PStore_Set("ServerActivityNotifys", IUserId, true);
    } else {
        interaction.reply({content: "You will no longer get Activity Notifications.", ephemeral: true});

        U.PStore_Remove("ServerActivityNotifys", IUserId);
    }
}