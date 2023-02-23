"use strict";

let fetchWords = async (url) => {
  let d = await fetch(url);
  let e = await d.text();
  let f = await e.split("\n");
  return f;
};
let moinWords = fetchWords("./lists/Moin_dictionary_words.txt").then(
  (d) => (moinWords = d)
);
let names = fetchWords("./lists/farsi_names.txt").then((d) => (names = d));

let words = moinWords;

document.querySelectorAll(".reset-button").forEach((btn) => {
  let id = btn.dataset.id;
  btn.addEventListener("click", () => {
    if (id === "moin") {
      words = moinWords;
    }
    if (id === "names") {
      words = names;
    }
  });
});

function setLength(l) {
  words = words.filter((w) => w.length === l);
}

function redLetter(r) {
  words = words.filter((w) => !w.includes(r));
}

function yellowLetter(y) {
  words = words.filter((w) => w.includes(y));
}

function greenLetter(i, y) {
  words = words.filter((w) => w[i] === y);
}

function startsWith(i) {
  words = words.filter((w) => w.startsWith(i));
}

function endsWith(i) {
  words = words.filter((w) => w.endsWith(i));
}


function onlyLetters(letters) {
  words = words.filter((word) => {
    for (let w of word) {
      if (!letters.includes(w)) {
        return false;
      }
    }
    return true;
  });
}

function amirza(letters1) {
  words = words.filter((word) => {
    let letters = letters1;
    for (let w of word) {
      if (!letters.includes(w)) {
        return false;
      } else {
        letters = [
          ...letters.slice(undefined, letters.indexOf(w)),
          ...letters.slice(letters.indexOf(w) + 1, undefined),
        ];
      }
    }
    return true;
  });
}

function view() {
  document.querySelector("#length").textContent = words.length.toLocaleString();
  document.querySelector("#result").innerHTML = words
    .map((w) => `<div class="word">${w}</div>`)
    .join("");
}

document.querySelector("#addRed").onclick = () => {
  redLetter(document.querySelector("#red-letter-name").value);
};

document.querySelector("#addYellow").onclick = () => {
  yellowLetter(document.querySelector("#yellow-letter-name").value);
};

document.querySelector("#addGreen").onclick = () => {
  greenLetter(
    Number(document.querySelector("#green-letter-index").value) - 1,
    document.querySelector("#green-letter-name").value
  );
};
document.querySelector("#addAmirza").onclick = () => {
  amirza(document.querySelector("#amirza-letters").value.split(/ +/g));
};

document.querySelector("#setLength").onclick = () => {
  setLength(Number(document.querySelector("#length").value));
};

document.querySelector("#addOnly").onclick = () => {
  onlyLetters(document.querySelector("#only-letters").value.split(/ +/g));
};

document.querySelector("#addStartsWith").onclick = () => {
  startsWith(document.querySelector("#startsWith").value);
};

document.querySelector("#addEndsWith").onclick = () => {
  endsWith(document.querySelector("#endsWith").value);
};


document.querySelectorAll(".btn").forEach((btn) => {
  btn.addEventListener("click", view);
});

document.querySelector(".form-toggle").addEventListener("click", ()=>{
  document.body.classList.toggle("view-form")
});