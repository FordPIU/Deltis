const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const IRegistry = require("../Events/Interaction");

exports.Init = async function()
{
    await IRegistry.RegisterInteraction("Commands",
        "setupinfo",
        "Setup Info Channel",
        __filename,
        "Call"
    );
}

exports.Call = async function(interaction)
{
    let Channel   = interaction.options.getChannel("channel");
    let Type      = interaction.options.getString("type");
    
    // Check Nulls
    if (Channel == null)  { interaction.reply({content: "Invalid Channel.", ephemeral: true}); return; }

    // Misc Checks
    if (!Channel.isTextBased()) { interaction.reply({content: "Not a text channel.", ephemeral: true}); return; }

    // Delete all messages in selected channel
    await Channel.messages.fetch({ limit: 100 }).then(messages => { messages.forEach(message => message.delete()) })

    // Setup buttons
    let button = null;

    switch (Type) {
        case "infon":
            button = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('discord_rules')
                    .setLabel('Read our Discord Rules!')
                    .setStyle(ButtonStyle.Danger),

                new ButtonBuilder()
                    .setCustomId('game_rules')
                    .setLabel('Read our Server Rules!')
                    .setStyle(ButtonStyle.Danger),

                new ButtonBuilder()
                    .setCustomId('membershipapp_pt1_start')
                    .setLabel('Apply for Membership!')
                    .setStyle(ButtonStyle.Primary),
            );
            break;

        case "infom":
            button = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('discord_rules')
                    .setLabel('Read our Discord Rules!')
                    .setStyle(ButtonStyle.Danger),

                new ButtonBuilder()
                    .setCustomId('game_rules')
                    .setLabel('Read our Server Rules!')
                    .setStyle(ButtonStyle.Danger),
            );
            break;
    }

    // Setup Welcome Embed
    let embed = null;

    switch (Type) {
        case "infon":
            embed = new EmbedBuilder()
            .setColor([0, 100, 0])
            .setTitle('Community Information')
            .setAuthor({ name: 'Off-Branch Roleplay', iconURL: 'https://cdn.discordapp.com/attachments/992961900323274762/1027336886500466688/9.pngg' })
            .setDescription('A FiveM Community with a focus and passion for Realism.\n\n')
            .setThumbnail('https://cdn.discordapp.com/attachments/992961900323274762/1027336886500466688/9.png')
            .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Running on QBCore', value: 'With a realistic economy, but in a non-grindy nature.\nWith plenty of idle income sources, not requiring you to be on.\n' },
                { name: 'Character Based', value: 'Everything is character based, with every characting being a civilian at it\'s core.\nHave character in LSPD, and a character in BCSO. Get a character fired from 1 LEO Department, but not the other.\n' },
                { name: 'Utilizing CR-GSW', value: 'For a realistic medical experience, simulating wounds in their entirety.\nIncluding Character Perma-Death, to keep you on your toes.' },
                { name: 'Utilizing FivePD & CR-Scenarios', value: 'Unperdictable AI, giving Law Enforcement pursuits that are never the same.' },
                { name: '\nGovernment & Elections', value: 'Governor & Sheriff are elected positions, with Chief of Police and State Patrol Director being appointed.\nEvery character gets a vote, ensuring fair election cycles.' },
                { name: '\u200B', value: '\uFEFF' },
            )
            .setTimestamp()
            break;

        case "infom":
            embed = new EmbedBuilder()
            .setColor([0, 100, 0])
            .setTitle('Community Rules')
            .setAuthor({ name: 'Off-Branch Roleplay', iconURL: 'https://cdn.discordapp.com/attachments/992961900323274762/1027336886500466688/9.png' })
            .setThumbnail('https://cdn.discordapp.com/attachments/992961900323274762/1027336886500466688/9.png')
            .addFields(
                { name: 'Use me to remind yourself of the rules if you forget.', value: '\u200B' },
            )
            .setTimestamp()
            break;
    }

    // Send Message Type
    Channel.send({embeds: [embed], components:[button]});

    // Reply
    interaction.reply({content: "Success.", ephemeral: true});
}