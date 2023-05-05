function Player(name, mark) {
  const getName = () => name;
  const getMark = () => mark;
  return { getName, getMark };
}
function Cell() {
  let _value = "";
  const getMark = () => _value;
  const setMark = (mark) => {
    _value = mark;
  };
  return {
    getMark,
    setMark,
  };
}
const gameBoard = (() => {
  const _columns = 3;
  const _rows = 3;
  let _board = [];
  for (let i = 0; i < _columns; i++) {
    _board[i] = [];
    for (let j = 0; j < _rows; j++) {
      _board[i].push(Cell());
    }
  }

  // const getColumns = () => _columns;
  // const getRows = () => _rows;
  const getBoard = () => _board;
  const placeMark = (row, col, player) => {
    _board[row][col].setMark(player.getMark());
  };
  const printBoard = () => {
    let printer = _board.map((row) => row.map((col) => col.getMark()));
    console.table(printer);
  };

  return { getBoard, placeMark, printBoard };
})();
const screenController = (() => {})();

const gameController = ((
  playerOneName = "Player One",
  playerTwoName = "Player Two"
) => {
  const { printBoard, placeMark, getBoard } = gameBoard;
  let _board = getBoard();
  const _screen = screenController;
  let _playerOne = Player(playerOneName, "x");
  let _playerTwo = Player(playerTwoName, "o");
  let _currentPlayerTurn = _playerOne;
  const switchCurrent = () => {
    _currentPlayerTurn =
      _currentPlayerTurn === _playerOne ? _playerTwo : _playerOne;
  };
  const checkWin = () => {
    let wins = [
      [_board[0][0], _board[0][1], _board[0][2]],
      [_board[1][0], _board[1][1], _board[1][2]],
      [_board[2][0], _board[2][1], _board[2][2]],
      [_board[0][0], _board[1][0], _board[2][0]],
      [_board[0][1], _board[1][1], _board[2][1]],
      [_board[0][2], _board[1][2], _board[2][2]],
      [_board[0][0], _board[1][1], _board[2][2]],
      [_board[2][0], _board[1][1], _board[0][2]],
    ];
    let flag = wins.some((el) =>
      el.every((item) => item.getMark() === _currentPlayerTurn.getMark())
    );
    if (flag) {
      alert(`${_currentPlayerTurn.getName()} is the winner!`);
      return;
    }
    switchCurrent();
    playRound();
  };
  const playRound = () => {
    let row, col;
    let flag = true;
    while (flag) {
      row = parseInt(
        prompt(
          `It's ${_currentPlayerTurn.getName()} turn. Which row do you choose? (Between 1 and 3!)`
        )
      );
      col = parseInt(
        prompt(
          `It's ${_currentPlayerTurn.getName()} turn. Which column do you choose? (Between 1 and 3!)`
        )
      );

      if (
        isNaN(row) ||
        isNaN(col) ||
        row < 1 ||
        row > 3 ||
        col < 1 ||
        col > 3 ||
        _board[row - 1][col - 1].getMark() != ""
      ) {
        alert("Invalid move");
        continue;
      }
      flag = false;
    }
    row -= 1; //change back to index type
    col -= 1;
    placeMark(row, col, _currentPlayerTurn);
    printBoard();
    checkWin();
  };
  return { playRound };
})();

const game = gameController;
game.playRound();
