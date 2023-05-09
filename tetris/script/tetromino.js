import { Block } from "./block";

export class Tetromino {
  constructor(type) {
    this.type = type;
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
    this.blocks = [];
    switch (this.type) {
      case "I":
        for (let i = 0; i < 4; i++) {
          this.blocks[i] = new Block(4, i, this.color);
        }
        break;
      case "O":
        this.blocks[0] = new Block(4, 0, this.color);
        this.blocks[1] = new Block(4, 1, this.color);
        this.blocks[2] = new Block(5, 0, this.color);
        this.blocks[3] = new Block(5, 1, this.color);
    }
  }

  drawTetromino(ctx) {
    for (let block of blocks) {
      block.drawBlock(ctx);
    }
  }
}
