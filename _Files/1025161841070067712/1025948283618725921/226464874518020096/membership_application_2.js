const TemplateType = "Applications";
const TemplateId = "membership_application_2";
const MessageId = "1025948283618725921";

const Updater = require("d:/Discord Projects/Deltis/Utils/FileUpdater");

const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Var = require('d:/Discord Projects/Deltis/Utils/VariableStorage');
const FileBuilder = require("d:/Discord Projects/Deltis/Utils/FileBuilder");

module.exports = async function(interaction)
{
    
    // // FILE UPDATER
    let IsLatest = await Updater.IsFileLatest(TemplateType, TemplateId, __filename);

    if (!IsLatest) {
        await Updater.FileToLatest({Value: true, I: interaction}, TemplateType, TemplateId, __filename);
        return;
    }


    let SUserId = interaction.user.id;
    let VName = interaction.fields.getTextInputValue('iName');
    let VAge = interaction.fields.getTextInputValue('iAge');
    let VCountry = interaction.fields.getTextInputValue('iCountry');
    let VGoals = interaction.fields.getTextInputValue('iGoals');
    let VExperience = interaction.fields.getTextInputValue('iExperience');
    
    await Var.Store(SUserId, "iName", VName);
    await Var.Store(SUserId, "iAge", VAge);
    await Var.Store(SUserId, "iCountry", VCountry);
    await Var.Store(SUserId, "iGoals", VGoals);
    await Var.Store(SUserId, "iExperience", VExperience);

    let button = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('!B_BYPASS!membership_application_3')
            .setLabel('Continue your Application!')
            .setStyle(ButtonStyle.Primary),
    );

    await FileBuilder.BuildUFile("membership_application_3", interaction.channel.id, interaction.message.id, SUserId);
    interaction.reply({content: "You have completed Step 1/2, please click Continue.", ephemeral: true, components:[button]});
}