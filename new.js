// console.log("Hello world from new.js!");

//#################### PLAYER ####################
function Player(mark, bot) {
  let _bot = bot;
  let _mark = mark;
  const getMark = () => _mark;
  const setMark = (value) => (_mark = value);
  const isBot = () => bot;
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
    console.log(board);
    for (let i = board.length - 1; i >= 0; i--) {
      if (board[i] === "x" || board[i] === "o") {
        paras[i].textContent = board[i].toUpperCase();
      }
    }
  };

  const winner = (mark) => {
    console.log(`${mark.toUpperCase()} is the winner!`);
    message.textContent = `${mark.toUpperCase()} is the winner!`;
  };

  const tie = () => {
    console.log(`It's a tie game!`);
    message.textContent = `It's a tie game!`;
  };
  const invalid = (mark) => {
    console.log(`${mark.toUpperCase()} just made an invalid move! Move again!`);
    message.textContent = `${mark.toUpperCase()} just made an invalid move! Move again!`;
  };
  const reset = () => {
    paras.forEach((el) => (el.textContent = ""));
  };

  return {
    invalid,
    winner,
    reset,
    tie,
    dp,
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
  let _mode = 2; //see 2,4,6,8 moves ahead using minimax algorithm
  const winnable = board.winnable;

  const setMode = (mode) => (_mode = mode);

  const deepCopy = () => JSON.parse(JSON.stringify(board.getGrid()));

  const available = (grid) => grid.filter((spot) => spot != "x" && spot != "o");

  const isTie = (grid) => available(grid).length === 0;

  const isTerminal = (grid) =>
    winnable.some((win) =>
      win.every((cell) => grid[cell] === "x" || grid[cell] === "o")
    );

  const makeMove = (move, mark, state) => {
    let [...nextState] = state;
    nextState[move] = mark;
    return nextState;
  };

  //If game is already ended when we first check the conditions in the beginning of minimax function call, then the player made the winning move is not this current player. So if this function call has maximizingPlayer is true then we know the one made the winning move is MIN player and vice versa
  const evaluate = (grid, maximizingPlayer) => {
    if (isTerminal(grid))
      return maximizingPlayer ? { score: -10 } : { score: 10 };
    if (available(grid).length === 0) return { score: 0 };
    return maximizingPlayer ? { score: -10000 } : { score: 10000 };
    // if (isTerminal(grid) && !maximizingPlayer) return +10;
    // if (isTerminal(grid) && maximizingPlayer) return -10;
  };

  function useMinimax(maxMark, minMark) {
    const maxPlayer = true;
    const currentState = board.getGrid();
    // const currentState = deepCopy();
    const depth = 9;
    // const depth = _mode;
    return minimax(currentState, depth, maxPlayer, maxMark, minMark);
  }
  function minimax(state, depth, maximizingPlayer, maxMark, minMark) {
    if (depth === 0 || isTerminal(state) || isTie(state)) {
      return evaluate(state, maximizingPlayer);
    }
    let availArr = available(state);

    let moves = [];

    if (maximizingPlayer) {
      let bestScore = -20;
      for (let move of availArr) {
        state[availArr[move]] = maxMark;
        let score = minimax(state, depth - 1, false, maxMark, minMark);
        if (bestScore < score) {
          bestScore = score;
        }
        state[availArr[move]] = availArr[move];
        console.log(bestScore);
        return bestScore;
      }
    } else {
      let bestScore = 20;
      for (let move of availArr) {
        state[availArr[move]] = minMark;
        let score = minimax(state, depth - 1, true, maxMark, minMark);
        if (bestScore > score) {
          bestScore = score;
        }
        state[availArr[move]] = availArr[move];
        console.log(bestScore);
        return bestScore;
      }
    }
  }
  return {
    useMinimax,
    setMode,
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
    if (num === 2) player1.toBot(false);
  };

  const switchMark = () =>
    player0.getMark() === "x" ? player0.setMark("o") : player1.setMark("x");

  const aiPlayRound = (mark) => {
    // const move = ai.minimax();

    // const avail = ai.available(board.getGrid());
    // const move = avail[Math.floor(Math.random() * avail.length)];
    let maxMark;
    let minMark;
    if (mark === "o") {
      maxMark = "o";
      minMark = "x";
    } else if (mark === "x") {
      minMark = "o";
      maxMark = "x";
    }
    const move = ai.useMinimax(maxMark, minMark);
    console.log(move);
    playRound(move, mark);
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

  const reset = () => {
    gameEnded = false;
    current = player0;
    board.reset();
    display.reset();
  };
  return {
    switchCurrent,
    switchMark,
    switchVs,
    reset,
    playRound,
    current,
  };
})();

//#################### LISTENER ####################
const listener = (() => {
  const buttons = Array.from(document.querySelectorAll("[data-input]"));
  const resetBtn = document.getElementById("reset");

  buttons.forEach((b) =>
    b.addEventListener("click", (e) => {
      console.log(b.dataset.index);
      controller.playRound(+b.dataset.index, controller.current.getMark());
    })
  );

  resetBtn.addEventListener("click", controller.reset);

  window.addEventListener("keyup", (e) => {
    const arr = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
    if (arr.includes(e.key)) {
      controller.playRound(arr.indexOf(e.key), controller.current.getMark());
    }
    if (e.key === "Enter") {
      e.preventDefault();
      resetBtn.click();
    }
  });
})();
