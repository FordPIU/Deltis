const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const _CFG = require("../Wrapper").Config.Custom_Guilds.OffBranchRP;
const { guildId, appsChannel, appAcceptRoleGrant } = _CFG;
const IRegistry = require("../Wrapper").Create;
const PStore = require("../Wrapper").Utils.PStore

let UserApplicationData = {};

exports.Init = async function()
{
    await IRegistry.RegisterInteraction("Buttons",
        "membershipapp_pt1_start",
        "Membership Application Part 1 Start",
        __filename,
        "CallPt1Start"
    );

    await IRegistry.RegisterInteraction("Modals",
        "membershipapp_pt1_submit",
        "Membership Application Part 1 Submission",
        __filename,
        "CallPt1Submit"
    );


    await IRegistry.RegisterInteraction("Buttons",
        "membershipapp_pt2_start",
        "Membership Application Part 2 Start",
        __filename,
        "CallPt2Start"
    );

    await IRegistry.RegisterInteraction("Modals",
        "membershipapp_pt2_submit",
        "Membership Application Part 2 Submission",
        __filename,
        "CallPt2Submit"
    );


    await IRegistry.RegisterInteraction("Buttons",
        "membershipapp_accept_reason",
        "Membership Application Accept / Get Reason",
        __filename,
        "CallAcceptReason"
    );

    await IRegistry.RegisterInteraction("Buttons",
        "membershipapp_deny_reason",
        "Membership Application Deny / Get Reason",
        __filename,
        "CallDenyReason"
    );

    await IRegistry.RegisterInteraction("Modals",
        "membershipapp_accept",
        "Membership Application Accept",
        __filename,
        "CallAccept"
    );

    await IRegistry.RegisterInteraction("Modals",
        "membershipapp_deny",
        "Membership Application Deny",
        __filename,
        "CallDeny"
    );
}

exports.CallPt1Start = async function(interaction)
{
    UserApplicationData[interaction.user.id] = {};

    let BlacklistData = await PStore.Get("MembershipBlacklist", interaction.user.id)
    let CurrentEpoch = Math.round(Date.now() / 1000);

    if (BlacklistData == null || (BlacklistData.Waiting == null && BlacklistData.EndTime < CurrentEpoch))
    {
        if (BlacklistData != null) { PStore.Remove("MembershipBlacklist", interaction.user.id); }

        const modal = new ModalBuilder()
            .setCustomId('membershipapp_pt1_submit')
            .setTitle('Membership Application (1/2)');

        const uName = new TextInputBuilder()
            .setCustomId('iName')
            .setLabel("What's your Name?")
            .setPlaceholder('Mark')
            .setMaxLength(15)
            .setMinLength(3)
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const uAge = new TextInputBuilder()
            .setCustomId('iAge')
            .setLabel("How old are you?")
            .setPlaceholder('52')
            .setMaxLength(2)
            .setMinLength(2)
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const uCountry = new TextInputBuilder()
            .setCustomId('iCountry')
            .setLabel("What country do you live in?")
            .setPlaceholder('United States of America')
            .setMaxLength(50)
            .setMinLength(2)
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const uGoals = new TextInputBuilder()
            .setCustomId('iGoals')
            .setLabel("What are you goals as a Member?")
            .setPlaceholder('To become Sheriff.')
            .setMaxLength(4000)
            .setMinLength(10)
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

        const uExperience = new TextInputBuilder()
            .setCustomId('iExperience')
            .setLabel("What experience do you have with RP?")
            .setPlaceholder('Server/Game list, or N/A.')
            .setMaxLength(4000)
            .setMinLength(2)
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

        const Row1 = new ActionRowBuilder().addComponents(uName);
        const Row2 = new ActionRowBuilder().addComponents(uAge);
        const Row3 = new ActionRowBuilder().addComponents(uCountry);
        const Row4 = new ActionRowBuilder().addComponents(uGoals);
        const Row5 = new ActionRowBuilder().addComponents(uExperience);

        modal.addComponents(Row1, Row2, Row3, Row4, Row5);

        await interaction.showModal(modal);
    } else {
        if (BlacklistData != null) {
            if (BlacklistData.Waiting == null) {
                // TIME HANDLER, Turns seconds into the appropiate approx.
                let SecondsRemaining = BlacklistData.EndTime - CurrentEpoch;
                let StringTime = null;

                if (SecondsRemaining > 60) {

                    let MinutesRemaining = Math.floor(SecondsRemaining / 60);

                    if (MinutesRemaining > 60) {
                        
                        let HoursRemaining = Math.floor(MinutesRemaining / 60);

                        if (HoursRemaining > 24) {

                            let DaysRemaining = Math.floor(HoursRemaining / 24);

                            StringTime = `${DaysRemaining} days`
                        } else {
                            StringTime = `${HoursRemaining} hours`;
                        }
                    } else {
                        StringTime = `${MinutesRemaining} minutes`;
                    }
                } else {
                    StringTime = `${SecondsRemaining} seconds`;
                }

                // Replies.
                interaction.reply({content: `You cannot apply at this moment. Check again in ${StringTime}.`, ephemeral: true});
            } else {
                interaction.reply({content: `Your application is still pending.`, ephemeral: true});
            }
        } else {
            interaction.reply({content: `You cannot apply at this moment.`, ephemeral: true});
        }
    }
}

exports.CallPt1Submit = async function(interaction)
{
    let SUserId = interaction.user.id;
    let VName = interaction.fields.getTextInputValue('iName');
    let VAge = interaction.fields.getTextInputValue('iAge');
    let VCountry = interaction.fields.getTextInputValue('iCountry');
    let VGoals = interaction.fields.getTextInputValue('iGoals');
    let VExperience = interaction.fields.getTextInputValue('iExperience');

    // if (UserApplicationData[SUserId] == null) { UserApplicationData[SUserId] = {}; }
    
    UserApplicationData[SUserId] = {
        "iName": VName,
        "iAge": VAge,
        "iCountry": VCountry,
        "iGoals": VGoals,
        "iExperience": VExperience
    }

    let button = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('membershipapp_pt2_start')
            .setLabel('Continue your Application!')
            .setStyle(ButtonStyle.Primary),
    );

    interaction.reply({content: "You have completed Step 1/2, please click Continue.", ephemeral: true, components:[button]});
}


exports.CallPt2Start = async function(interaction)
{
    const modal = new ModalBuilder()
        .setCustomId('membershipapp_pt2_submit')
        .setTitle('Membership Application (2/2)');

    const uAgreement = new TextInputBuilder()
        .setCustomId('iAgreement')
        .setLabel("Do you agree to our Discord & In-game Rules?")
        .setPlaceholder('Y/N')
        .setMaxLength(1)
        .setMinLength(1)
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

    const uHear = new TextInputBuilder()
        .setCustomId('iHear')
        .setLabel("How did you hear about us? (OPTIONAL)")
        .setMaxLength(50)
        .setMinLength(2)
        .setStyle(TextInputStyle.Short)
        .setRequired(false);

    const Row1 = new ActionRowBuilder().addComponents(uAgreement);
    const Row2 = new ActionRowBuilder().addComponents(uHear);

    modal.addComponents(Row1, Row2);

    await interaction.showModal(modal);
}

exports.CallPt2Submit = async function(interaction, client)
{
    interaction.reply({content: "You Application has been sent for review, you will get a DM upon response. Please ensure I can send you a DM.", ephemeral: true});

    let IUserId = interaction.user.id;

    let VAgreement = interaction.fields.getTextInputValue('iAgreement');
    let VHear = interaction.fields.getTextInputValue('iHear');
    let Answers = UserApplicationData[IUserId];

    let embed = new EmbedBuilder()
        .setColor([255, 0, 0])
        .setTitle(`${interaction.user.tag}'s Application`)
        .addFields(
            { name: "What's your Name?", value: Answers.iName },
            { name: "How old are you?", value: Answers.iAge },
            { name: "What country do you live in?", value: Answers.iCountry },
            { name: "What are you goals as a Member?", value: Answers.iGoals },
            { name: "What experience do you have with RP?", value: Answers.iExperience },
            { name: "Do you agree to our Discord & In-game Rules?", value: VAgreement },
            { name: "How did you hear about us?", value: VHear },
        )
        .setTimestamp()
        .setFooter({text: IUserId})

    let button = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('membershipapp_accept_reason')
            .setLabel('Accept.')
            .setStyle(ButtonStyle.Primary),

        new ButtonBuilder()
            .setCustomId('membershipapp_deny_reason')
            .setLabel('Deny.')
            .setStyle(ButtonStyle.Danger),
    );
    
    let Oguild = await client.guilds.fetch(guildId);
    let channel = await Oguild.channels.fetch(appsChannel);
    let message = await channel.send({embeds: [embed], components:[button]});

    message.startThread({name: `Discuss ${interaction.user.tag}'s Application.`});

    // Store Persistent Var
    PStore.Set("MembershipBlacklist", IUserId, {Waiting: true});
}

exports.CallAcceptReason = async function(interaction)
{
    const modal = new ModalBuilder()
        .setCustomId('membershipapp_accept')
        .setTitle('Accept Application.');

    const uReason = new TextInputBuilder()
        .setCustomId('iReason')
        .setLabel("Reason")
        .setPlaceholder('Invalid.')
        .setMaxLength(1000)
        .setMinLength(5)
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true);

    const Row1 = new ActionRowBuilder().addComponents(uReason);

    modal.addComponents(Row1);

    await interaction.showModal(modal);
}

exports.CallDenyReason = async function(interaction)
{
    const modal = new ModalBuilder()
        .setCustomId('membershipapp_deny')
        .setTitle('Deny Application.');

    const uReason = new TextInputBuilder()
        .setCustomId('iReason')
        .setLabel("Reason")
        .setPlaceholder('Invalid.')
        .setMaxLength(1000)
        .setMinLength(5)
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true);

    const Row1 = new ActionRowBuilder().addComponents(uReason);

    modal.addComponents(Row1);

    await interaction.showModal(modal);
}

exports.CallAccept = async function(interaction, client)
{
    let IEmbed = interaction.message.embeds[0];
    let UserId = IEmbed.footer.text;
    let Guild = await client.guilds.fetch(guildId);
    let User = await Guild.members.fetch(UserId);
    let Reason = interaction.fields.getTextInputValue('iReason');

    // Send Messages
    await interaction.reply(`<@${interaction.user.id}> Accepted <@${User.id}>'s Application for Membership.`);
    await User.send(`Your Membership Application has been Accepted by <@${interaction.user.id}> for ${Reason}`)

    // Remove Buttons
    await interaction.message.edit({
        content: `Application Denied by <@${interaction.user.id}> for ${Reason}`,
        components: []
    });

    // Close Thread
    let thread = interaction.message.thread;
    await thread.setLocked(true);
    await thread.setArchived(true);

    // Grant Role
    User.roles.add(appAcceptRoleGrant, "Application Accepted.");

    // Remove Hold
    PStore.Remove("MembershipBlacklist", UserId)
}

exports.CallDeny = async function(interaction, client)
{
    let IEmbed = interaction.message.embeds[0];
    let UserId = IEmbed.footer.text;
    let Guild = await client.guilds.fetch(guildId);
    let User = await Guild.members.fetch(UserId);
    let Reason = interaction.fields.getTextInputValue('iReason');

    // Send Messages
    await interaction.reply(`<@${interaction.user.id}> Denied <@${UserId}>'s Application for Membership.`);
    await User.send(`Your Membership Application has been Denied by <@${interaction.user.id}> for ${Reason}.\nYou may try again next week.`)

    // Close Thread
    let thread = interaction.message.thread;
    await thread.setLocked(true);
    await thread.setArchived(true);

    // Remove Buttons
    await interaction.message.edit({
        content: `Application Denied by <@${interaction.user.id}> for ${Reason}`,
        components: []
    });

    // Blacklist from Further Application Submissions for 2 Days.
    let ETime = Math.round(Date.now() / 1000) + 172800;
    PStore.Set("MembershipBlacklist", UserId, {EndTime: ETime});
}