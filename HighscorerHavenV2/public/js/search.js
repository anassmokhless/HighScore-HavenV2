// Dropdown suggestions
const input = document.getElementById("search");
const suggestions = document.getElementById("suggestions");
const toggleBtn = document.getElementById("toggle-btn-filter");
const tagsContainer = document.getElementById("tags-container");
const tagsHidden = document.getElementById("tags-hidden");
const checkboxes = document.querySelectorAll(
  '#tags-container input[type="checkbox"]',
);

// Toggle filter dropdown
toggleBtn.addEventListener("click", () => {
  tagsContainer.classList.toggle("open");
});

// Update hidden input wanneer checkbox verandert
checkboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    const selected = Array.from(checkboxes)
      .filter((cb) => cb.checked)
      .map((cb) => cb.value);
    tagsHidden.value = selected.join(",");
  });
});

// Zoek suggesties
input.addEventListener("input", async () => {
  const value = input.value.trim();

  if (value.length < 2) {
    suggestions.innerHTML = "";
    return;
  }

  const res = await fetch(
    `/searchpage/suggest?search=${encodeURIComponent(value)}`,
  );
  const games = await res.json();

  suggestions.innerHTML = "";

  games.forEach((game) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <img src="${game.background_image}" alt="${game.name}">
      <span>${game.name}</span>
    `;
    li.addEventListener("click", () => {
      window.location.href = `/detail/${game.id}`;
    });
    suggestions.appendChild(li);
  });
});

// Verberg dropdown als je erbuiten klikt
document.addEventListener("click", (e) => {
  if (!e.target.closest(".search-wrapper")) {
    suggestions.innerHTML = "";
  }
});
