class Tetromino {
  constructor(type) {
    this.type = type;
    this.blocks = [];
    switch (this.type) {
      case "I":
        this.color = "cyan";
        break;
      case "O":
      case "o":
        this.color = "yellow";
        break;
    }
  }

  // Spawns the tetromino at the top center of the game field
  // returns pointer to itself
  spawnTetromino() {
    switch (this.type) {
      case "I":
        for (let i = 0; i < 4; i++) {
          this.blocks[i] = new Block(4, i, this.color);
        }
        break;
      case "o":
      case "O":
        this.blocks[0] = new Block(4, 0, this.color);
        this.blocks[1] = new Block(4, 1, this.color);
        this.blocks[2] = new Block(5, 0, this.color);
        this.blocks[3] = new Block(5, 1, this.color);
        break;
    }
    return this;
  }

  // Draws out the tetromino according to it's own block coordinates
  drawTetromino(ctx) {
    for (let block of this.blocks) {
      block.drawBlock(ctx);
    }
  }

  // Clears tetromino drawing, for use when tetromino position updates
  unDrawTetromino(ctx) {
    for (let block of this.blocks) {
      block.unDrawBlock(ctx);
    }
  }

  // Moves a tetromino one step to the left/right, according to given argument
  // Returns true upon successfull movement, false if movement would result in collision
  shiftTetromino(direction) {
    for (let block of this.blocks) {
      if (block.willCollide(direction)) {
        return false;
      }
    }
    for (let block of this.blocks) {
      block.shiftBlock(direction);
    }
    return true;
  }

  // Increments the game state, moving the tetromino down, settling it if it collides
  nextStep(ctx) {
    if (this.willSettle()) {
      this.writeToGameGrid(gameGrid);
    } else {
      this.unDrawTetromino(ctx);
      for (let block of this.blocks) {
        block.moveDown();
      }
      this.drawTetromino(ctx);
    }
  }

  // Checks wether or not the tetromino will collide when moved according to the given argument.
  // Returns true if movement would result in collision, false otherwise
  willCollide(direction) {
    for (let block of this.blocks) {
      if (block.willCollide(direction)) {
        console.log("will collide", direction);
        return true;
      }
    }
    return false;
  }

  // Checks wether or not the tetromino will settle when the game state increments (or user manually pushes piece down)
  // Returns true if movement would result in the piece settling, false otherwise
  willSettle() {
    for (let block of this.blocks) {
      if (block.willSettle()) {
        return true;
      }
    }
    return false;
  }

  // Retrives the coordinates for all the tetromino's blocks, updating the gameGrid array to include these.
  // Returns the updated grid
  writeToGameGrid(gameGrid) {
    for (let block of this.blocks) {
      gameGrid[block.getY()][block.getX()] = block;
    }
    return gameGrid;
  }

  getRows() {
    let yValues = [];
    for (let block of this.blocks) {
      if (!yValues.includes(block.getY())) {
        yValues.push(block.getY());
      }
    }
    return yValues;
  }
}

class Block {
  static blockSize;
  static numCols;

  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
  }

  setSize(argBlockSize) {
    blockSize = argBlockSize;
  }

  drawBlock(ctx) {
    // Starting draw coorinates
    ctx.beginPath();
    ctx.rect(
      this.x * blockSize,
      this.y * blockSize,
      Block.blockSize,
      Block.blockSize
    );

    // Fill
    ctx.fillStyle = "black";
    ctx.fill();

    ctx.beginPath();
    ctx.rect(
      this.x * blockSize + 1,
      this.y * blockSize + 1,
      Block.blockSize - 2,
      Block.blockSize - 2
    );
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  unDrawBlock(ctx) {
    ctx.beginPath();
    ctx.rect(
      this.x * blockSize,
      this.y * blockSize,
      Block.blockSize,
      Block.blockSize
    );

    // Fill
    ctx.fillStyle = "white";
    ctx.fill();
  }

  shiftBlock(direction) {
    if (direction === "left") {
      this.x--;
    } else if (direction === "right") {
      this.x++;
    } else {
      console.log("Invalid block shift call");
    }
  }

  moveDown() {
    this.y++;
  }

  willCollide(direction) {
    if (direction === "left") {
      return this.x - 1 < 0 || gameGrid[this.y][this.x - 1] !== null;
    } else if (direction === "right") {
      return (
        this.x + 1 >= Block.numCols || gameGrid[this.y][this.x + 1] !== null
      );
    }
  }

  willSettle() {
    return this.y + 1 >= ROWS || gameGrid[this.y + 1][this.x] !== null;
  }

  getX() {
    return this.x;
  }

  getY() {
    return this.y;
  }
}

// Gamebaord properties
const COLS = 10;
const ROWS = 18;

// Block properties
const blockSize = 30;

// Gameboard grid
const gameGrid = [];
for (let i = 0; i < ROWS; i++) {
  gameGrid[i] = [];
  for (let j = 0; j < COLS; j++) {
    gameGrid[i][j] = null;
  }
}

// Canvas elements
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const boardHeight = (canvas.height = ROWS * blockSize);
const boardWidth = (canvas.width = COLS * blockSize);
let paused = false;
Block.blockSize = blockSize;
Block.numCols = COLS;

let curTetromino;
const shape1 = new Tetromino("o");
curTetromino = shape1.spawnTetromino(ctx);

curTetromino.drawTetromino(ctx);

let interval = setInterval(() => {
  if (!paused) {
    incrementGameState();
  }
}, 200);

document.addEventListener("keydown", (event) => {
  console.log(event.key.toLowerCase());
  if (event.key.toLowerCase() === "escape") {
    paused = !paused;
    printGrid(gameGrid);
    return;
  }
  if (!paused) {
    switch (event.key.toLowerCase()) {
      case "a":
        if (!curTetromino.willCollide("left")) {
          curTetromino.unDrawTetromino(ctx);
          curTetromino.shiftTetromino("left");
          curTetromino.drawTetromino(ctx);
        }
        break;

      case "d":
        if (!curTetromino.willCollide("right")) {
          curTetromino.unDrawTetromino(ctx);
          curTetromino.shiftTetromino("right");
          curTetromino.drawTetromino(ctx);
        }
        break;

      case "s":
        incrementGameState();
        break;
    }
  }
});

//
//
//
// Prints a string representation of a 2-D array

function newTetromino() {
  console.log("entered spawn");
  const tetromino = new Tetromino("O");
  curTetromino = tetromino.spawnTetromino(ctx);
  curTetromino.drawTetromino(ctx);
  return curTetromino;
}

function printGrid(grid) {
  let printString = "[\n";
  for (let i = 0; i < grid.length; i++) {
    printString += "[";
    for (let j = 0; j < grid[i].length; j++) {
      printString += `${grid[i][j]} `;
    }
    printString = printString.slice(0, printString.length - 1);
    printString += "],\n";
  }
  printString += "]";
  console.log(printString);
}

function clearBlock(x, y) {
  gameGrid[y][x] = null;
}

function clearGrid() {
  for (let i = 0; i < gameGrid.length; i++) {
    for (let j = 0; j < gameGrid[i].length; j++) {
      gameGrid[i][j] = null;
    }
  }
}

function checkRow(y) {
  for (let x = 0; x < gameGrid[y].length; x++) {
    if (gameGrid[y][x] === null) {
      return false;
    }
  }
  console.log("row is full");
  return true;
}

function clearRow(y) {
  for (let x = 0; x < gameGrid[y].length; x++) {
    console.log("trying to clear row");
    gameGrid[y][x].unDrawBlock(ctx);
    gameGrid[y][x] = null;
  }
}

function shiftRowDown(y) {
  for (let x = 0; x < gameGrid[y].length; x++) {
    if (gameGrid[y][x] !== null) {
      let curBlock = gameGrid[y][x];
      curBlock.unDrawBlock(ctx);
      curBlock.moveDown();
      gameGrid[y][x] = null;
      gameGrid[y + 1][x] = curBlock;
      curBlock.drawBlock(ctx);
    }
  }
}
function shiftRowsDown(yStart) {
  for (let y = yStart; y >= 0; y--) {
    shiftRowDown(y);
  }
}

function incrementGameState() {
  const willSettle = curTetromino.willSettle(ctx);
  if (!willSettle) {
    curTetromino.nextStep(ctx);
    return;
  }
  curTetromino.writeToGameGrid(gameGrid);
  const affectedRows = curTetromino.getRows();
  for (let i = 0; i < affectedRows.length; i++) {
    if (checkRow(affectedRows[i])) {
      console.log("AFFECTED ROWS", affectedRows);
      clearRow(affectedRows[i]);
      shiftRowsDown(affectedRows[i]);
    }
  }
  curTetromino = new Tetromino("O").spawnTetromino(ctx);
  curTetromino.drawTetromino(ctx);
}
