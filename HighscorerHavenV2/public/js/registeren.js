// img
const avantar = document.querySelectorAll(".avantar");
const chosenAvantar = document.querySelector(".chosenAvantar");
avantar.forEach((button) => {
  button.addEventListener("click", () => {
    const imgSrc = button.querySelector("img").src;
    chosenAvantar.src = imgSrc;
    document.getElementById("avatarInput").value = imgSrc;
  });
});
//Error melding
const params = new URLSearchParams(window.location.search);
const error = params.get("error");
if (error == "1") {
  document.getElementById("errorMsg").textContent =
    "Gebruikersnaam is al in gebruik";
} else if (error == "2") {
  document.getElementById("errorMsg").textContent = "E-mail is al in gebruik";
} else if (error == "3") {
  document.getElementById("errorMsg").textContent =
    "Wachtwoord moet langer dan 6 karakters zijn";
} else if (error == "4") {
  document.getElementById("errorMsg").textContent =
    "Wachtwoord komt niet overeen";
}
