const input = document.getElementById('search');
const suggestions = document.getElementById('suggestions');

input.addEventListener('input', async () => {
  const value = input.value.trim();

  if (value.length < 2) {
    suggestions.innerHTML = '';
    return;
  }

  const res = await fetch(`/searchpage/suggest?search=${encodeURIComponent(value)}`);
  const games = await res.json();

  suggestions.innerHTML = '';

  games.forEach(game => {
    const li = document.createElement('li');
    li.innerHTML = `
      <img src="${game.background_image}" alt="${game.name}">
      <span>${game.name}</span>
    `;
    li.addEventListener('click', () => {
      window.location.href = `/detailpage/${game.id}`;
    });
    suggestions.appendChild(li);
  });
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('.search-wrapper')) {
    suggestions.innerHTML = '';
  }
});