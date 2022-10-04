const TemplateType = "Buttons";
const TemplateId = "membership_application";
const MessageId = "0";

const Updater = require("d:/Discord Projects/Deltis/Utils/FileUpdater");

const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const FileBuilder = require("d:/Discord Projects/Deltis/Utils/FileBuilder");

module.exports = async function(interaction)
{
    
    // // FILE UPDATER
    let IsLatest = await Updater.IsFileLatest(TemplateType, TemplateId, __filename);

    if (!IsLatest) {
        await Updater.FileToLatest({Value: true, I: interaction}, TemplateType, TemplateId, __filename);
        return;
    }


    const modal = new ModalBuilder()
        .setCustomId('memapp_step1')
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

    await FileBuilder.BuildUFile("membership_application_2", interaction.channel.id, interaction.message.id, interaction.user.id);
    await interaction.showModal(modal);
}