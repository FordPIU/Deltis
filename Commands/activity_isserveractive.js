const IActive = false;
const IRegistry = require("../Managers/Interaction");

exports.Init = async function()
{
    await IRegistry.RegisterInteraction("Commands",
        "isactive",
        "Is Server Active",
        __filename,
        "GetActive"
    );

    await IRegistry.RegisterInteraction("Commands",
        "setactive",
        "Set Server Active",
        __filename,
        "SetActive"
    );
}

exports.GetActive = async function(interaction)
{
    if (IActive) {
        interaction.reply({content: "Server is active!", ephemeral: true});
    } else {
        interaction.reply({content: "Server is inactive.", ephemeral: true});
    }
}

exports.SetActive = async function(interaction)
{
    let InputActive = interaction.options.getBoolean('active');

    if (InputActive) {
        IActive = true;
        interaction.reply({content: "Successfully set the server to active.", ephemeral: true});
    } else {
        IActive = false;
        interaction.reply({content: "Successfully set the server to inactive.", ephemeral: true});
    }
}