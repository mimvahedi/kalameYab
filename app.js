"use strict";

let lists = [
  {
    "name": "دهخدا",
    "id": "dehkhoda",
    "link": "./lists/dehkhoda.txt",
  },
  {
    "name": "معین",
    "id": "moin",
    "link": "./lists/Moin_dictionary_words.txt",
  },
  {
    "name": "نام‌ها",
    "id": "names",
    "link": "./lists/farsi_names.txt",
  },
]

let wordsLists = {}

function getList(id) {
  if (wordsLists[id]) return wordsLists[id]
  else if (localStorage.getItem(id)) {
    let parsed = JSON.parse(localStorage.getItem(id))
    wordsLists.id = parsed
    return parsed
  } else {
    let list = lists.find(l => l.id === id)
    if (!list) throw new Error("List not found")
    try {
      fetch(list.link).then(r => r.text()).then(t => {
        let words = t.split("\n")
        wordsLists[id] = words
        localStorage.setItem(id, JSON.stringify(words))
        return words
      })
    } catch (e) {
      throw e
    }
  }
}

let words = getList("dehkhoda");
const perPage = 200;
let nextStart = 0;
let nextEnd = Math.min(perPage, words.length);
const result = document.querySelector("#result");

document.querySelectorAll(".reset-button").forEach((btn) => {
  let id = btn.dataset.id;
  btn.addEventListener("click", () => {
    words = getList(id);
    view()
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
  words = words.filter((word) => word.split("").every(w => letters.includes(w))
  );
}

function amirza(letters1) {
  words = words.filter((word) => {
    let letters = letters1;
    for (let w of word) {
      if (!letters.includes(w)) {
        return false;
      } else {
        letters = [
          ...letters.slice(0, letters.indexOf(w)),
          ...letters.slice(letters.indexOf(w) + 1),
        ];
      }
    }
    return true;
  });
}

function nextPage() {
  for (let i = nextStart; i < nextEnd; i++) {
    const w = document.createElement("div");
    w.classList.add("word");
    w.textContent = words[i];
    result.appendChild(w);
  }
  nextStart = nextEnd;
  nextEnd = Math.min(nextEnd + perPage, words.length);
}

function onScrollNextPage() {
  function isElementInViewport(el) {
    return (
      el.getBoundingClientRect().bottom <=
      (window.innerHeight || document.documentElement.clientHeight)
    );
  }
  if (isElementInViewport(result.querySelector(":last-child"))) {
    nextPage();
  }
}

function view() {
  result.removeEventListener("scroll", onScrollNextPage);
  window.removeEventListener("scroll", onScrollNextPage);
  document.querySelector("#length").dataset.length = 12 || words.length.toLocaleString()
  result.innerHTML = "";
  nextStart = 0;
  nextEnd = perPage;
  nextPage();
  result.addEventListener("scroll", onScrollNextPage);
  window.addEventListener("scroll", onScrollNextPage);
  onScrollNextPage();
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

document.querySelector(".form-toggle").addEventListener("click", () => {
  document.body.classList.toggle("view-form");
});
