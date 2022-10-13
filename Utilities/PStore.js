const fs = require("fs");
const FolderDirectory = "./_PStore";

/**
 * @param {String} ArrayName 
 * @param {Any} DataIndexer
 */
 exports.Get = async function(ArrayName, DataIndexer)
 {
     let path = `./${FolderDirectory}/${ArrayName}.json`;
 
     if (fs.existsSync(path)) {
         let JSONFile = fs.readFileSync(path)
         let JArray = JSON.parse(JSONFile);
 
         if (JArray[DataIndexer] != null) {
             return JArray[DataIndexer];
         } else { return null; }
     } else { return null; }
 }
 
 /**
  * 
  * @param {String} ArrayName 
  */
 exports.GetEntire = async function(ArrayName)
 {
     let path = `./${FolderDirectory}/${ArrayName}.json`;
 
     if (fs.existsSync(path)) {
         let JSONFile = fs.readFileSync(path)
         let JArray = JSON.parse(JSONFile);
 
         if (JArray != null) {
             return JArray;
         } else { return null; }
     } else { return null; }
 }
 
 /**
  * @param {String} ArrayName 
  * @param {Any} DataIndexer
  * @param {Array} DataValue
  */
  exports.Set = async function(ArrayName, DataIndexer, DataValue)
  {
      let path = `./${FolderDirectory}/${ArrayName}.json`;
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
 exports.Remove = async function(ArrayName, DataIndexer)
 {
     let path = `./${FolderDirectory}/${ArrayName}.json`;
 
     if (fs.existsSync(path)) {
         let JSONFile = fs.readFileSync(path)
         let JArray = JSON.parse(JSONFile);
 
         if (JArray[DataIndexer] != null) {
             delete JArray[DataIndexer]
 
             fs.writeFileSync(path, JSON.stringify(JArray));
         }
     }
 }