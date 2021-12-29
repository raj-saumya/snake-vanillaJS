const body = document.body;
const container = document.getElementById("main");
const scoreSpan = document.getElementById("score");
const startBtn = document.getElementById("start");
const controller = document.getElementById("controller");
const B_HEIGHT = body.offsetHeight;
const B_WIDTH = body.offsetWidth;
const BOX_SIZE = 24;
const GUTTER = 2;
const SNAKE_COLOR = "#064e3b";
const GRID_CELL_COLOR = "transparent";
const FOOD_COLOR = "red";
const SNAKE = [[0, 0]];
let score = 0;
const ROWS = Math.floor((B_HEIGHT - 200) / (BOX_SIZE + GUTTER));
const COLS = Math.floor((B_WIDTH - 40) / (BOX_SIZE + GUTTER));
let SNAKE_DIR = "RIGHT";
let INTERVAL_ID = null;

/**
 * function to create grid for snake game
 * @param {number} rows
 * @param {number} cols
 * @param {number} size
 * @returns {void}
 */
const createGrid = (rows, cols, size) => {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const box = document.createElement("div");
      box.classList.add("absolute", "border", "border-green-800", "rounded");
      box.style.height = `${size}px`;
      box.style.width = `${size}px`;
      box.style.left = `${i * size + i * GUTTER}px`;
      box.style.top = `${j * size + j * GUTTER}px`;
      container.appendChild(box);
    }
  }
  container.style.marginLeft = `${
    B_WIDTH / 2 - (COLS / 2) * (BOX_SIZE + GUTTER) - 24
  }px`;
};

const initGameListener = () => {
  body.addEventListener("click", ({ target }) => {
    if (target.closest("#start")) {
      startBtn.classList.add("hidden");
      controller.classList.remove("hidden");
      startGame();
    } else if (target.closest("button")) {
      const direction = target.closest("button").dataset.direction;
      const callback = {
        left: SNAKE_DIR !== "RIGHT" ? () => (SNAKE_DIR = "LEFT") : () => {},
        right: SNAKE_DIR !== "LEFT" ? () => (SNAKE_DIR = "RIGHT") : () => {},
        up: SNAKE_DIR !== "DOWN" ? () => (SNAKE_DIR = "UP") : () => {},
        down: SNAKE_DIR !== "UP" ? () => (SNAKE_DIR = "DOWN") : () => {},
      }[direction];
      callback?.();
    }
  });
};

/**
 * function to init event listener for arrow keypress
 */
const initKeyboardEventListener = () => {
  window.addEventListener("keydown", ({ key }) => {
    const callback = {
      ArrowLeft: SNAKE_DIR !== "RIGHT" ? () => (SNAKE_DIR = "LEFT") : () => {},
      ArrowRight: SNAKE_DIR !== "LEFT" ? () => (SNAKE_DIR = "RIGHT") : () => {},
      ArrowUp: SNAKE_DIR !== "DOWN" ? () => (SNAKE_DIR = "UP") : () => {},
      ArrowDown: SNAKE_DIR !== "UP" ? () => (SNAKE_DIR = "DOWN") : () => {},
    }[key];
    callback?.();
  });
};

/**
 * function to return grid items/cells
 * @returns {HTMLDivElement}
 */
const getGridItems = () => container.children;

const colorGridCell = (position, color, id) => {
  const grids = getGridItems();
  const [row, col] = position;
  const cell = grids[row + col * ROWS];
  if (cell) {
    cell.style.background = color;
  } else {
    clearInterval(id);
  }
};

/**
 * function to color the cells where the snake moves
 * @param {array} snake
 * @param {string} color
 * @param {number} id
 * @returns {void}
 */
const initSnake = (snake = [], color, id) => {
  snake.forEach((pos) => {
    colorGridCell(pos, color, id);
  });
};

const cycle = (n) => (x) => (n + (x % n)) % n;

ROWS_CYCLE = cycle(ROWS);
COLS_CYCLE = cycle(COLS);

const checkFoodGrab = (SNAKE) => {
  const grid = getGridItems();
  const head = SNAKE[SNAKE.length - 1];
  const [row, col] = head;
  const cell = grid[row + col * ROWS];
  return cell && cell.style.background === FOOD_COLOR;
};

const growSnake = (SNAKE, direction) => {
  const tail = SNAKE[0];
  switch (direction) {
    case "RIGHT":
      SNAKE.unshift([tail[0], COLS_CYCLE(tail[1] - 1)]);
      break;
    case "LEFT":
      SNAKE.unshift([tail[0], COLS_CYCLE(tail[1] + 1)]);
      break;
    case "UP":
      SNAKE.unshift([ROWS_CYCLE(tail[0] + 1), tail[1]]);
      break;
    case "DOWN":
      SNAKE.unshift([ROWS_CYCLE(tail[0] - 1), tail[1]]);
      break;
    default:
      break;
  }
};

const moveSnake = () => {
  const head = SNAKE[SNAKE.length - 1];
  switch (SNAKE_DIR) {
    case "RIGHT":
      SNAKE.push([head[0], COLS_CYCLE(head[1] + 1)]);
      break;
    case "LEFT":
      SNAKE.push([head[0], COLS_CYCLE(head[1] - 1)]);
      break;
    case "UP":
      SNAKE.push([ROWS_CYCLE(head[0] - 1), head[1]]);
      break;
    case "DOWN":
      SNAKE.push([ROWS_CYCLE(head[0] + 1), head[1]]);
      break;
    default:
      break;
  }
  if (checkFoodGrab(SNAKE)) {
    growSnake(SNAKE, SNAKE_DIR);
    score++;
    scoreSpan.innerText = score;
    spawnFood(3000);
  }
  return [SNAKE.shift(), SNAKE[SNAKE.length - 1]];
};

const generateRandom = (max, min) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const spawnFood = (interval) => {
  let id = setInterval(() => {
    clearInterval(id);
    let row = generateRandom(ROWS - 1, 0);
    let col = generateRandom(COLS - 1, 0);
    colorGridCell([row, col], FOOD_COLOR);
  }, interval);
};

const startGame = () => {
  INTERVAL_ID = setInterval(() => {
    const [tail, head] = moveSnake();
    colorGridCell(tail, GRID_CELL_COLOR, INTERVAL_ID);
    colorGridCell(head, SNAKE_COLOR, INTERVAL_ID);
  }, 160);

  spawnFood(4000);
};

initGameListener();
initKeyboardEventListener();
createGrid(ROWS, COLS, BOX_SIZE);
initSnake(SNAKE, SNAKE_COLOR, INTERVAL_ID);
