// console.log("Hello world from new.js!");

//#################### PLAYER ####################
function Player(mark, bot) {
  let _bot = bot;
  let _mark = mark;
  const getMark = () => _mark;
  const setMark = (value) => (_mark = value);
  const isBot = () => _bot;
  const toBot = (boolean) => (_bot = boolean);
  return {
    getMark,
    setMark,
    isBot,
    toBot,
  };
}

//#################### DISPLAY CONSOLE ####################
//#################### DISPLAY UI ####################
const display = (() => {
  const paras = document.querySelectorAll("[data-input]>p");
  const message = document.getElementById("message");

  const dp = (board) => {
    // console.log(board);
    for (let i = board.length - 1; i >= 0; i--) {
      if (board[i] === "x" || board[i] === "o") {
        paras[i].textContent = board[i].toUpperCase();
      }
    }
  };

  const winner = (mark) => {
    // console.log(`${mark.toUpperCase()} is the winner!`);
    message.textContent = `${mark.toUpperCase()} is the winner!`;
  };

  const tie = () => {
    // console.log(`It's a tie game!`);
    message.textContent = `It's a tie game!`;
  };
  const invalid = (mark) => {
    // console.log(`${mark.toUpperCase()} just made an invalid move! Move again!`);
    message.textContent = `${mark.toUpperCase()} just made an invalid move! Move again!`;
  };
  const reset = () => {
    paras.forEach((el) => (el.textContent = ""));
  };
  const displayGameMode = (mode) => {};

  const displayHumanMark = (mark) => {};

  const displayDifficulty = (diff) => {};

  return {
    invalid,
    winner,
    reset,
    tie,
    dp,
    diff: displayDifficulty,
    mark: displayHumanMark,
    mode: displayGameMode,
  };
})();

//#################### BOARD ####################
const board = (() => {
  let _grid = Array(9);
  const winnable = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 4, 8],
    [2, 4, 6],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
  ];

  for (let i = 0; i < 9; i++) {
    _grid[i] = i;
  }

  const getGrid = () => _grid;

  const isValid = (i) => _grid[i] !== "x" && _grid[i] !== "o";

  const setGrid = (i, mark) => (_grid[i] = mark);

  const isTie = () => _grid.every((spot) => spot === "x" || spot === "o");

  const isWin = (mark) =>
    winnable.some((wins) => wins.every((win) => _grid[win] === mark));

  const reset = () => {
    for (let i = 0; i < 9; i++) {
      _grid[i] = i;
    }
  };

  return {
    winnable,
    getGrid,
    isValid,
    setGrid,
    reset,
    isTie,
    isWin,
  };
})();

//#################### AI ####################
const ai = (() => {
  let _mode = "ez";
  const winnable = board.winnable;

  const switchMode = () => (_mode === "ez" ? (_mode = "hard") : (_mode = "ez"));

  const available = (grid) => grid.filter((spot) => spot != "x" && spot != "o");

  const isTie = (grid) => available(grid).length === 0;

  const isTerminal = (grid, mark) =>
    winnable.some((win) => win.every((cell) => grid[cell] === mark));

  function useMinimax(maxMark, minMark) {
    const state = board.getGrid();
    const availArr = available(state);
    if (_mode === "ez")
      //if _mode is 'ez'
      return { index: availArr[Math.floor(Math.random() * availArr.length)] };
    return minimax(state, 6, true, maxMark, minMark); //else use minimax to see 6 moves ahead
  }
  function minimax(board, depth, maximizingPlayer, maxMark, minMark) {
    let availArr = available(board);

    if (isTerminal(board, maxMark)) return { score: 1 };
    if (isTerminal(board, minMark)) return { score: -1 };
    if (isTie(board)) return { score: 0 };
    if (depth === 0) return { score: 0 };

    let moves = [];

    for (let i = 0; i < availArr.length; i++) {
      let move = {}; //declare an object
      const spot = availArr[i]; //current spot
      move.index = board[spot]; //save current move's index

      if (maximizingPlayer) {
        //if max player
        board[spot] = maxMark; //change spot to maximizing player's mark
        //let result equal to minimax with min player
        let result = minimax(board, depth - 1, false, maxMark, minMark);
        move.score = result.score; //set move's score property to the returned object(which will be another move object inside minimax recursion)'s score
      } else {
        board[spot] = minMark;
        let result = minimax(board, depth - 1, true, maxMark, minMark);
        move.score = result.score;
      }
      board[spot] = move.index; //reset to empty
      moves.push(move); //push each move object
    }

    let bestMove;
    if (maximizingPlayer) {
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
    console.log(moves[bestMove]);
    return moves[bestMove];
  }
  return {
    useMinimax,
    switchMode,
    available,
  };
})();

//#################### CONTROLLER ####################
const controller = (() => {
  const player0 = Player("x", false);
  const player1 = Player("o", true);

  let current = player0;
  let gameEnded = false;

  const switchCurrent = () =>
    current === player0 ? (current = player1) : (current = player0);

  const switchVs = (num) => {
    if (num === 1) player1.toBot(true);
    if (num === 2) {
      player0.toBot(false);
      player1.toBot(false);
    }
  };

  const switchMark = () => {
    if (!player0.isBot()) {
      player0.toBot(true);
      player1.toBot(false);
    } else {
      player0.toBot(false);
      player1.toBot(true);
    }
  };

  const aiPlayRound = (mark) => {
    let maxMark;
    let minMark;
    if (mark === "o") {
      maxMark = "o";
      minMark = "x";
    } else if (mark === "x") {
      maxMark = "x";
      minMark = "o";
    }
    const move = ai.useMinimax(maxMark, minMark);
    playRound(move.index, mark);
  };

  const playRound = (i, mark) => {
    if (gameEnded) return;

    if (!board.isValid(i)) return display.invalid(mark);

    board.setGrid(i, mark);
    display.dp(board.getGrid());

    if (board.isWin(mark)) {
      display.winner(mark);
      gameEnded = true;
      return;
    }

    if (board.isTie()) {
      display.tie();
      gameEnded = true;
      return;
    }

    switchCurrent();

    if (current.isBot()) aiPlayRound(current.getMark());
  };

  const getCurrent = () => current;

  const reset = () => {
    gameEnded = false;
    current = player0;
    board.reset();
    display.reset();
    if (current.isBot()) aiPlayRound(current.getMark());
  };
  return {
    switchCurrent,
    switchMark,
    getCurrent,
    playRound,
    switchVs,
    reset,
  };
})();

//#################### LISTENER ####################
const listener = (() => {
  const buttons = Array.from(document.querySelectorAll("[data-input]"));
  const resetBtn = document.getElementById("reset");
  const xMark = document.getElementById("x-mark");
  const oMark = document.getElementById("o-mark");
  const vsHu = document.getElementById("vsHu");
  const vsAi = document.getElementById("vsAi");
  const ez = document.getElementById("ez");
  const hard = document.getElementById("hard");

  const d = "disabled";

  const disable = (...arg) => {
    for (const el of arg) {
      el.setAttribute(d, true);
    }
  };

  const enable = (...arg) => {
    for (const el of arg) {
      el.removeAttribute(d);
    }
  };

  oMark.addEventListener("click", (e) => {
    controller.switchMark();
    controller.reset();
    display.mark("O");
    disable(oMark);
    enable(xMark);
  });
  xMark.addEventListener("click", (e) => {
    controller.switchMark();
    controller.reset();
    display.mark("X");
    disable(xMark);
    enable(oMark);
  });

  window.addEventListener("DOMContentLoaded", () => {
    disable(ez, xMark, vsAi);
    enable(hard, oMark, vsHu);
    controller.switchVs(1);
    display.mode(`HUMAN VS AI`);
    display.mark("X");
    display.diff("EZ");
  });

  buttons.forEach((b) =>
    b.addEventListener("click", (e) => {
      controller.playRound(+b.dataset.index, controller.getCurrent().getMark());
    })
  );

  resetBtn.addEventListener("click", controller.reset);

  window.addEventListener("keyup", (e) => {
    const arr = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
    if (arr.includes(e.key)) {
      controller.playRound(
        arr.indexOf(e.key),
        controller.getCurrent().getMark()
      );
    }
    if (e.key === "Enter") {
      e.preventDefault();
      resetBtn.click();
    }
  });

  return {};
})();
