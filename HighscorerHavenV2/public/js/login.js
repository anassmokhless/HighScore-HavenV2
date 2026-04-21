const params = new URLSearchParams(window.location.search);
if (params.get("error") == "true") {
  document.getElementById("errorMsg").textContent =
    "Gebruikersnaam of wachtwoord klopt niet";
}
