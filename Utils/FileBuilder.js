const Get = require("./Gets");
const fs = require("fs");
const var_TemplatesPath = "./Utils/Templates";

exports.GenerateFile = async function(TemplateType, TemplateId, MessageId)
{
    let {FileUpdater_Consts, FileUpdater_Body} = require("./Templates/_FileUpdater.btjs");

    let FileToCopy = fs.readFileSync(`${var_TemplatesPath}/${TemplateType}/${TemplateId}.btjs`, "utf-8").toString();

    let FileConsts = `const TemplateType = "${TemplateType}";\nconst TemplateId = "${TemplateId}";\nconst MessageId = "${MessageId}";\n` + FileUpdater_Consts;

    let FileBody = FileToCopy.replace("__FCF:I__", FileUpdater_Body).replace("MEAFI", "module.exports = async function(interaction)");

    let FileToPaste = `${FileConsts}\n${FileBody}`

    return FileToPaste;
}

exports.BuildFile = async function(TemplateId, ChannelId, MessageId)
{
    let File = await exports.GenerateFile("Buttons", TemplateId, MessageId);
    let Path = await Get.FilesPathFromInteraction(ChannelId, MessageId, TemplateId);

    fs.writeFileSync(Path, File);

    console.log(`Created File ${Path}`);
}

exports.BuildUFile = async function(TemplateId, ChannelId, MessageId, UserId)
{
    let File = await exports.GenerateFile("Applications", TemplateId, MessageId);
    let Path = await Get.FilesPathFromInteractionNoFile(ChannelId, MessageId, TemplateId);

    if (!fs.existsSync(`${Path}/${UserId}`)) {
        fs.mkdirSync(`${Path}/${UserId}`);
    }

    fs.writeFileSync(`${Path}/${UserId}/${TemplateId}.js`, File);

    console.log(`Created File ${Path}/${UserId}/${TemplateId}`);
}

exports.DebuildMessage = async function(ChannelId, MessageId)
{
    let Path = await Get.FilesPathFromInteractionNoFile(ChannelId, MessageId);

    fs.rm(Path, {
        recursive: true,
    }, (error) => {
        if (error) {
            console.error(error.message);
        } else {
            console.log(`Deleted ${Path}`);
        }
    });
}

exports.DebuildUFile = async function(TemplateId, ChannelId, MessageId, UserId)
{
    let Path = await Get.FilesPathFromInteractionNoFile(ChannelId, MessageId, TemplateId);

    fs.unlinkSync(`${Path}/${UserId}/${TemplateId}.js`);

    console.log(`Created File ${Path}/${UserId}/${TemplateId}`);
}