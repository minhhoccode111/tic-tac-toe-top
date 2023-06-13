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

//#################### DISPLAY ####################
const display = (() => {
  const dp = (board) => {
    console.log(board);
  };

  const winner = (mark) => console.log(`${mark.toUpperCase()} is the winner!`);

  const tie = () => console.log(`It's a tie game!`);

  const invalid = (mark) =>
    console.log(`${mark.toUpperCase()} just made an invalid move! Move again!`);

  return {
    invalid,
    winner,
    dp,
    tie,
  };
})();

//#################### AI ####################
const ai = (() => {
  let _mode = 1; //see 1,3,5,9 moves ahead using minimax algorithm

  const setMode = (mode) => (_mode = mode);

  const deepCopy = () => JSON.parse(JSON.stringify(board.getGrid()));

  const available = (grid) => grid.filter((spot) => spot != "x" && spot != "o");

  function minimax() {}
  return {
    setMode,
    minimax,
    available,
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
  console.log(_grid);

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
    getGrid,
    isValid,
    setGrid,
    reset,
    isTie,
    isWin,
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

    const avail = ai.available(board.getGrid());
    const move = avail[Math.floor(Math.random() * avail.length)];
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
    gameEnded = true;
    current = player0;
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
  window.addEventListener("keyup", (e) => {
    const arr = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
    console.log(e.key);
    if (arr.includes(e.key)) {
      controller.playRound(arr.indexOf(e.key), controller.current.getMark());
    }
  });
})();
