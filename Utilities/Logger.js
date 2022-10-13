const CONSOLE_UNICODE = {
    // SETTINGS
        "RESET": "\x1b[0m",
        "BRIGHT": "\x1b[1m",
        "DIM": "\x1b[2m",
        "UNDERSCORE": "\x1b[4m",
        "BLINK": "\x1b[5m",
        "REVERSE": "\x1b[7m",
        "HIDDEN": "\x1b[8m",
    // FOREGROUND COLOR
        "BLACK": "\x1b[30m",
        "RED": "\x1b[31m",
        "GREEN": "\x1b[32m",
        "YELLOW": "\x1b[33m",
        "BLUE": "\x1b[34m",
        "MAGENTA": "\x1b[35m",
        "CYAN": "\x1b[36m",
        "WHITE": "\x1b[37m",
    // BACKGROUND COLOR
        "BG_BLACK": "\x1b[40m",
        "BG_RED": "\x1b[41m",
        "BG_GREEN": "\x1b[42m",
        "BG_YELLOW": "\x1b[43m",
        "BG_BLUE": "\x1b[44m",
        "BG_MAGENTA": "\x1b[45m",
        "BG_CYAN": "\x1b[46m",
        "BG_WHITE": "\x1b[47m",

    // CUSTOM
        "NEWLINE": "\n",
        "BLOCKABOVE": "----------------------------------------------------------------------------------------------------\n",
        "BLOCKBELOW": "__STRING__\n----------------------------------------------------------------------------------------------------"
}

const CONSOLE_ERRORS = {
    1: {
        0: "Unregistered Command: __COMMANDNAME__",
        1: "Command File Doesnt Exist for Command: __COMMANDNAME__",
        2: "Unregistered Button: __BUTTONNAME__",
        3: "Button File Doesnt Exist for Button: __BUTTONNAME__",
        4: "Unregistered Modal: __MODALNAME__",
        5: "Modal File Doesnt Exist for Modal: __MODALNAME__"
    }
}



function ParseSettings(Settings) {
    let SettingsString = "";

    // Settings
    Settings.forEach(Setting => {
        let RequestedSetting = CONSOLE_UNICODE[Setting.toUpperCase()]
        if (RequestedSetting!= null) {
            SettingsString += RequestedSetting;
        }
    })

    if (!SettingsString.includes("__STRING__")) {
        SettingsString += "__STRING__";
    }

    // Return
    return SettingsString;
}

function ParseErrorId(ErrorId)
{
    let SErrorId = ErrorId.toString();

    if (SErrorId.length == 1) {
        return `0${SErrorId}`;
    } else { return SErrorId; }
}

function ParseErrorString(String, ReplaceArray)
{
    let WorkString = String;

    if (ReplaceArray != null) {
        ReplaceArray.forEach(Data => {
            let TempString = WorkString.replace(Data.ToReplace, Data.Replace);

            WorkString = TempString;
        });

        return WorkString;
    } else { return String; }
}


/**
 * Log a New String Message.
 * @param { String }        StrMsg      - The Message to Log.
 * @param { Array }         Settings    - Settings for the Message, Including Color, and Optionals.
 */
exports.s = function(StrMsg, Settings)
{
    let SettingsString = "";

    if (Settings != null) { SettingsString = ParseSettings(Settings); } else { SettingsString = "__STRING__" }

    let MasterString = SettingsString.replace("__STRING__", StrMsg);

    console.log(`${CONSOLE_UNICODE.RESET}${MasterString}`);
}

/**
 * 
 * @param {Integer} FileId 
 * @param {Integer} ErrorId 
 * @param {Array} StringPraser 
 * @param {CommandInteraction} Interaction for Responses, may be null
 */
exports.err = function(FileId, ErrorId, StringPraser, Interaction)
{
    let DIErrorId = ParseErrorId(ErrorId);
    let ErrorNumber = `${FileId}${DIErrorId}`
    let ErrorString = CONSOLE_ERRORS[FileId][ErrorId];
    let PrasedString = ParseErrorString(ErrorString, StringPraser);

    exports.s(`ERROR ${ErrorNumber} :: ${PrasedString}`, ["Red"]);

    if (Interaction != null) {
        Interaction.reply({content: `ERROR ${ErrorNumber} :: ${PrasedString}`, ephemeral: true});
    }
}