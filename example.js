function Gameboard() {
  const rows = 6;
  const columns = 7;
  const board = [];
  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }
  const getBoard = () => board;
  const getRows = () => rows;
  const getColumns = () => columns;
  const dropToken = (column, player) => {
    let lowest;
    for (let i = rows - 1; i >= 0; i--) {
      if (board[i][column].getValue() === "") {
        lowest = i;
        break;
      }
    }
    if (!(lowest >= 0)) {
      alert("Invalid move!");
      return;
    }
    board[lowest][column].addToken(player);
  };
  const printBoard = () => {
    const boardWithCellValue = board.map((row) =>
      row.map((cell) => cell.getValue())
    );
    console.table(boardWithCellValue);
  };
  return {
    printBoard,
    getBoard,
    getRows,
    getColumns,
    dropToken,
  };
}

function Cell() {
  let value = "";
  const addToken = (player) => {
    value = player;
  };
  const getValue = () => value;
  return { addToken, getValue };
}

function Player(name, token) {
  const getName = () => name;
  const getToken = () => token;
  return { getName, getToken };
}

function GameController(p1Name = "Player One", p2Name = "Player Two") {
  const board = Gameboard();
  const players = [Player(p1Name, "x"), Player(p2Name, "o")];
  let activePlayer = players[0];
  const getActivePlayer = () => activePlayer;
  const switchTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };
  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().getName()}'s turn.`);
  };
  const checkWin = (tokenOfActivePlayer) => {
    for (let i = board.getRows() - 1; i >= 0; i--) {
      for (let j = 0; j <= board.getColumns() - 4; j++) {
        let allTheSame = [
          board.getBoard()[i][j],
          board.getBoard()[i][j + 1],
          board.getBoard()[i][j + 2],
          board.getBoard()[i][j + 3],
        ].every((el) => el.getValue() === tokenOfActivePlayer);
        if (allTheSame) {
          alert(`${getActivePlayer().getName()} is the winner!`);
          return;
        }
      }
    }
    for (let i = board.getRows() - 1; i >= 3; i--) {
      for (let j = 0; j < board.getColumns(); j++) {
        let allTheSame = [
          board.getBoard()[i][j],
          board.getBoard()[i - 1][j],
          board.getBoard()[i - 2][j],
          board.getBoard()[i - 3][j],
        ].every((el) => el.getValue() === tokenOfActivePlayer);
        if (allTheSame) {
          alert(`${getActivePlayer().getName()} is the winner!`);
          return;
        }
      }
    }

    for (let i = board.getRows() - 1; i >= 3; i--) {
      for (let j = 0; j <= board.getColumns() - 4; j++) {
        let allTheSame = [
          board.getBoard()[i][j],
          board.getBoard()[i - 1][j + 1],
          board.getBoard()[i - 2][j + 2],
          board.getBoard()[i - 3][j + 3],
        ].every((el) => el.getValue() === tokenOfActivePlayer);
        if (allTheSame) {
          alert(`${getActivePlayer().getName()} is the winner!`);
          return;
        }
      }
    }
    for (let i = board.getRows() - 1; i >= 3; i--) {
      for (let j = board.getColumns() - 1; j >= 3; j--) {
        let allTheSame = [
          board.getBoard()[i][j],
          board.getBoard()[i - 1][j - 1],
          board.getBoard()[i - 2][j - 2],
          board.getBoard()[i - 3][j - 3],
        ].every((el) => el.getValue() === tokenOfActivePlayer);
        if (allTheSame) {
          alert(`${getActivePlayer().getName()} is the winner!`);
          return;
        }
      }
    }
  };
  const playTurn = (column) => {
    console.log(
      `Dropping ${getActivePlayer().getName()}'s token into column ${column}...`
    );
    board.dropToken(column, getActivePlayer().getToken());
    printNewRound();
    checkWin(getActivePlayer().getToken());
    switchTurn();
  };
  printNewRound();
  console.log(activePlayer.getToken());
  return {
    playTurn,
    getActivePlayer,
  };
}

const game = GameController();
