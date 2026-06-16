import fs from "fs";

const html = fs.readFileSync("e:/未来5年目标/首版摆件/GCCRAFTS开发/index.html", "utf8");
const m = html.match(/<style>([\s\S]*?)<\/style>/);
if (!m) throw new Error("style block not found");

let css = m[1].replace(/url\('data:image[^']+'\)/g, "url('/img/hero-main.jpg')");
fs.writeFileSync("app/index-home.css", css);
console.log("written", css.split("\n").length, "lines");
