const fs = require("fs");

//----------------------------------------------------------------------------------------------\\
    //                                   INTERNAL SECTION                                   \\    
//----------------------------------------------------------------------------------------------\\

/**
 * Turns the error id into a double int if it isn't already.
 * 0 returns 00
 * 1 returns 01
 * 10 returns 10.
 * @param {Integer} ErrorId
 * @return {String} DIErrorId
 */
async function INTERNAL_DoubleIntErrorId(ErrorId)
{
    let SErrorId = ErrorId.toString();

    if (SErrorId.length == 1) {
        return `0${SErrorId}`;
    } else { return SErrorId; }
}

async function INTERNAL_MultiReplaceString(String, ReplaceArray)
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

//----------------------------------------------------------------------------------------------\\
    //                                ERROR HANDLER SECTION                                 \\    
//----------------------------------------------------------------------------------------------\\

const Errors = {
    1: {
        0: "Unregistered Command: __COMMANDNAME__",
        1: "Command File Doesnt Exist for Command: __COMMANDNAME__",
        2: "Unregistered Button: __BUTTONNAME__",
        3: "Button File Doesnt Exist for Button: __BUTTONNAME__",
        4: "Unregistered Modal: __MODALNAME__",
        5: "Modal File Doesnt Exist for Modal: __MODALNAME__"
    }
}

/**
 * 
 * @param {Integer} FileId 
 * @param {Integer} ErrorId 
 * @param {Array} StringPraser 
 * @param {CommandInteraction} Interaction for Responses, may be null
 */
exports.EHError = async function(FileId, ErrorId, StringPraser, Interaction)
{
    let DIErrorId = await INTERNAL_DoubleIntErrorId(ErrorId);
    let ErrorNumber = `${FileId}${DIErrorId}`
    let ErrorString = Errors[FileId][ErrorId];
    let PrasedString = await INTERNAL_MultiReplaceString(ErrorString, StringPraser);

    console.log(`ERROR ${ErrorNumber} :: ${PrasedString}`);

    if (Interaction != null) {
        Interaction.reply({content: `ERROR ${ErrorNumber} :: ${PrasedString}`, ephemeral: true});
    }
}

//----------------------------------------------------------------------------------------------\\
    //                               PSTORE HANDLER SECTION                                 \\    
//----------------------------------------------------------------------------------------------\\

/**
 * @param {String} ArrayName 
 * @param {Any} DataIndexer
 */
exports.PStore_Get = async function(ArrayName, DataIndexer)
{
    let path = `./_PersistentStorage/${ArrayName}.json`;

    if (fs.existsSync(path)) {
        let JSONFile = fs.readFileSync(path)
        let JArray = JSON.parse(JSONFile);

        if (JArray[DataIndexer] != null) {
            return JArray[DataIndexer];
        } else { return null; }
    } else { return null; }
}

/**
 * @param {String} ArrayName 
 * @param {Any} DataIndexer
 * @param {Array} DataValue
 */
 exports.PStore_Set = async function(ArrayName, DataIndexer, DataValue)
 {
     let path = `./_PersistentStorage/${ArrayName}.json`;
     let WArray = null;
 
     if (fs.existsSync(path)) {
         let JSONFile = fs.readFileSync(path)
         let JArray = JSON.parse(JSONFile);
 
         WArray = JArray;
     } else {
         WArray = {};
     }
 
     WArray[DataIndexer] = DataValue;
 
     fs.writeFileSync(path, JSON.stringify(WArray));
 }

 /**
 * @param {String} ArrayName 
 * @param {Any} DataIndexer
 */
exports.PStore_Remove = async function(ArrayName, DataIndexer)
{
    let path = `./_PersistentStorage/${ArrayName}.json`;

    if (fs.existsSync(path)) {
        let JSONFile = fs.readFileSync(path)
        let JArray = JSON.parse(JSONFile);

        if (JArray[DataIndexer] != null) {
            delete JArray[DataIndexer]

            fs.writeFileSync(path, JSON.stringify(JArray));
        }
    }
}