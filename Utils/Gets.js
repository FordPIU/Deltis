const fs = require("fs");

exports.UserIdFromFilename = async function(fileName)
{
    let FileName = fileName.toString();
    let DashIndex = FileName.indexOf("-") + 1;
    let Subbed = FileName.substring(DashIndex);
    let Replaced = Subbed.replace(".js", "").replace();
    return Replaced;
}

exports.FilesPathFromInteraction = async function (ChannelId, MessageId, CustomId)
{
    let Path1 = `./_Files`;

    if (!fs.existsSync(Path1)) {
        fs.mkdirSync(Path1);
    }


    let Path2 = `${Path1}/${ChannelId}`;

    if (!fs.existsSync(Path2)) {
        fs.mkdirSync(Path2);
    }


    let Path3 = `${Path2}/${MessageId}`;

    if (!fs.existsSync(Path3)) {
        fs.mkdirSync(Path3);
    }

    return `${Path3}/${CustomId}.js`;
}

exports.FilesPathFromInteractionNoFile = async function (ChannelId, MessageId)
{
    let Path1 = `./_Files`;

    if (!fs.existsSync(Path1)) {
        fs.mkdirSync(Path1);
    }


    let Path2 = `${Path1}/${ChannelId}`;

    if (!fs.existsSync(Path2)) {
        fs.mkdirSync(Path2);
    }


    let Path3 = `${Path2}/${MessageId}`;

    if (!fs.existsSync(Path3)) {
        fs.mkdirSync(Path3);
    }

    return `${Path3}`;
}