export async function parseWhyNot(location) {
  let content = await fetch(location).then(e => e.text());
  let boxed = parseBox(content);
  let headed = parseHeader(boxed);
  let linked = parseLink(headed);
  let bolded = parseBold(linked);
  return bolded;
};

function parseBox(content) {
  return content.replaceAll(/\[Box\]/g, "<div>").replaceAll(/\[\/Box\]/g, "</div>");
}
function parseHeader(content) {
  let arr = content.split("\n");
  for (let i = 0; i < arr.length; i++) {
    let target = arr[i];
    if (target.startsWith("# ")) {
      arr[i] = "<h1>" + target.slice(2) + "</h1>";
    } else if (target.startsWith("## ")) {
      arr[i] = "<h2>" + target.slice(3) + "</h2>";
    } else if (target.startsWith("### ")) {
      arr[i] = "<h3>" + target.slice(4) + "</h3>";
    } else if (target.startsWith("#### ")) {
      arr[i] = "<h4>" + target.slice(5) + "</h4>";
    };
  }
  return arr.join("\n");
}
function parseLink(content) {
  let arr = content.split("\n");
  for (let j = 0; j < arr.length; j++) {
    if (arr[j].startsWith("[Box]") || arr[j].startsWith("[/Box]")) {
      continue;
    };

    let text = "";
    let text_found = false;
    let link = "";
    let link_found = false;
    let start_index = 0;
    let end_index = 0;
    for (let i = 0; i < arr[j].length; i++) {
      let target = arr[j][i];
      if (target == "[") {
        text_found = true;
        start_index = i;
        continue;
      } else if (target == "]") {
        text_found = false;
        continue;
      };
      if (text_found) {
        text += target;
      };
      if (target == "(" && arr[j][i - 1] == "]") {
        link_found = true;
        continue;
      } else if (target == ")") {
        link_found = false;
        end_index = i;
        continue;
      };
      if (link_found) {
        link += target;
      };
    }
    if (text.length == 0 || link.length == 0) {
      continue;
    }
    let res = `<a href="${link}">${text}</a>`;
    let line = arr[j].slice(0, start_index) + res + arr[j].slice(end_index + 1, arr[j].length);
    arr[j] = line;
  }
  return arr.join("\n");
}

function parseBold(content) {
  return content.replaceAll(/\*(.*?)\*/g, '<b>$1</b>');
}
// await parseWhyNot("./whynot/index.whynot");
// console.log("res: ", parseBold("Kishor is *ded*"));


