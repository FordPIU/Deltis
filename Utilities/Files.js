const fs = require("fs");

exports.GetAllWithExtension = function(Directory, ExtensionString, AllowDeepSearch)
{
    let RList = [];
    let WList = fs.readdirSync(Directory);

    WList.forEach(FileName => {
        if(!FileName.includes(".") && !FileName.includes("node")) {
            if (AllowDeepSearch != null && AllowDeepSearch == true) {
                let EList = exports.GetAllWithExtension(`${Directory}/${FileName}`, ExtensionString, true);

                EList.forEach(EFileName => {
                    // Check for the Extension, to add to the Return
                    if(EFileName.includes(ExtensionString)) {
                        let ToPush = EFileName;
                        RList.push(ToPush);
                    }
                });
            }
        } else {
            // Check for the Extension, to add to the Return
            if(FileName.includes(ExtensionString)) {
                let ToPush = `${Directory}/${FileName}`;
                RList.push(ToPush);
            }
        }
    });

    return RList;
}