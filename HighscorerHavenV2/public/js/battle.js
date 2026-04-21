const playerGameSelect = document.getElementById("playerGame");
const playerGameImg = document.querySelector(".playerGameImg");
const playerGameName = document.querySelector(".playerChooseGame .gamename");
const playerAverageTime = document.querySelector(
  ".playerChooseGame .gameAverageTime span",
);
const playerGameRating = document.querySelector(
  ".playerChooseGame .gameRating span",
);
const ratingEl = document.querySelector(".playerChooseGame .gameRating");
const averageTimeEl = document.querySelector(
  ".playerChooseGame .gameAverageTime",
);

function selectGame() {
  const selectedOption =
    playerGameSelect.options[playerGameSelect.selectedIndex];

  if (!selectedOption.value) return;

  playerGameImg.src = selectedOption.dataset.image;
  playerGameName.textContent = selectedOption.dataset.name;
  playerAverageTime.textContent = selectedOption.dataset.playtime;
  playerGameRating.textContent = selectedOption.dataset.rating;
}

playerGameSelect.addEventListener("change", selectGame);
