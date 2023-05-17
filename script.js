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
    const reset = () => {
      _value = "";
    };
    return {
      getMark,
      setMark,
      reset,
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
    const _huPlayer = Player(playerOneName, "x");
    const _aiPlayer = Player(playerTwoName, "o");
    let _currentPlayerTurn = _huPlayer;
    let _movesLeft = 9;
    let _gameIsEnd = false;

    const showWinner = document.querySelector("[data-showWinner]");
    const showTurn = document.querySelector("[data-showTurn]");

    const switchCurrent = () => {
      _currentPlayerTurn =
        _currentPlayerTurn === _huPlayer ? _aiPlayer : _huPlayer;
      showTurn.innerHTML = `${_currentPlayerTurn.getMark().toUpperCase()}`;
    };
    const getAi = () => _aiPlayer;
    const getHuman = () => _huPlayer;
    const getBoard = () => _board;
    const getCurrentPlayer = () => _currentPlayerTurn;
    const checkTie = () => {
      if (_movesLeft === 0) {
        showWinner.innerHTML = "Tie game!";
        _gameIsEnd = true;
        return true;
      }
      return false;
    };
    const checkWin = (board, player) => {
      let wins = [
        [board[0], board[1], board[2]],
        [board[3], board[4], board[5]],
        [board[6], board[7], board[8]],
        [board[0], board[3], board[6]],
        [board[1], board[4], board[7]],
        [board[2], board[5], board[8]],
        [board[0], board[4], board[8]],
        [board[2], board[4], board[6]],
      ];
      let flag = wins.some((el) =>
        el.every((item) => item.getMark() === player.getMark())
      );
      if (flag) {
        showWinner.innerHTML = `${player.getName()} is the winner!`;
        _gameIsEnd = true;
        return true;
      }
      return false;
    };
    function playRound(num) {
      if (_board[num].getMark() != "") {
        return;
      }
      gameBoard.placeMark(num, _currentPlayerTurn);
      gameBoard.printBoard();
      checkWin(_board, _currentPlayerTurn);
      _movesLeft--;
      checkTie();
      switchCurrent();
    }
    function minimax(newBoard, player) {
      let availSpots = newBoard.reduce(
        (total, current, index) =>
          current.getMark() === "" ? [...total, index] : total,
        []
      );
      if (checkWin(_board, _huPlayer)) {
        return { score: -10 };
      } else if (checkWin(_board, _aiPlayer)) {
        return { score: 10 };
      } else if (availSpots.length === 0) {
        return { score: 0 };
      }
      //an array to collect all the objects
      let moves = [];

      //loop through available spots
      for (let i = 0; i < availSpots.length; i++) {
        //create an object for each and store the index of that spot
        let move = {};
        move.index = newBoard.indexOf(newBoard[availSpots[i]]);

        //set the empty spot to the current player
        newBoard[availSpots[i]].setMark(player.getMark());

        //collect the score resulted from calling minimax on the opponent of the current player
        if (player === _aiPlayer) {
          let result = minimax(newBoard, _huPlayer);
          move.score = result.score;
        } else {
          let result = minimax(newBoard, _aiPlayer);
          move.score = result.score;
        }

        //reset the spot to empty
        newBoard[availSpots[i]].reset();
        _gameIsEnd = false;
        showWinner.innerHTML = "";

        //push the object to the array
        moves.push(move);
      }

      //if it is the computer's turn loop over the moves and choose the move with the highest score
      let bestMove;
      if (player === _aiPlayer) {
        let bestScore = -10000;
        for (let i = 0; i < moves.length; i++) {
          if (moves[i].score > bestScore) {
            bestScore = moves[i].score;
            bestMove = i;
          }
        }
      } else {
        let bestScore = 10000;
        for (let i = 0; i < moves.length; i++) {
          if (moves[i].score < bestScore) {
            bestScore = moves[i].score;
            bestMove = i;
          }
        }
      }

      //return the chosen move (object) from the moves array
      return moves[bestMove];
    }
    const resetGame = () => {
      _movesLeft = 9;
      _board = gameBoard.getBoard();
      _currentPlayerTurn = _huPlayer;
      _gameIsEnd = false;
      showWinner.innerHTML = "";
      showTurn.innerHTML = "X ";
    };
    const isEnd = () => _gameIsEnd;
    return {
      playRound,
      getBoard,
      minimax,
      resetGame,
      isEnd,
      getAi,
      getHuman,
      getCurrentPlayer,
    };
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
        if (controller.isEnd()) return;
        controller.playRound(
          controller.minimax(controller.getBoard(), controller.getAi()).index
        );
      });
    });
  })();
})();
