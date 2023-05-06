//THIS JS FILE IS TIC TAC TOE GAME HUMAN VS HUMAN AND PLAY WITH HTML UI

(function () {
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
    let _board = [
      Cell(),
      Cell(),
      Cell(),
      Cell(),
      Cell(),
      Cell(),
      Cell(),
      Cell(),
      Cell(),
    ];
    const getBoard = () => _board;
    const placeMark = (num, player) => {
      _board[num].setMark(player.getMark());
    };
    const printBoard = () => {
      const buttons = document.querySelectorAll(".item");
      for (let i = 0; i < buttons.length; i++) {
        buttons[i].children[0].innerHTML = _board[i].getMark();
      }
    };
    const resetBoard = () => {
      _board = _board.map((el) => (el = Cell()));
      printBoard();
    };

    return { getBoard, placeMark, printBoard, resetBoard };
  })();

  const gameController = ((
    playerOneName = "Player One",
    playerTwoName = "Player Two"
  ) => {
    let _board = gameBoard.getBoard();
    let _playerOne = Player(playerOneName, "x");
    let _playerTwo = Player(playerTwoName, "o");
    let _currentPlayerTurn = _playerOne;
    let _movesLeft = 9;
    let _gameIsEnd = false;

    const showWinner = document.querySelector("[data-showWinner]");
    const showTurn = document.querySelector("[data-showTurn]");

    const switchCurrent = () => {
      _currentPlayerTurn =
        _currentPlayerTurn === _playerOne ? _playerTwo : _playerOne;
      showTurn.innerHTML = `${_currentPlayerTurn.getMark().toUpperCase()}`;
    };

    const checkTie = () => _movesLeft === 0;
    const checkWin = () => {
      let wins = [
        [_board[0], _board[1], _board[2]],
        [_board[3], _board[4], _board[5]],
        [_board[6], _board[7], _board[8]],
        [_board[0], _board[3], _board[6]],
        [_board[1], _board[4], _board[7]],
        [_board[2], _board[5], _board[8]],
        [_board[0], _board[4], _board[8]],
        [_board[2], _board[4], _board[6]],
      ];
      let flag = wins.some((el) =>
        el.every((item) => item.getMark() === _currentPlayerTurn.getMark())
      );
      if (flag) {
        showWinner.innerHTML = `${_currentPlayerTurn.getName()} is the winner!`;
        _gameIsEnd = true;
        return;
      }
      if (checkTie()) {
        showWinner.innerHTML = "Tie game!";
        _gameIsEnd = true;
        return;
      }
      switchCurrent();
    };
    function playRound(num) {
      if (_board[num].getMark() != "") {
        return;
      }
      _movesLeft--;
      gameBoard.placeMark(num, _currentPlayerTurn);
      gameBoard.printBoard();
      checkWin();
    }
    const resetGame = () => {
      _movesLeft = 9;
      _board = gameBoard.getBoard();
      _currentPlayerTurn = _playerOne;
      _gameIsEnd = false;
      showWinner.innerHTML = "";
      showTurn.innerHTML = "X ";
    };
    const isEnd = () => _gameIsEnd;
    return { playRound, resetGame, isEnd };
  })();

  (() => {
    const reset = document.querySelector("[data-restart]");
    const buttons = document.querySelectorAll(".item");
    const controller = gameController;
    reset.addEventListener("click", () => {
      gameBoard.resetBoard();
      controller.resetGame();
    });
    buttons.forEach((button, index) => {
      button.addEventListener("click", () => {
        if (controller.isEnd()) return;
        controller.playRound(index);
      });
    });
  })();
})();
