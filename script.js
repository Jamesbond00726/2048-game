// Initialization of 4X4 array which is used as for tiles

const rows = 4;
const cols = 4;
const grid = [];

for (let i = 0; i < rows; i++) {
  grid[i] = [];
  for (let j = 0; j < cols; j++) {
    grid[i][j] = 0;
  }
}

// 2 random starting tiles

function addStartingTile() {
  const emptyCells = [];

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (grid[i][j] === 0) {
        emptyCells.push([i, j]);
      }
    }
  }

  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  const [row, col] = emptyCells[randomIndex];
  grid[row][col] = 2;
}

addStartingTile();
addStartingTile();

// Creating and displaying tiles for the board

const boardElement = document.getElementById("board");

function renderBoard() {
  boardElement.replaceChildren();

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const tile = document.createElement("div");
      const value = grid[i][j];

      const tileColors = {
        2: "bg-[#eee4da] text-[#776e65]",
        4: "bg-[#ede0c8] text-[#776e65]",
        8: "bg-[#f2b179] text-white",
        16: "bg-[#f59563] text-white",
        32: "bg-[#f67c5f] text-white",
        64: "bg-[#f65e3b] text-white",
        128: "bg-[#edcf72] text-white",
        256: "bg-[#edcc61] text-white",
        512: "bg-[#edc850] text-white",
        1024: "bg-[#edc53f] text-white",
        2048: "bg-[#edc22e] text-white"
      };

      tile.className =
        "aspect-square rounded-xl flex items-center justify-center text-2xl font-bold";

      if (value === 0) {
        tile.classList.add("bg-[#cdc1b4]");
      } else {
        tile.textContent = value;
        tile.classList.add(...(tileColors[value] || "bg-[#3c3a32] text-white").split(" "));
      }

      boardElement.appendChild(tile);
    }
  }
}
let score = 0;
const scoreElement = document.getElementById("score");  //score update

let won = false;
let gameOver = false;
const gameMessage = document.getElementById("game-message");

function moveLine(line) {  //merging and removing of tiles
  const numbers = line.filter(value => value !== 0);

  for (let i = 0; i < numbers.length - 1; i++) {
    if (numbers[i] === numbers[i + 1]) {
      numbers[i] *= 2;
      score += numbers[i];
      numbers.splice(i + 1, 1);
    }
  }

  while (numbers.length < cols) {
    numbers.push(0);
  }

  return numbers;
}
function hasMovesAvailable() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (grid[i][j] === 0) return true;
      if (j < cols - 1 && grid[i][j] === grid[i][j + 1]) return true;
      if (i < rows - 1 && grid[i][j] === grid[i + 1][j]) return true;
    }
  }

  return false;
}

function move(direction) {
  if (gameOver) return;

  const previousGrid = JSON.stringify(grid);

  for (let i = 0; i < rows; i++) {
    let line = [];

    for (let j = 0; j < cols; j++) {
      if (direction === "left" || direction === "right") {
        line.push(grid[i][j]);
      } else {
        line.push(grid[j][i]);
      }
    }

    if (direction === "right" || direction === "down") {
      line.reverse();
    }

    line = moveLine(line);

    if (direction === "right" || direction === "down") {
      line.reverse();
    }

    for (let j = 0; j < cols; j++) {
      if (direction === "left" || direction === "right") {
        grid[i][j] = line[j];
      } else {
        grid[j][i] = line[j];
      }
    }
  }

  if (JSON.stringify(grid) === previousGrid) return;

  if (!won && grid.some(row => row.includes(2048))) {
    won = true;
    gameMessage.textContent = "You reached 2048! You win!";
    gameMessage.classList.remove("hidden");
  }

  addStartingTile();

  if (!hasMovesAvailable() && !won) {
    gameOver = true;
    gameMessage.textContent = "No moves left!";
    gameMessage.classList.remove("hidden");
  }

  scoreElement.textContent = score;
  renderBoard();
}
renderBoard();

function startNewGame() {  // new game 
  gameOver = false;
  won = false;
  gameMessage.classList.add("hidden");
  for (let i = 0; i < rows; i++) {
    grid[i].fill(0);
  }

  score = 0;
  scoreElement.textContent = score;

  addStartingTile();
  addStartingTile();

  renderBoard();
}

const newGameButton = document.getElementById("new-game");
newGameButton.addEventListener("click", startNewGame);

document.addEventListener("keydown", function (event) {  // Arrow key movements
  const directions = {
    ArrowLeft: "left",
    ArrowRight: "right",
    ArrowUp: "up",
    ArrowDown: "down"
  };

  if (directions[event.key]) {
    event.preventDefault();
    move(directions[event.key]);
  }
});

let touchStartX = 0;
let touchStartY = 0;

boardElement.style.touchAction = "none";

boardElement.addEventListener("pointerdown", event => {
  touchStartX = event.clientX;
  touchStartY = event.clientY;
});

boardElement.addEventListener("pointerup", event => {
  const dx = event.clientX - touchStartX;
  const dy = event.clientY - touchStartY;

  if (Math.max(Math.abs(dx), Math.abs(dy)) < 30) return;

  if (Math.abs(dx) > Math.abs(dy)) {
    move(dx > 0 ? "right" : "left");
  } else {
    move(dy > 0 ? "down" : "up");
  }
});

