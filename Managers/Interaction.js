const fs = require("fs");
const U = require("../Utils");
const { MAINTENANCE_MODE, MAINTENANCE_IDS } = require("../Config.json")


let Container = {};
Container.Commands = {};
Container.Buttons = {};
Container.Modals = {};

exports.Init = async function(client)
{
    client.on('interactionCreate', async i => {
        let IsAuth = true;

        // Maintenance Mode Logic
        if (MAINTENANCE_MODE && (i.isChatInputCommand() || i.isButton() || i.isModalSubmit())) {
            console.log("Authenticating... " + i.user.id);
            console.log("List of Accepted Ids:");
            console.log(MAINTENANCE_IDS);

            if (MAINTENANCE_IDS.includes(i.user.id.toString())) {
                console.log("USER AUTHENTICATED");

                IsAuth = true;
            } else {
                console.log("USER FAILED AUTHENTICATION.");

                IsAuth = false;
            }
        }

        
        console.log("\nNew Interaction with User " + i.user.tag);

        // Command Inputs
        if (i.isChatInputCommand() && IsAuth) {
            let CommandData = Container.Commands[i.commandName];

            if (CommandData != null) {
                let CFPath = CommandData.FIPath;

                if (fs.existsSync(CFPath)) {
                    require(CFPath)[CommandData.FName](i, client);

                    console.log(`User ${i.user.tag} executed Command ${CommandData.EName}`);
                } else {
                    U.EHError(1, 1,[
                        {ToReplace: "__COMMANDNAME__", Replace: CommandData.EName},
                    ], i);
                }
            } else {
                U.EHError(1, 0,[
                    {ToReplace: "__COMMANDNAME__", Replace: i.commandName},
                ], i);
            }
        }

        // Button Inputs
        if (i.isButton() && IsAuth) {
            let ButtonData = Container.Buttons[i.customId];

            if (ButtonData != null) {
                let BFPath = ButtonData.FIPath;

                if (fs.existsSync(BFPath)) {
                    require(BFPath)[ButtonData.FName](i, client);

                    console.log(`User ${i.user.tag} clicked Button ${ButtonData.EName}`);
                } else {
                    U.EHError(1, 3,[
                        {ToReplace: "__BUTTONNAME__", Replace: ButtonData.EName},
                    ], i);
                }
            } else {
                U.EHError(1, 2,[
                    {ToReplace: "__BUTTONNAME__", Replace: i.customId},
                ], i);
            }
        }

        // Modal Inputs
        if (i.isModalSubmit() && IsAuth) {
            let ModalData = Container.Modals[i.customId];

            if (ModalData != null) {
                let BFPath = ModalData.FIPath;

                if (fs.existsSync(BFPath)) {
                    require(BFPath)[ModalData.FName](i, client);

                    console.log(`User ${i.user.tag} submitted Modal ${ModalData.EName}`);
                } else {
                    U.EHError(1, 5,[
                        {ToReplace: "__MODALNAME__", Replace: ModalData.EName},
                    ], i);
                }
            } else {
                U.EHError(1, 4,[
                    {ToReplace: "__MODALNAME__", Replace: i.customId},
                ], i);
            }
        }

        // Maintnence Mode Auth Message
        if (!IsAuth) { i.reply({content: "I am currently in maintenance mode. Sorry.", ephemeral: true}); }
    });
}


/**
 * @param {String} IType Type of Interaction (Commands, Buttons)
 * @param {String} ICommandName Internal Command Name, Defined by "setName" in Deployer.js
 * @param {String} ECommandName Exposed Command Name, for Logging.
 * @param {String} FilePath Path to the Command File
 * @param {String} ExecFunct Export Function to Call
 */
exports.RegisterInteraction = async function(IType, ICommandName, ECommandName, FilePath, ExecFunct)
{
    if (Container[IType] == null) { console.log(`Failed to Register ${ICommandName}, invalid IType ${IType}`); return; }

    Container[IType][ICommandName] = {
        EName: ECommandName,
        FName: ExecFunct,
        FIPath: FilePath
    };

    console.log("Registered " + IType + ": " + ICommandName);
}