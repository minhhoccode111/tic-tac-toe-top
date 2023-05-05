//THIS JS FILE IS STILL A TIC TAC TOE THAT HUMAN VS HUMAN BUT IT HAS AN UI FOR TWO PLAYERS TO INTERACT WITH
const gameBoard = document.querySelector("[data-gameBoard]");
const items = document.querySelectorAll(".item");
const showTurn = document.querySelector("[data-showTurn]");
const restartButton = document.querySelector("[data-restart]");

let currentPlayer = "X";
let gameState = ["", "", "", "", "", "", "", "", ""];

function renderGameBoard() {
  items.forEach((item, index) => {
    item.innerHTML = `<p>${gameState[index]}</p>`;
  });
}

function handleButtonClick(event) {
  const clickedIndex = Array.from(items).indexOf(event.target);
  if (gameState[clickedIndex] !== "") {
    return;
  }
  gameState[clickedIndex] = currentPlayer;
  renderGameBoard();
  checkWin();
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  showTurn.innerHTML = `${currentPlayer} turn`;
}

function checkWin() {
  const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < winningConditions.length; i++) {
    const [a, b, c] = winningConditions[i];
    if (
      gameState[a] &&
      gameState[a] === gameState[b] &&
      gameState[a] === gameState[c]
    ) {
      showTurn.innerHTML = `${currentPlayer} wins!`;
      gameBoard.removeEventListener("click", handleButtonClick);
      restartButton.style.display = "block";
      return;
    }
  }
  if (!gameState.includes("")) {
    showTurn.innerHTML = `It's a tie!`;
    restartButton.style.display = "block";
  }
}

function handleRestartClick() {
  currentPlayer = "X";
  gameState = ["", "", "", "", "", "", "", "", ""];
  renderGameBoard();
  showTurn.innerHTML = `${currentPlayer} turn`;
  restartButton.style.display = "none";
  gameBoard.addEventListener("click", handleButtonClick);
}

renderGameBoard();
gameBoard.addEventListener("click", handleButtonClick);
restartButton.addEventListener("click", handleRestartClick);
