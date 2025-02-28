let board = [];
let selectedTile = null;
let gameOver = false;
let attempts = parseInt(localStorage.getItem("attempts")) || 0;
let wins = parseInt(localStorage.getItem("wins")) || 0;
document.getElementById("attempts").textContent = attempts;
document.getElementById("wins").textContent = wins;

function initBoard() {
  board = [];
  const boardElement = document.getElementById("board");
  boardElement.innerHTML = "";
  for (let r = 0; r < 4; r++) {
    board[r] = [];
    for (let c = 0; c < 4; c++) {
      let cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = r;
      cell.dataset.col = c;
      if (r === c) {
        board[r][c] = "O";
        cell.textContent = "O";
        cell.classList.add("fixed");
      } else {
        board[r][c] = "";
      }
      cell.addEventListener("click", () => {
        if (gameOver || board[r][c] !== "") return;
        if (selectedTile) {
          animateTileToCell(selectedTile.element, cell).then(() => {
            board[r][c] = selectedTile.letter;
            cell.textContent = selectedTile.letter;
            cell.classList.add("flip");
            selectedTile.element.classList.remove("selected");
            selectedTile.element.remove();
            selectedTile = null;
            updatePoolCounters();
            if (checkFox()) {
              gameOver = true;
              attempts++;
              localStorage.setItem("attempts", attempts);
              document.getElementById("attempts").textContent = attempts;
              document.getElementById("message").textContent = "You lost! Fox found.";
              document.getElementById("reset").style.display = "block";
            } else if (isBoardFull()) {
              gameOver = true;
              attempts++;
              wins++;
              localStorage.setItem("attempts", attempts);
              localStorage.setItem("wins", wins);
              document.getElementById("attempts").textContent = attempts;
              document.getElementById("wins").textContent = wins;
              document.getElementById("message").textContent = "You win! No fox.";
              document.getElementById("reset").style.display = "block";
            }
          });
        }
      });
      boardElement.appendChild(cell);
    }
  }
}

function initPool() {
  const letters = [];
  for (let i = 0; i < 5; i++) { letters.push("X"); }
  for (let i = 0; i < 5; i++) { letters.push("F"); }
  for (let i = 0; i < 2; i++) { letters.push("O"); }
  letters.sort(() => Math.random() - 0.5);
  const poolElement = document.getElementById("pool");
  poolElement.innerHTML = "";
  letters.forEach(letter => {
    let tile = document.createElement("div");
    tile.classList.add("tile");
    tile.dataset.letter = letter;
    tile.innerHTML = '<div class="back"></div>';
    tile.addEventListener("click", () => {
      if (gameOver) return;
      document.querySelectorAll(".tile").forEach(t => t.classList.remove("selected"));
      tile.classList.add("selected");
      selectedTile = { letter: letter, element: tile };
    });
    poolElement.appendChild(tile);
  });
  updatePoolCounters();
}

function updatePoolCounters() {
  const poolTiles = document.querySelectorAll("#pool .tile");
  let counts = { X: 0, F: 0, O: 0 };
  poolTiles.forEach(tile => {
    let l = tile.dataset.letter;
    counts[l]++;
  });
  const poolCounters = document.getElementById("pool-counters");
  poolCounters.textContent = "Remaining - X: " + counts["X"] + " | F: " + counts["F"] + " | O: " + counts["O"];
}

function isBoardFull() {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (board[r][c] === "") return false;
    }
  }
  return true;
}

function checkFox() {
  const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (board[r][c] === "") continue;
      for (let d = 0; d < directions.length; d++) {
        let dr = directions[d][0], dc = directions[d][1];
        let letters = board[r][c];
        let cells = [[r, c]];
        for (let k = 1; k < 3; k++) {
          let nr = r + dr * k;
          let nc = c + dc * k;
          if (nr >= 0 && nr < 4 && nc >= 0 && nc < 4) {
            letters += board[nr][nc];
            cells.push([nr, nc]);
          }
        }
        if (letters.length === 3) {
          if (letters === "FOX" || letters === "XOF") {
            cells.forEach(coord => {
              let cellEl = document.querySelector('.cell[data-row="' + coord[0] + '"][data-col="' + coord[1] + '"]');
              if (cellEl) cellEl.classList.add("highlight");
            });
            return true;
          }
        }
      }
    }
  }
  return false;
}

function animateTileToCell(tileElement, cellElement) {
  return new Promise(resolve => {
    let clone = tileElement.cloneNode(true);
    clone.classList.add("flying");
    document.body.appendChild(clone);
    let tileRect = tileElement.getBoundingClientRect();
    let cellRect = cellElement.getBoundingClientRect();
    clone.style.left = tileRect.left + "px";
    clone.style.top = tileRect.top + "px";
    clone.style.width = tileRect.width + "px";
    clone.style.height = tileRect.height + "px";
    requestAnimationFrame(() => {
      let targetX = cellRect.left + (cellRect.width - tileRect.width) / 2;
      let targetY = cellRect.top + (cellRect.height - tileRect.height) / 2;
      let deltaX = targetX - tileRect.left;
      let deltaY = targetY - tileRect.top;
      clone.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    });
    clone.addEventListener("transitionend", () => {
      clone.remove();
      resolve();
    }, { once: true });
  });
}

function animateCellToPool(cellElement, poolElement) {
  return new Promise(resolve => {
    let clone = document.createElement("div");
    clone.classList.add("tile", "flying");
    clone.textContent = cellElement.textContent;
    document.body.appendChild(clone);
    let cellRect = cellElement.getBoundingClientRect();
    let poolRect = poolElement.getBoundingClientRect();
    clone.style.left = cellRect.left + "px";
    clone.style.top = cellRect.top + "px";
    clone.style.width = cellRect.width + "px";
    clone.style.height = cellRect.height + "px";
    requestAnimationFrame(() => {
      let targetX = poolRect.left + (poolRect.width - cellRect.width) / 2;
      let targetY = poolRect.top + (poolRect.height - cellRect.height) / 2;
      let deltaX = targetX - cellRect.left;
      let deltaY = targetY - cellRect.top;
      clone.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    });
    clone.addEventListener("transitionend", () => {
      clone.remove();
      resolve();
    }, { once: true });
  });
}

function resetGame() {
  const boardElement = document.getElementById("board");
  const poolElement = document.getElementById("pool");
  let animations = [];
  boardElement.querySelectorAll(".cell").forEach(cell => {
    if (!cell.classList.contains("fixed") && cell.textContent !== "") {
      animations.push(animateCellToPool(cell, poolElement));
    }
  });
  Promise.all(animations).then(() => {
    boardElement.classList.add("fade");
    poolElement.classList.add("fade");
    setTimeout(() => {
      gameOver = false;
      document.getElementById("message").textContent = "";
      document.getElementById("reset").style.display = "none";
      initBoard();
      initPool();
      boardElement.classList.remove("fade");
      poolElement.classList.remove("fade");
    }, 500);
  });
}

document.getElementById("reset").addEventListener("click", resetGame);
initBoard();
initPool();