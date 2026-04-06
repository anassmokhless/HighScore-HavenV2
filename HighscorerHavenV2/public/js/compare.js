const setupAutocomplete = (inputId, suggestionsId) => {
  const input = document.getElementById(inputId);
  const suggestions = document.getElementById(suggestionsId);

  input.addEventListener("input", async () => {
    const query = input.value;
    suggestions.innerHTML = "";

    if (query.length < 2) {
      suggestions.classList.add("hide");
      return;
    }

    const games = await fetch(
      `/compare/search?q=${encodeURIComponent(query)}`,
    ).then((r) => r.json());

    if (games.length > 0) {
      games.forEach((game) => {
        const li = document.createElement("li");
        li.textContent = game.name;
        li.addEventListener("mousedown", (e) => {
          e.preventDefault();
          input.value = game.name;
          suggestions.innerHTML = "";
          suggestions.classList.add("hide");
        });
        suggestions.appendChild(li);
      });
      suggestions.classList.remove("hide");
    } else {
      suggestions.classList.add("hide");
    }
  });

  input.addEventListener("blur", () => suggestions.classList.add("hide"));
};

setupAutocomplete("game1Name", "suggestions1");
setupAutocomplete("game2Name", "suggestions2");
