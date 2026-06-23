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

const isProjectPage = window.location.pathname.includes("/projects/");
const projectName = window.location.pathname.split("/").pop().replace(".html", "");

setTimeout(() => {
  document.title = isProjectPage ? `${projectName}` : "hey. lets walk through.";
  const headingText = isProjectPage ? projectName.charAt(0).toUpperCase() + projectName.slice(1) : "Welcome to my Inventory";
  animateCryptic(headingText, heading[0], 20);
}, 1500);

let footer = `<div class="responsive footer">
      <div>
        <a href="https://github.com/grishmadev">Github</a>
        <a href="https://linkedin.com/in/kishor-dih">LinkedIn</a>
        <a href="mailto:grishmadev@proton.me">Email</a>
      </div>
    </div>
    <p>last updated: 2026-06-23</p>
`;

document.addEventListener("DOMContentLoaded", async () => {
  let body = document.getElementById("content");
  if (!body) return;
  body.innerHTML = "";

  const whynotPath = isProjectPage ? `../whynot/${projectName}.whynot` : "./whynot/index.whynot";
  let content = await parseWhyNot(whynotPath);
  let arr = content.split(" ");
  let curr_idx = 0;
  let data = "";
  let id = setInterval(() => {
    if (curr_idx === arr.length) {
      clearInterval(id);
      return;
    }
    data += arr[curr_idx] + " ";
    body.innerHTML = data;
    curr_idx += 1;
  }, 0.1)
})
document.getElementById("body").innerHTML += footer;

