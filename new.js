// console.log("Hello world from new.js!");
function Player(mark, bot) {
  let _bot = bot;
  const getMark = () => mark;
  const isBot = () => bot;
  const toBot = (boolean) => (_bot = boolean);
  return {
    getMark,
    isBot,
    toBot,
  };
}

const ai = (() => {
  let _mode = 1; //see 1,3,5,9 moves ahead using minimax algorithm

  const setMode = (mode) => (_mode = mode);
  const minimax = () => {};
  return {
    setMode,
    minimax,
  };
})();

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

  const setGrid = (i, mark) => {
    if ((_grid[i] != "x") & (_grid[i] != "o")) _grid[i] = mark;
  };

  const isTie = () => _grid.every((spot) => spot === "x" || spot === "o");

  const isWin = (mark) =>
    winnable.some((wins) => wins.every((win) => _grid[win] === mark));

  const available = () => _grid.filter((spot) => spot != "x" && spot != "o");

  const reset = () => {
    for (let i = 0; i < 9; i++) {
      _grid[i] = i;
    }
  };

  return {
    reset,
    getGrid,
    setGrid,
    available,
    isTie,
    isWin,
  };
})();

const controller = (() => {
  const player0 = Player("x", false);
  const player1 = Player("o", true);

  let current = player0;
  let gameEnded = false;

  const switchCurrent = () =>
    current === player0 ? (current = player1) : (current = player0);

  // const setNumPlayer=num=>

  return {};
})();
