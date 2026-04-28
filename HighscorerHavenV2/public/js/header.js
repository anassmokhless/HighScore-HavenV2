console.log("header.js geladen");

const hamburger = document.getElementById("hamburger");
const nav = document.getElementById("mainNav");

console.log("hamburger:", hamburger);
console.log("nav:", nav);

hamburger.addEventListener("click", () => {
  nav.classList.toggle("open");
});
