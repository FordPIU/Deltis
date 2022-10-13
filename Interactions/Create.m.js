const fs        =   require("fs");
const _UTIL     =   require("../Utilities/_Init");


let Container = {};
Container.Commands = {};
Container.Buttons = {};
Container.Modals = {};
Container.SMenus = {};

exports.Init = async function(client, MAINTENANCE_MODE, MAINTENANCE_IDS)
{
    client.on('interactionCreate', async i => {
        let IsAuth = true;

        // Maintenance Mode Logic
        if (MAINTENANCE_MODE && (i.isChatInputCommand() || i.isButton() || i.isModalSubmit() || i.isSelectMenu())) {
            if (MAINTENANCE_IDS.includes(i.user.id.toString())) { IsAuth = true; }
            else { IsAuth = false; }
        }

        _UTIL.Logger.s(`New Interaction with ${i.user.tag}`, ["NewLine", "BlockAbove", "Magenta"]);

        // Command Inputs
        if (i.isChatInputCommand() && IsAuth) {
            let CommandData = Container.Commands[i.commandName];

            if (CommandData != null) {
                let CFPath = CommandData.FIPath;

                if (fs.existsSync(CFPath)) {
                    require(CFPath)[CommandData.FName](i, client);

                    _UTIL.Logger.s(`User ${i.user.tag} executed Command ${CommandData.EName}`);
                } else {
                    _UTIL.Logger.err(1, 1,[
                        {ToReplace: "__COMMANDNAME__", Replace: CommandData.EName},
                    ], i);
                }
            } else {
                _UTIL.Logger.err(1, 0,[
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

                    _UTIL.Logger.s(`User ${i.user.tag} clicked Button ${ButtonData.EName}`);
                } else {
                    _UTIL.Logger.err(1, 3,[
                        {ToReplace: "__BUTTONNAME__", Replace: ButtonData.EName},
                    ], i);
                }
            } else {
                _UTIL.Logger.err(1, 2,[
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

                    _UTIL.Logger.s(`User ${i.user.tag} submitted Modal ${ModalData.EName}`);
                } else {
                    _UTIL.Logger.err(1, 5,[
                        {ToReplace: "__MODALNAME__", Replace: ModalData.EName},
                    ], i);
                }
            } else {
                _UTIL.Logger.err(1, 4,[
                    {ToReplace: "__MODALNAME__", Replace: i.customId},
                ], i);
            }
        }

        // Select Menu
        if (i.isSelectMenu() && IsAuth) {
            let SMenuData = Container.SMenus[i.customId];

            if (SMenuData != null) {
                let BFPath = SMenuData.FIPath;

                if (fs.existsSync(BFPath)) {
                    require(BFPath)[SMenuData.FName](i, client);

                    _UTIL.Logger.s(`User ${i.user.tag} selected menu ${SMenuData.EName} option ${i.values}`);
                } else {
                    _UTIL.Logger.err(1, 5,[
                        {ToReplace: "__MODALNAME__", Replace: SMenuData.EName},
                    ], i);
                }
            } else {
                _UTIL.Logger.err(1, 4,[
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
    if (Container[IType] == null) { _UTIL.Logger.s(`Failed to Register ${ICommandName}, invalid IType ${IType}`); return; }

    Container[IType][ICommandName] = {
        EName: ECommandName,
        FName: ExecFunct,
        FIPath: FilePath
    };

    _UTIL.Logger.s("Registered " + IType + ": " + ICommandName, ["Dim"]);
}