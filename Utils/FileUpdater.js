const FileBuilder = require("./FileBuilder");
const fs = require("fs");

exports.IsFileLatest = async function(TemplateType, TemplateId, FileToCheckPath)
{
    let nFile = await FileBuilder.GenerateFile(TemplateType, TemplateId, 0);
    let cFile = fs.readFileSync(FileToCheckPath, "utf-8");

    if (nFile.normalize() === cFile.normalize()) { return true; } else { return false; }
}

exports.FileToLatest = async function(ShouldNotify, TemplateType, TemplateId, FilePath)
{
    console.log(`File ${FilePath} is outdated, updating...`);

    let File = await FileBuilder.GenerateFile(TemplateType, TemplateId, 0);

    fs.writeFileSync(FilePath, File);

    console.log(`File ${FilePath} is is finished updating.`);

    if (ShouldNotify.Value) { await ShouldNotify.I.reply({content: "Sorry, I need to reboot to update. Please try again in a few minutes.", ephemeral: true}); }

    process.exit(0);
}