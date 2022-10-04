const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { BuildFile } = require('../Utils/FileBuilder');

module.exports = async function(interaction)
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
        case "info":
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
                    .setCustomId('membership_application')
                    .setLabel('Apply for Membership!')
                    .setStyle(ButtonStyle.Primary),
            );
            break;
    }

    // Setup Welcome Embed
    let embed = null;

    switch (Type) {
        case "info":
            embed = new EmbedBuilder()
            .setColor([0, 0, 100])
            .setTitle('{Server Name}')
            .setAuthor({ name: 'Community Information', iconURL: 'https://i.imgur.com/AfFp7pu.png' })
            .setDescription('A FiveM Community with a focus and passion for Realism.\n\n')
            .setThumbnail('https://i.imgur.com/AfFp7pu.png')
            .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Running on QBCore', value: 'With a realistic economy, but in a non-grindy nature.\nWith plenty of idle income sources, not requiring you to be on.\n' },
                { name: 'Character Based', value: 'Everything is character based, with every characting being a civilian at it\'s core.\nHave character in LSPD, and a character in BCSO. Get a character fired from 1 LEO Department, but not the other.\nOnly Discord & Server Rules apply to you and not your characters. (This sentence sucked -Buffy)\n' },
                { name: 'Utilizing CR-GSW', value: 'For a realistic medical experience, simulating wounds in their entirety.\nIncluding Character Perma-Death, to keep you on your toes.' },
                { name: 'Utilizing FivePD & CR-Scenarios', value: 'Unperdictable AI, giving Law Enforcement pursuits that are never the same.' },
                { name: '\nGovernment & Elections', value: 'Governor & Sheriff are elected positions, with Chief of Police and State Patrol Director being appointed.\nEvery character gets a vote, ensuring fair election cycles.' },
                { name: '\u200B', value: '\uFEFF' },
            )
            .setTimestamp()
            break;
    }

    // Send Message Type
    let Message = await Channel.send({embeds: [embed], components:[button]});

    // Build Button Files
    button.components.forEach(comp => {
        if (comp != null && comp.data != null && comp.data.custom_id != null) {
            BuildFile(comp.data.custom_id, Channel.id, Message.id);
        }
    });

    // Reply
    interaction.reply({content: "Success.", ephemeral: true});
}