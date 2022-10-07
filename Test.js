const s = "d:/Discord Projects/Deltis/Managers/Interaction";
const f = __dirname


const s_l = s.toLowerCase().replace("\\\\\\\\\\\\", "/");
const s_s = s_l.substring(s_l.indexOf("deltis"), s_l.length)
const f_l = f.toLowerCase().replace("\\", "/");
const f_s = f_l.substring(0, f_l.indexOf("deltis")) + s_s;

console.log("Base: " + s);
console.log("Text Dir: " + f);
console.log("Attempt: " + s_s);
console.log("Full: " + f_s);