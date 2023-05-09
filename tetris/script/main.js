class Tetromino {
  constructor(type) {
    this.type = type;
    this.blocks = [];
    switch (this.type) {
      case "I":
        this.color = "cyan";
        break;
      case "O":
        this.color = "yellow";
        break;
    }
  }

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

  drawTetromino(ctx) {
    for (let block of this.blocks) {
      block.drawBlock(ctx);
    }
  }

  unDrawTetromino(ctx) {
    for (let block of this.blocks) {
      block.unDrawBlock(ctx);
    }
  }

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

  nextStep(ctx) {
    if (this.willSettle()) {
      this.writeToGameGrid(gameGrid);
      newTetromino();
    } else {
      this.unDrawTetromino(ctx);
      for (let block of this.blocks) {
        block.moveDown();
      }
      this.drawTetromino(ctx);
    }
  }

  willCollide(direction) {
    for (let block of this.blocks) {
      if (block.willCollide(direction)) {
        console.log("will collide", direction);
        return true;
      }
    }
    return false;
  }

  willSettle() {
    for (let block of this.blocks) {
      if (block.willSettle()) {
        return true;
      }
    }
    return false;
  }

  writeToGameGrid(gameGrid) {
    for (let block of this.blocks) {
      gameGrid[block.getY()][block.getX()] = 1;
    }
    return gameGrid;
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
      return this.x - 1 < 0 || gameGrid[this.y][this.x - 1] !== 0;
    } else if (direction === "right") {
      return this.x + 1 >= Block.numCols || gameGrid[this.y][this.x + 1] !== 0;
    }
  }

  willSettle() {
    return this.y + 1 >= ROWS || gameGrid[this.y + 1][this.x] !== 0;
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
    gameGrid[i][j] = 0;
  }
}

// Canvas elements
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const boardHeight = (canvas.height = ROWS * blockSize);
const boardWidth = (canvas.width = COLS * blockSize);
Block.blockSize = blockSize;
Block.numCols = COLS;

let curTetromino;
const shape1 = new Tetromino("I");
curTetromino = shape1.spawnTetromino(ctx);

curTetromino.drawTetromino(ctx);

document.addEventListener("keydown", (event) => {
  if (event.key.toLowerCase() === "s") {
    curTetromino.nextStep(ctx);
  }
});
//
//
//
// Prints a string representation of a 2-D array

document.addEventListener("keydown", (event) => {
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
  }
});

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
