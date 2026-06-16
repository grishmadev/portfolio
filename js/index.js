import { parseWhyNot } from "./whynot.js";
const animateCryptic = (text, elem, duration) => {
  let inter = "";
  let id = setInterval(() => {
    if (inter.length === text.length - 1) {
      clearInterval(id);
    }
    inter += text[inter.length];
    elem.innerHTML = showCryptic(inter, text.length);
  }, duration);
}


function showCryptic(text, len) {
  let neededLen = len - text.length;
  return text + generateRandomWord(neededLen);
}

function generateRandomWord(len) {
  let result = "";
  for (let i = 0; i < len; i++) {
    let randomAlpha = Math.floor(Math.random() * 26) + 97;
    let char = String.fromCharCode(randomAlpha);
    result += char;
  }
  return result;
}

let heading = document.getElementsByClassName("heading");



setTimeout(() => {
  document.title = "hey. lets walk.";
  animateCryptic("Welcome to my Inventory", heading[0], 20);
}, 1500);

// document.addEventListener("DOMContentLoaded", async () => {
//   let content = await parseWhyNot("./whynot/index.whynot");
//   document.getElementById("body").innerHTML = content;
// })


