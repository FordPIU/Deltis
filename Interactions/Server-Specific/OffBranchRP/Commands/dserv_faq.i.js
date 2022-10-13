const { ActionRowBuilder, SelectMenuBuilder, EmbedBuilder } = require('discord.js');
const IRegistry = require("../Wrapper").Create;

exports.Init = async function()
{
    await IRegistry.RegisterInteraction("Commands",
        "setupfaq",
        "Setup FAQ Channel",
        __filename,
        "Call"
    );

    await IRegistry.RegisterInteraction("SMenus",
        "faq_menu",
        "Frequently Asked Questions Menu",
        __filename,
        "MenuSelect"
    );
}

exports.Call = async function(interaction)
{
    let Channel   = interaction.options.getChannel("channel");
    
    // Check Nulls
    if (Channel == null)  { interaction.reply({content: "Invalid Channel.", ephemeral: true}); return; }

    // Misc Checks
    if (!Channel.isTextBased()) { interaction.reply({content: "Not a text channel.", ephemeral: true}); return; }

    // Delete all messages in selected channel
    await Channel.messages.fetch({ limit: 100 }).then(messages => { messages.forEach(message => message.delete()) })

    // Setup Embed
    let embed = new EmbedBuilder()
    .setColor([0, 100, 0])
    .setTitle('Frequently Asked Questions')
    .setAuthor({ name: 'Off-Branch Roleplay', iconURL: 'https://cdn.discordapp.com/attachments/992961900323274762/1027336886500466688/9.png' })
    .setTimestamp()

    // Set Selection
    const select = new ActionRowBuilder()
    .addComponents(
        new SelectMenuBuilder()
            .setCustomId('faq_menu')
            .setPlaceholder('Frequently Asked Questions')
            .addOptions(
                {
                    label: 'When is the server active?',
                    value: 'faq1',
                },
                {
                    label: 'How do I apply into Law Enforcement?',
                    value: 'faq2',
                },
                {
                    label: 'Who runs Law Enforcement Agencies?',
                    value: 'faq3',
                },
                {
                    label: 'What happens if I die?',
                    value: 'faq4',
                },
                {
                    label: 'How do I file a complaint against a Law Enforcement Officer?',
                    value: 'faq5',
                },
                {
                    label: 'What do Lawsuits Do?',
                    value: 'faq6',
                },
                {
                    label: 'I\'ve been cited or arrested, what do I have to do?',
                    value: 'faq7',
                },
                {
                    label: 'I\'m running in slow motion?',
                    value: 'faq8',
                },
                {
                    label: 'What do Radar Detectors do?',
                    value: 'faq9',
                }
            ),
    );

    // Send Message
    Channel.send({embeds: [embed], components:[select]});

    // Reply
    interaction.reply({content: "Success.", ephemeral: true});
}

exports.MenuSelect = async function(i)
{
    let FaqAnswer = "";

    switch(i.values[0]) {
        case "faq1":
            FaqAnswer = `Due to the low member count, there is a message in <#1019659552704180254> from <@1025567784324841593>, which will update itself if the server is active.
Optionally, you can opt into server activity pings using the button in <#1019659552704180254>.
The server is up 24/7, if you wish to create your character(s) and begin a job.`;
            break;

        case "faq2":
            FaqAnswer = `Your character(s) can do that in-game, at a Station.`;
            break;
            
        case "faq3":
            FaqAnswer = `Chief of Police is appointed by the Governor, and the Sheriff is elected.`;
            break;

        case "faq4":
            FaqAnswer = `You will be aware of this by a white screen. If you press E to self revive, you are risking character death (this will auto-delete your character). Law Enforcement & EMS have medical items to properly revive you.`;
            break;

        case "faq5":
            FaqAnswer = `Complaints are handled internally by the Department.`;
            break;

        case "faq6":
            FaqAnswer = `Against Law Enforcement Departments, a lot. Departments are funded by in-game taxes, and Department Funds are used to pay for payroll & gas.
Lawsuits can be filed by Lawyers, and sent to State Court Circuits or Federal Circuits.`;
            break;

        case "faq7":
            FaqAnswer = `To avoid being issued a warrant, you have to go to a station's front desk, and utilize the ui to pay it off, if you don't pay it off within 7 days (plus jail time if you've been arrested) you will get a automated warrant.`;
            break;

        case "faq8":
            FaqAnswer = `Please ping us to fix this. This is a issue with the sprinting soft skill.`;
            break;

        case "faq9":
            FaqAnswer = `It will make a audible beep if your car is currently being clocked.`;
            break;
    }

    i.reply({content: FaqAnswer, ephemeral: true});
}