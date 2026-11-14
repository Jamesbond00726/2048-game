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
      tile.className =
        "aspect-square rounded-xl bg-[#cdc1b4] flex items-center justify-center";

      if (grid[i][j] !== 0) {
        tile.textContent = grid[i][j];
      }

      boardElement.appendChild(tile);
    }
  }
}
let score = 0;
const scoreElement = document.getElementById("score");  //score update

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

function move(direction) {  //arrow direction
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

  scoreElement.textContent = score;
  renderBoard();
}
renderBoard();

document.addEventListener("keydown", function (event) {
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

